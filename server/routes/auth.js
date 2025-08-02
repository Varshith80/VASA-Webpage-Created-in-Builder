import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Mock database - in production, replace with actual database
const users = [
  {
    id: '1',
    email: 'demo@vasa.com',
    password: '$2a$10$K5V1YzQOT5ZQhH5rYzQOT5ZQhH5rYzQOT5ZQhH5rYzQOT5ZQhH5r.', // password: 'demo123'
    name: 'Demo User',
    role: 'importer',
    verified: true,
    googleId: null,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'exporter@vasa.com',
    password: '$2a$10$K5V1YzQOT5ZQhH5rYzQOT5ZQhH5rYzQOT5ZQhH5rYzQOT5ZQhH5r.', // password: 'demo123'
    name: 'Demo Exporter',
    role: 'exporter',
    verified: true,
    googleId: null,
    createdAt: new Date('2024-01-01'),
  }
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Google token is required'
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Check if user exists with this Google ID
    let user = users.find(u => u.googleId === googleId);
    
    // If not found by Google ID, check by email
    if (!user) {
      user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.picture = picture;
      }
    }

    // If still no user, create new user
    if (!user) {
      user = {
        id: (users.length + 1).toString(),
        email,
        name,
        role: 'importer', // Default role, can be changed during onboarding
        verified: false, // New Google users need to complete verification
        googleId,
        picture,
        password: null, // Google users don't have passwords
        createdAt: new Date(),
      };
      users.push(user);
    }

    // Generate token
    const authToken = generateToken(user);

    // Return user data
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: authToken
    });

  } catch (error) {
    console.error('Google auth error:', error);
    
    if (error.message?.includes('Invalid token')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Google token'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

// Logout (client-side mainly, but can be used to blacklist tokens)
router.post('/logout', (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Get current user (protected route)
router.get('/me', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (!['importer', 'exporter'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      verified: false,
      googleId: null,
      createdAt: new Date(),
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Always return success for security (don't reveal if email exists)
    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent password reset instructions.'
    });

    // In a real app, send email here
    if (user) {
      console.log(`Password reset requested for user: ${user.email}`);
      // TODO: Send email with reset link
    }

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

export default router;
