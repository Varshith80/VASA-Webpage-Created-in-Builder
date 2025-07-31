import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/security.js';

const router = express.Router();

// Global search endpoint
router.get('/global', auth, apiLimiter, async (req, res) => {
  try {
    const {
      q: query,
      type = 'all', // 'all', 'products', 'orders', 'users'
      limit = 10,
      page = 1,
      sortBy = 'relevance',
      filters = {}
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const results = {};
    const searchQuery = query.trim();
    const skip = (page - 1) * limit;

    // Build search regex for partial matching
    const searchRegex = new RegExp(searchQuery.split(' ').map(term => 
      `(?=.*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`
    ).join(''), 'i');

    // Search products
    if (type === 'all' || type === 'products') {
      const productSearchCriteria = {
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } },
          { specifications: { $elemMatch: { value: { $regex: searchRegex } } } }
        ],
        status: 'active'
      };

      // Apply filters
      if (filters.category) {
        productSearchCriteria.category = { $regex: new RegExp(filters.category, 'i') };
      }
      if (filters.minPrice || filters.maxPrice) {
        productSearchCriteria.price = {};
        if (filters.minPrice) productSearchCriteria.price.$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) productSearchCriteria.price.$lte = parseFloat(filters.maxPrice);
      }
      if (filters.country) {
        productSearchCriteria.origin = { $regex: new RegExp(filters.country, 'i') };
      }

      const products = await Product.find(productSearchCriteria)
        .populate('seller', 'companyName averageRating totalReviews')
        .sort(getSortCriteria(sortBy, 'product'))
        .skip(skip)
        .limit(parseInt(limit));

      const totalProducts = await Product.countDocuments(productSearchCriteria);

      results.products = {
        data: products,
        total: totalProducts,
        hasMore: totalProducts > skip + products.length
      };
    }

    // Search orders (only user's own orders unless admin)
    if (type === 'all' || type === 'orders') {
      const orderSearchCriteria = {
        $or: [
          { orderNumber: { $regex: searchRegex } },
          { 'items.productTitle': { $regex: searchRegex } },
          { status: { $regex: searchRegex } }
        ]
      };

      // Restrict to user's orders unless admin
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        orderSearchCriteria.$or.push(
          { buyer: req.user.id },
          { 'items.seller': req.user.id }
        );
      }

      // Apply filters
      if (filters.status) {
        orderSearchCriteria.status = filters.status;
      }
      if (filters.fromDate || filters.toDate) {
        orderSearchCriteria.createdAt = {};
        if (filters.fromDate) orderSearchCriteria.createdAt.$gte = new Date(filters.fromDate);
        if (filters.toDate) orderSearchCriteria.createdAt.$lte = new Date(filters.toDate);
      }

      const orders = await Order.find(orderSearchCriteria)
        .populate('buyer', 'companyName email')
        .populate('items.seller', 'companyName')
        .sort(getSortCriteria(sortBy, 'order'))
        .skip(skip)
        .limit(parseInt(limit));

      const totalOrders = await Order.countDocuments(orderSearchCriteria);

      results.orders = {
        data: orders,
        total: totalOrders,
        hasMore: totalOrders > skip + orders.length
      };
    }

    // Search users (admin only for privacy)
    if ((type === 'all' || type === 'users') && 
        ['admin', 'super_admin', 'support'].includes(req.user.role)) {
      
      const userSearchCriteria = {
        $or: [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { companyName: { $regex: searchRegex } },
          { licenseNumber: { $regex: searchRegex } }
        ]
      };

      // Apply filters
      if (filters.role) {
        userSearchCriteria.role = filters.role;
      }
      if (filters.status) {
        userSearchCriteria.status = filters.status;
      }
      if (filters.country) {
        userSearchCriteria['address.country'] = { $regex: new RegExp(filters.country, 'i') };
      }

      const users = await User.find(userSearchCriteria)
        .select('-password -mfa -trustedDevices -sessionIds')
        .sort(getSortCriteria(sortBy, 'user'))
        .skip(skip)
        .limit(parseInt(limit));

      const totalUsers = await User.countDocuments(userSearchCriteria);

      results.users = {
        data: users,
        total: totalUsers,
        hasMore: totalUsers > skip + users.length
      };
    }

    // Calculate total results across all categories
    const totalResults = Object.values(results).reduce((sum, category) => sum + category.total, 0);

    res.json({
      success: true,
      data: {
        query: searchQuery,
        type,
        totalResults,
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: Object.values(results).some(category => category.hasMore)
        }
      }
    });

  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// Search suggestions/autocomplete
router.get('/suggestions', auth, apiLimiter, async (req, res) => {
  try {
    const { q: query, type = 'all', limit = 5 } = req.query;

    if (!query || query.trim().length < 1) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchRegex = new RegExp(`^${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    const suggestions = [];

    // Product suggestions
    if (type === 'all' || type === 'products') {
      const productSuggestions = await Product.aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: searchRegex } },
              { category: { $regex: searchRegex } },
              { tags: { $in: [searchRegex] } }
            ],
            status: 'active'
          }
        },
        {
          $project: {
            title: 1,
            category: 1,
            image: { $arrayElemAt: ['$images', 0] },
            price: 1,
            type: { $literal: 'product' }
          }
        },
        { $limit: parseInt(limit) }
      ]);

      suggestions.push(...productSuggestions);
    }

    // Category suggestions
    if (type === 'all' || type === 'categories') {
      const categories = await Product.distinct('category', {
        category: { $regex: searchRegex }
      });
      
      categories.slice(0, limit).forEach(category => {
        suggestions.push({
          title: category,
          type: 'category'
        });
      });
    }

    // Company suggestions
    if (type === 'all' || type === 'companies') {
      const companies = await User.find({
        companyName: { $regex: searchRegex },
        status: 'verified'
      })
      .select('companyName averageRating address.country')
      .limit(parseInt(limit));

      companies.forEach(company => {
        suggestions.push({
          title: company.companyName,
          subtitle: company.address.country,
          rating: company.averageRating,
          type: 'company'
        });
      });
    }

    res.json({
      success: true,
      data: suggestions.slice(0, parseInt(limit) * 3) // Allow more suggestions for variety
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
});

// Popular searches
router.get('/popular', auth, apiLimiter, async (req, res) => {
  try {
    // In a real implementation, you'd track search queries in a database
    // For now, return popular categories and products
    
    const popularCategories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    const trendingProducts = await Product.find({ status: 'active' })
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(5)
      .select('title category price images');

    res.json({
      success: true,
      data: {
        popularCategories,
        trendingProducts
      }
    });

  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get popular searches'
    });
  }
});

// Search filters metadata
router.get('/filters', auth, async (req, res) => {
  try {
    const { type = 'products' } = req.query;

    const filters = {};

    if (type === 'products') {
      // Get available categories
      const categories = await Product.distinct('category');
      
      // Get price range
      const priceStats = await Product.aggregate([
        { $match: { status: 'active' } },
        { $group: { 
          _id: null, 
          minPrice: { $min: '$price' }, 
          maxPrice: { $max: '$price' } 
        }}
      ]);

      // Get available countries
      const countries = await Product.distinct('origin');

      filters.products = {
        categories: categories.sort(),
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 10000 },
        countries: countries.sort()
      };
    }

    if (type === 'orders') {
      const orderStatuses = await Order.distinct('status');
      filters.orders = {
        statuses: orderStatuses
      };
    }

    if (type === 'users' && ['admin', 'super_admin', 'support'].includes(req.user.role)) {
      const roles = await User.distinct('role');
      const statuses = await User.distinct('status');
      const countries = await User.distinct('address.country');

      filters.users = {
        roles: roles.sort(),
        statuses: statuses.sort(),
        countries: countries.sort()
      };
    }

    res.json({
      success: true,
      data: filters
    });

  } catch (error) {
    console.error('Search filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search filters'
    });
  }
});

// Helper function to get sort criteria
function getSortCriteria(sortBy, type) {
  const sortOptions = {
    product: {
      relevance: { title: 'text', category: 'text' },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { price: 1 },
      price_high: { price: -1 },
      popular: { viewCount: -1 },
      rating: { averageRating: -1 }
    },
    order: {
      relevance: { orderNumber: 'text' },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      amount_high: { totalAmount: -1 },
      amount_low: { totalAmount: 1 }
    },
    user: {
      relevance: { companyName: 'text', firstName: 'text' },
      newest: { registrationDate: -1 },
      oldest: { registrationDate: 1 },
      rating: { averageRating: -1 },
      name: { companyName: 1 }
    }
  };

  return sortOptions[type]?.[sortBy] || sortOptions[type].relevance;
}

export default router;
