import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Generate MFA secret for user
export const generateMFASecret = (userEmail, serviceName = 'VASA') => {
  const secret = speakeasy.generateSecret({
    name: `${serviceName} (${userEmail})`,
    issuer: serviceName,
    length: 32
  });
  
  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
    qr_code_ascii: secret.ascii,
    manual_entry_key: secret.base32
  };
};

// Generate QR code for MFA setup
export const generateQRCode = async (otpauth_url) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauth_url);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

// Verify MFA token
export const verifyMFAToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1 // Allow 1 step tolerance for time sync issues
  });
};

// Generate backup codes for MFA
export const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric backup codes
    const code = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
};

// Verify backup code
export const verifyBackupCode = (inputCode, storedCodes) => {
  const normalizedInput = inputCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const index = storedCodes.findIndex(code => code === normalizedInput);
  
  if (index !== -1) {
    // Remove used backup code
    storedCodes.splice(index, 1);
    return true;
  }
  
  return false;
};

// Generate time-based OTP for SMS/Email
export const generateTOTP = () => {
  // Generate 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify time-based OTP with expiration
export const verifyTOTP = (inputCode, storedCode, generatedAt, expirationMinutes = 5) => {
  if (!inputCode || !storedCode || !generatedAt) {
    return false;
  }
  
  const now = new Date();
  const generated = new Date(generatedAt);
  const expirationTime = new Date(generated.getTime() + (expirationMinutes * 60 * 1000));
  
  // Check if code has expired
  if (now > expirationTime) {
    return false;
  }
  
  // Check if codes match
  return inputCode.toString() === storedCode.toString();
};

// MFA methods enum
export const MFA_METHODS = {
  AUTHENTICATOR: 'authenticator',
  SMS: 'sms',
  EMAIL: 'email',
  BACKUP_CODES: 'backup_codes'
};

// MFA status enum
export const MFA_STATUS = {
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  PENDING_SETUP: 'pending_setup'
};
