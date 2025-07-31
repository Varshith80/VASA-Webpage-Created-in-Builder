import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { 
  generateMFASecret, 
  generateQRCode, 
  verifyMFAToken, 
  generateBackupCodes,
  verifyBackupCode,
  generateTOTP,
  verifyTOTP,
  MFA_METHODS,
  MFA_STATUS 
} from '../utils/mfa.js';
import { logAuthActivity } from '../utils/activityLogger.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Setup MFA - Generate secret and QR code
router.post('/setup', auth, authLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.mfa.enabled) {
      return res.status(400).json({
        success: false,
        message: 'MFA is already enabled for this account'
      });
    }
    
    // Generate MFA secret
    const mfaData = generateMFASecret(user.email, 'VASA');
    
    // Store temporary secret (not yet enabled)
    user.mfa.tempSecret = mfaData.secret;
    await user.save();
    
    // Generate QR code
    const qrCode = await generateQRCode(mfaData.otpauth_url);
    
    await logAuthActivity(user._id, 'MFA_SETUP_INITIATED', req, true, {
      method: 'authenticator'
    });
    
    res.json({
      success: true,
      data: {
        secret: mfaData.secret,
        qrCode,
        manualEntryKey: mfaData.manual_entry_key
      }
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup MFA'
    });
  }
});

// Verify and enable MFA
router.post('/verify-setup', auth, authLimiter, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'MFA token is required'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user.mfa.tempSecret) {
      return res.status(400).json({
        success: false,
        message: 'MFA setup not initiated. Please start setup first.'
      });
    }
    
    // Verify the token
    const isValid = verifyMFAToken(token, user.mfa.tempSecret);
    
    if (!isValid) {
      await logAuthActivity(user._id, 'MFA_VERIFICATION_FAILED', req, false, {
        method: 'authenticator'
      });
      
      return res.status(400).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }
    
    // Generate backup codes
    const backupCodes = generateBackupCodes();
    
    // Enable MFA
    user.mfa.enabled = true;
    user.mfa.secret = user.mfa.tempSecret;
    user.mfa.tempSecret = undefined;
    user.mfa.setupCompleted = true;
    user.mfa.backupCodes = backupCodes;
    user.mfa.preferredMethod = MFA_METHODS.AUTHENTICATOR;
    
    await user.save();
    
    await logAuthActivity(user._id, 'MFA_ENABLED', req, true, {
      method: 'authenticator'
    });
    
    res.json({
      success: true,
      message: 'MFA enabled successfully',
      backupCodes
    });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify MFA'
    });
  }
});

// Disable MFA
router.post('/disable', auth, authLimiter, async (req, res) => {
  try {
    const { password, token } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to disable MFA'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // If MFA is enabled, require MFA token to disable
    if (user.mfa.enabled) {
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'MFA token is required to disable MFA'
        });
      }
      
      const isTokenValid = verifyMFAToken(token, user.mfa.secret) || 
                          verifyBackupCode(token, user.mfa.backupCodes);
      
      if (!isTokenValid) {
        await logAuthActivity(user._id, 'MFA_DISABLE_FAILED', req, false);
        return res.status(400).json({
          success: false,
          message: 'Invalid MFA token'
        });
      }
    }
    
    // Disable MFA
    user.mfa = {
      enabled: false,
      setupCompleted: false
    };
    
    await user.save();
    
    await logAuthActivity(user._id, 'MFA_DISABLED', req, true);
    
    res.json({
      success: true,
      message: 'MFA disabled successfully'
    });
  } catch (error) {
    console.error('MFA disable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable MFA'
    });
  }
});

// Generate new backup codes
router.post('/backup-codes/regenerate', auth, authLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user.mfa.enabled) {
      return res.status(400).json({
        success: false,
        message: 'MFA is not enabled'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // Generate new backup codes
    const backupCodes = generateBackupCodes();
    user.mfa.backupCodes = backupCodes;
    
    await user.save();
    
    await logAuthActivity(user._id, 'MFA_BACKUP_CODES_REGENERATED', req, true);
    
    res.json({
      success: true,
      backupCodes
    });
  } catch (error) {
    console.error('Backup codes regeneration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate backup codes'
    });
  }
});

// Send SMS/Email OTP
router.post('/send-otp', auth, authLimiter, async (req, res) => {
  try {
    const { method } = req.body; // 'sms' or 'email'
    
    if (!['sms', 'email'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP method'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Generate OTP
    const otp = generateTOTP();
    const generatedAt = new Date();
    
    if (method === 'sms') {
      user.mfa.smsCode = {
        code: otp,
        generatedAt,
        attempts: 0
      };
      // TODO: Implement SMS sending logic
      console.log(`SMS OTP for ${user.phone}: ${otp}`);
    } else if (method === 'email') {
      user.mfa.emailCode = {
        code: otp,
        generatedAt,
        attempts: 0
      };
      // TODO: Implement email sending logic
      console.log(`Email OTP for ${user.email}: ${otp}`);
    }
    
    await user.save();
    
    await logAuthActivity(user._id, 'MFA_OTP_SENT', req, true, { method });
    
    res.json({
      success: true,
      message: `OTP sent to your ${method === 'sms' ? 'phone' : 'email'}`
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// Verify MFA token during login
router.post('/verify', authLimiter, async (req, res) => {
  try {
    const { userId, token, method = 'authenticator' } = req.body;
    
    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'User ID and token are required'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let isValid = false;
    
    switch (method) {
      case 'authenticator':
        isValid = verifyMFAToken(token, user.mfa.secret);
        break;
        
      case 'backup_code':
        isValid = verifyBackupCode(token, user.mfa.backupCodes);
        if (isValid) {
          await user.save(); // Save updated backup codes (with used code removed)
        }
        break;
        
      case 'sms':
        if (user.mfa.smsCode.attempts >= 3) {
          return res.status(429).json({
            success: false,
            message: 'Too many SMS verification attempts'
          });
        }
        user.mfa.smsCode.attempts += 1;
        isValid = verifyTOTP(token, user.mfa.smsCode.code, user.mfa.smsCode.generatedAt);
        await user.save();
        break;
        
      case 'email':
        if (user.mfa.emailCode.attempts >= 3) {
          return res.status(429).json({
            success: false,
            message: 'Too many email verification attempts'
          });
        }
        user.mfa.emailCode.attempts += 1;
        isValid = verifyTOTP(token, user.mfa.emailCode.code, user.mfa.emailCode.generatedAt);
        await user.save();
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid verification method'
        });
    }
    
    await logAuthActivity(user._id, 'MFA_VERIFIED', req, isValid, { method });
    
    if (isValid) {
      res.json({
        success: true,
        message: 'MFA verification successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid MFA token'
      });
    }
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify MFA'
    });
  }
});

// Get MFA status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        enabled: user.mfa.enabled,
        setupCompleted: user.mfa.setupCompleted,
        preferredMethod: user.mfa.preferredMethod,
        backupCodesCount: user.mfa.backupCodes ? user.mfa.backupCodes.length : 0,
        methods: {
          authenticator: user.mfa.secret ? true : false,
          sms: user.phoneVerified,
          email: user.emailVerified
        }
      }
    });
  } catch (error) {
    console.error('MFA status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get MFA status'
    });
  }
});

export default router;
