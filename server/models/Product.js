const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'textiles', 'spices', 'electronics', 'machinery', 'chemicals',
      'food_products', 'raw_materials', 'handicrafts', 'leather_goods',
      'gems_jewelry', 'pharmaceuticals', 'automotive_parts', 'other'
    ]
  },
  subcategory: {
    type: String,
    required: true
  },
  
  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerInfo: {
    companyName: String,
    country: String,
    verificationStatus: String
  },
  
  // Product Details
  specifications: {
    material: String,
    color: String,
    size: String,
    weight: String,
    dimensions: String,
    grade: String,
    purity: String,
    origin: String,
    harvestYear: String,
    moistureContent: String,
    other: mongoose.Schema.Types.Mixed
  },
  
  // Pricing and Quantity
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CNY', 'JPY', 'CAD', 'AUD']
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'ton', 'piece', 'liter', 'meter', 'square_meter', 'cubic_meter']
    },
    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1
    },
    maximumOrderQuantity: Number,
    bulkDiscounts: [{
      quantity: Number,
      discountPercentage: Number
    }]
  },
  
  // Inventory
  inventory: {
    availableQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    reorderLevel: Number,
    stockLocation: String
  },
  
  // Media
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false },
    uploadDate: { type: Date, default: Date.now }
  }],
  videos: [{
    url: String,
    title: String,
    duration: Number,
    uploadDate: { type: Date, default: Date.now }
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // Certifications and Quality
  certifications: [{
    name: String,
    issuingAuthority: String,
    certificateNumber: String,
    issueDate: Date,
    expiryDate: Date,
    documentUrl: String,
    verified: { type: Boolean, default: false }
  }],
  qualityGrade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C', 'Standard', 'Premium', 'Export Quality']
  },
  qualityAssurance: {
    samplingAvailable: { type: Boolean, default: true },
    inspectionSupported: { type: Boolean, default: true },
    qualityGuarantee: { type: Boolean, default: true },
    returnPolicy: String
  },
  
  // Shipping and Logistics
  shipping: {
    packagingType: String,
    packagingDetails: String,
    shippingWeight: Number,
    shippingDimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    availablePorts: [String],
    leadTime: {
      min: Number, // in days
      max: Number
    },
    shippingTerms: {
      type: String,
      enum: ['FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DDU'],
      default: 'FOB'
    },
    insuranceIncluded: { type: Boolean, default: false }
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'sold_out', 'discontinued', 'pending_approval'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'featured'],
    default: 'public'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  
  // SEO and Search
  tags: [String],
  keywords: [String],
  hsCode: String, // Harmonized System Code for customs
  
  // Analytics and Performance
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  
  // Reviews and Ratings
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastViewedAt: Date,
  featuredUntil: Date,
  
  // Compliance and Legal
  exportLicense: String,
  restrictedCountries: [String],
  complianceNotes: String,
  
  // Additional Features
  isUrgent: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isPromoted: { type: Boolean, default: false },
  promotionExpiry: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and search
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ status: 1, visibility: 1 });
productSchema.index({ 'pricing.basePrice': 1 });
productSchema.index({ 'pricing.currency': 1 });
productSchema.index({ 'sellerInfo.country': 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ views: -1 });
productSchema.index({ isFeatured: 1, featuredUntil: 1 });

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.status === 'active' && 
         this.inventory.availableQuantity > this.inventory.reservedQuantity &&
         this.approvalStatus === 'approved';
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  const available = this.inventory.availableQuantity - this.inventory.reservedQuantity;
  if (available <= 0) return 'out_of_stock';
  if (available <= this.pricing.minimumOrderQuantity) return 'low_stock';
  return 'in_stock';
});

// Virtual for price range with bulk discounts
productSchema.virtual('priceRange').get(function() {
  if (!this.pricing.bulkDiscounts || this.pricing.bulkDiscounts.length === 0) {
    return {
      min: this.pricing.basePrice,
      max: this.pricing.basePrice
    };
  }
  
  const maxDiscount = Math.max(...this.pricing.bulkDiscounts.map(d => d.discountPercentage));
  const minPrice = this.pricing.basePrice * (1 - maxDiscount / 100);
  
  return {
    min: minPrice,
    max: this.pricing.basePrice
  };
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  
  next();
});

// Method to increment view count
productSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Method to increment inquiry count
productSchema.methods.incrementInquiries = function() {
  this.inquiries += 1;
  return this.save();
};

// Method to update availability
productSchema.methods.updateAvailability = function(quantityChange, isReservation = false) {
  if (isReservation) {
    this.inventory.reservedQuantity += quantityChange;
  } else {
    this.inventory.availableQuantity += quantityChange;
  }
  
  // Update status if sold out
  if (this.inventory.availableQuantity <= this.inventory.reservedQuantity) {
    this.status = 'sold_out';
  } else if (this.status === 'sold_out') {
    this.status = 'active';
  }
  
  return this.save();
};

// Method to calculate price with bulk discount
productSchema.methods.calculatePrice = function(quantity) {
  let price = this.pricing.basePrice;
  
  if (this.pricing.bulkDiscounts && this.pricing.bulkDiscounts.length > 0) {
    // Find applicable bulk discount
    const applicableDiscount = this.pricing.bulkDiscounts
      .filter(discount => quantity >= discount.quantity)
      .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
    
    if (applicableDiscount) {
      price = price * (1 - applicableDiscount.discountPercentage / 100);
    }
  }
  
  return price;
};

// Static method for search
productSchema.statics.search = function(query, filters = {}) {
  const searchQuery = { ...filters };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery)
    .populate('seller', 'companyName country averageRating totalReviews status')
    .sort({ score: { $meta: 'textScore' }, isFeatured: -1, createdAt: -1 });
};

// Static method to find by seller
productSchema.statics.findBySeller = function(sellerId) {
  return this.find({ seller: sellerId })
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Product', productSchema);
