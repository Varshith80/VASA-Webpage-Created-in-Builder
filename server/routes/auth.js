const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  createAuthRateLimit,
  logAuthEvent,
  authenticate
} = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const upload = require('../middleware/upload');

const router = express.Router();

// Rate limiting for auth routes
const authRateLimit = createAuthRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

// Validation rules
const registrationValidation = [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, lowercase letter, number, and special character'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('companyName').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
  body('role').isIn(['exporter', 'importer']).withMessage('Role must be either exporter or importer'),
  body('licenseNumber')
    .trim()
    .isLength({ min: 10, max: 10 })
    .matches(/^[A-Z0-9]{10}$/)
    .withMessage('License number must be 10 alphanumeric characters'),
  body('businessType').isIn(['manufacturer', 'trader', 'wholesaler', 'retailer', 'service_provider']).withMessage('Invalid business type'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.country').trim().notEmpty().withMessage('Country is required'),
  body('address.zipCode').trim().notEmpty().withMessage('ZIP code is required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', 
  authRateLimit,
  logAuthEvent('registration_attempt'),
  registrationValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        companyName,
        role,
        licenseNumber,
        businessType,
        address,
        taxId,
        website,
        establishedYear,
        employeeCount,
        annualTurnover
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email },
          { licenseNumber: licenseNumber.toUpperCase() }
        ]
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
          });
        }
        if (existingUser.licenseNumber === licenseNumber.toUpperCase()) {
          return res.status(400).json({
            success: false,
            message: 'User with this license number already exists'
          });
        }
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        companyName,
        role,
        licenseNumber: licenseNumber.toUpperCase(),
        businessType,
        address,
        taxId,
        website,
        establishedYear,
        employeeCount,
        annualTurnover,
        licenseType: 'IEC' // Default to IEC, can be determined by country later
      });

      await user.save();

      // Generate email verification token
      const emailToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = crypto.createHash('sha256').update(emailToken).digest('hex');
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;
      
      try {
        await sendEmail({
          to: user.email,
          subject: 'VASA Account Verification',
          template: 'email-verification',
          data: {
            name: user.fullName,
            verificationUrl,
            companyName: user.companyName
          }
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail registration if email fails
      }

      // Generate tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        data: {
          user: user.getPublicProfile(),
          token,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  authRateLimit,
  logAuthEvent('login_attempt'),
  loginValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts',
          lockUntil: user.lockUntil
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.getPublicProfile(),
          token,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Set HTTP-only cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  // Clear cookie
  res.clearCookie('token');
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   POST /api/auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.post('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password',
  authRateLimit,
  [body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const user = await User.findOne({ email });

      // Always return success to prevent email enumeration
      const successResponse = {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      };

      if (!user) {
        return res.json(successResponse);
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      // Send reset email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      
      try {
        await sendEmail({
          to: user.email,
          subject: 'VASA Password Reset',
          template: 'password-reset',
          data: {
            name: user.fullName,
            resetUrl,
            expiresIn: '10 minutes'
          }
        });
      } catch (emailError) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        return res.status(500).json({
          success: false,
          message: 'Error sending email. Please try again later.'
        });
      }

      res.json(successResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Password reset request failed'
      });
    }
  }
);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, lowercase letter, number, and special character')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Password validation failed',
          errors: errors.array()
        });
      }

      const { token } = req.params;
      const { password } = req.body;
      
      // Hash the token
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      
      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }
      
      // Update password
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
      
      res.json({
        success: true,
        message: 'Password reset successful'
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Password reset failed'
      });
    }
  }
);

// @route   PUT /api/auth/change-password
// @desc    Change password (authenticated user)
// @access  Private
router.put('/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, lowercase letter, number, and special character')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      
      // Get user with password
      const user = await User.findById(req.user._id).select('+password');
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      res.json({
        success: true,
        message: 'Password updated successfully'
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Password change failed'
      });
    }
  }
);

module.exports = router;
