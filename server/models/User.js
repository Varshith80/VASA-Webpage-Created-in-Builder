const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Role and Status
    role: {
      type: String,
      enum: ["exporter", "importer", "admin", "super_admin", "support", "finance"],
      required: true,
    },
    permissions: [{
      type: String,
      enum: [
        // User management
        "users.view", "users.create", "users.edit", "users.delete", "users.suspend",
        // Product management
        "products.view", "products.create", "products.edit", "products.delete", "products.approve",
        // Order management
        "orders.view", "orders.create", "orders.edit", "orders.cancel", "orders.process",
        // Finance
        "finance.view", "finance.process_payments", "finance.refunds", "finance.reports",
        // System
        "system.settings", "system.logs", "system.backup", "system.maintenance",
        // Support
        "support.tickets", "support.disputes", "support.messages",
        // Analytics
        "analytics.view", "analytics.export"
      ]
    }],
    status: {
      type: String,
      enum: ["pending", "verified", "suspended", "rejected"],
      default: "pending",
    },

    // Company Information
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      enum: [
        "manufacturer",
        "trader",
        "wholesaler",
        "retailer",
        "service_provider",
      ],
      required: true,
    },

    // Address
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },

    // License and Compliance
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          // IEC (India Export-Import Code) validation - 10 digits
          // Can be extended for other countries
          return /^[A-Z0-9]{10}$/.test(v);
        },
        message: "License number must be 10 alphanumeric characters",
      },
    },
    licenseType: {
      type: String,
      enum: ["IEC", "EIN", "VAT", "GST", "OTHER"],
      required: true,
    },
    taxId: String,

    // KYC Documents
    kycDocuments: {
      governmentId: {
        fileName: String,
        filePath: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false },
      },
      businessLicense: {
        fileName: String,
        filePath: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false },
      },
      taxCertificate: {
        fileName: String,
        filePath: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false },
      },
      bankStatement: {
        fileName: String,
        filePath: String,
        uploadDate: Date,
        verified: { type: Boolean, default: false },
      },
    },

    // Profile Information
    profilePicture: String,
    bio: String,
    website: String,
    establishedYear: Number,
    employeeCount: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    },
    annualTurnover: {
      type: String,
      enum: ["<1M", "1M-5M", "5M-10M", "10M-50M", "50M+"],
    },

    // Trading Information
    tradingExperience: Number,
    primaryMarkets: [String],
    commoditiesDealt: [String],
    certifications: [String],

    // Platform Statistics
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // Preferences
    preferences: {
      language: { type: String, default: "en" },
      currency: { type: String, default: "USD" },
      timezone: { type: String, default: "UTC" },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
    },

    // Security
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    // Multi-Factor Authentication
    mfa: {
      enabled: { type: Boolean, default: false },
      secret: String, // Base32 encoded secret for TOTP
      backupCodes: [String], // Array of backup codes
      lastUsedBackupCode: String,
      preferredMethod: {
        type: String,
        enum: ["authenticator", "sms", "email"],
        default: "authenticator"
      },
      setupCompleted: { type: Boolean, default: false },
      tempSecret: String, // Temporary secret during setup
      smsCode: {
        code: String,
        generatedAt: Date,
        attempts: { type: Number, default: 0 }
      },
      emailCode: {
        code: String,
        generatedAt: Date,
        attempts: { type: Number, default: 0 }
      }
    },

    // Enhanced Security
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    suspiciousActivityDetected: { type: Boolean, default: false },
    trustedDevices: [{
      deviceId: String,
      deviceName: String,
      userAgent: String,
      ipAddress: String,
      addedAt: { type: Date, default: Date.now },
      lastUsed: Date
    }],

    // Activity Tracking
    lastActivity: Date,
    sessionIds: [String],

    // Timestamps
    registrationDate: { type: Date, default: Date.now },
    verificationDate: Date,
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ licenseNumber: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ "address.country": 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1,
    },
  });
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();

  // Remove sensitive information
  delete userObject.password;
  delete userObject.kycDocuments;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  delete userObject.mfa;
  delete userObject.trustedDevices;
  delete userObject.sessionIds;
  delete userObject.suspiciousActivityDetected;

  return userObject;
};

// Method to check if user has permission
userSchema.methods.hasPermission = function (permission) {
  // Super admin has all permissions
  if (this.role === 'super_admin') {
    return true;
  }

  // Check if user has specific permission
  return this.permissions && this.permissions.includes(permission);
};

// Method to add trusted device
userSchema.methods.addTrustedDevice = function (deviceInfo) {
  const deviceExists = this.trustedDevices.find(d => d.deviceId === deviceInfo.deviceId);

  if (!deviceExists) {
    this.trustedDevices.push({
      deviceId: deviceInfo.deviceId,
      deviceName: deviceInfo.deviceName || 'Unknown Device',
      userAgent: deviceInfo.userAgent,
      ipAddress: deviceInfo.ipAddress,
      lastUsed: new Date()
    });
  } else {
    deviceExists.lastUsed = new Date();
  }

  return this.save();
};

// Method to check if device is trusted
userSchema.methods.isDeviceTrusted = function (deviceId) {
  return this.trustedDevices.some(d => d.deviceId === deviceId);
};

// Static method to get role permissions
userSchema.statics.getRolePermissions = function (role) {
  const rolePermissions = {
    exporter: [
      'products.view', 'products.create', 'products.edit',
      'orders.view', 'orders.process',
      'analytics.view'
    ],
    importer: [
      'products.view',
      'orders.view', 'orders.create',
      'analytics.view'
    ],
    support: [
      'users.view', 'users.edit',
      'products.view', 'products.edit',
      'orders.view', 'orders.edit',
      'support.tickets', 'support.disputes', 'support.messages'
    ],
    finance: [
      'orders.view',
      'finance.view', 'finance.process_payments', 'finance.refunds', 'finance.reports',
      'analytics.view', 'analytics.export'
    ],
    admin: [
      'users.view', 'users.create', 'users.edit', 'users.suspend',
      'products.view', 'products.create', 'products.edit', 'products.delete', 'products.approve',
      'orders.view', 'orders.create', 'orders.edit', 'orders.cancel', 'orders.process',
      'finance.view', 'finance.process_payments', 'finance.refunds', 'finance.reports',
      'support.tickets', 'support.disputes', 'support.messages',
      'analytics.view', 'analytics.export',
      'system.logs'
    ],
    super_admin: ['*'] // All permissions
  };

  return rolePermissions[role] || [];
};

// Static method to find by license number
userSchema.statics.findByLicenseNumber = function (licenseNumber) {
  return this.findOne({ licenseNumber: licenseNumber.toUpperCase() });
};

// Auto-assign role permissions on user save
userSchema.pre('save', function(next) {
  if (this.isModified('role') || this.isNew) {
    this.permissions = this.constructor.getRolePermissions(this.role);
  }
  next();
});

export default mongoose.model("User", userSchema);
