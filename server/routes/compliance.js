import express from 'express';
import { auth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/security.js';
import { ComplianceChecker, COMPLIANCE_DATA } from '../utils/complianceChecker.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// Check product compliance for specific destination
router.post('/check', auth, apiLimiter, async (req, res) => {
  try {
    const { productId, destinationCountry, quantity = 1, value } = req.body;

    if (!productId || !destinationCountry) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and destination country are required'
      });
    }

    // Get product details
    const product = await Product.findById(productId).populate('seller', 'address.country');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const originCountry = product.seller?.address?.country || product.origin;
    const productValue = value || product.price;

    // Perform compliance check
    const complianceResult = ComplianceChecker.checkProductCompliance(
      product,
      originCountry,
      destinationCountry
    );

    // Get document requirements
    const documentRequirements = ComplianceChecker.getDocumentRequirements(
      complianceResult.requirements.filter(req => 
        req.toUpperCase() in COMPLIANCE_DATA.DOCUMENT_REQUIREMENTS
      )
    );

    // Calculate estimated duties
    const dutyEstimate = ComplianceChecker.calculateEstimatedDuties(
      product,
      destinationCountry,
      quantity,
      productValue
    );

    // Get HS code suggestions
    const hsCodeSuggestions = ComplianceChecker.getHSCodeSuggestions(product);

    // Get country-specific information
    const countryInfo = ComplianceChecker.getCountryRequirements(destinationCountry);

    res.json({
      success: true,
      data: {
        product: {
          id: product._id,
          title: product.title,
          category: product.category,
          origin: originCountry
        },
        destination: {
          country: destinationCountry,
          countryName: countryInfo?.name || destinationCountry
        },
        compliance: complianceResult,
        documents: documentRequirements,
        duties: dutyEstimate,
        hsCodeSuggestions,
        countryInfo: countryInfo ? {
          agencies: countryInfo.agencies,
          preferentialTrade: countryInfo.preferentialTrade
        } : null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Compliance check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform compliance check'
    });
  }
});

// Check shipping route compliance
router.post('/route-check', auth, apiLimiter, async (req, res) => {
  try {
    const { originCountry, destinationCountry, transitCountries = [] } = req.body;

    if (!originCountry || !destinationCountry) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination countries are required'
      });
    }

    const routeValidation = ComplianceChecker.validateShippingRoute(
      originCountry,
      destinationCountry,
      transitCountries
    );

    const originInfo = ComplianceChecker.getCountryRequirements(originCountry);
    const destinationInfo = ComplianceChecker.getCountryRequirements(destinationCountry);

    res.json({
      success: true,
      data: {
        route: {
          origin: { code: originCountry, name: originInfo?.name || originCountry },
          destination: { code: destinationCountry, name: destinationInfo?.name || destinationCountry },
          transit: transitCountries.map(country => ({
            code: country,
            name: ComplianceChecker.getCountryRequirements(country)?.name || country
          }))
        },
        validation: routeValidation,
        requirements: {
          export: originInfo?.generalRequirements || [],
          import: destinationInfo?.generalRequirements || []
        }
      }
    });

  } catch (error) {
    console.error('Route check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check shipping route'
    });
  }
});

// Get country-specific requirements
router.get('/countries/:countryCode', auth, async (req, res) => {
  try {
    const { countryCode } = req.params;
    const countryInfo = ComplianceChecker.getCountryRequirements(countryCode.toUpperCase());

    if (!countryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Country information not found'
      });
    }

    res.json({
      success: true,
      data: countryInfo
    });

  } catch (error) {
    console.error('Country requirements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get country requirements'
    });
  }
});

// Get supported countries list
router.get('/countries', auth, async (req, res) => {
  try {
    const countries = Object.entries(COMPLIANCE_DATA.COUNTRIES).map(([code, info]) => ({
      code,
      name: info.name,
      agencies: Object.keys(info.agencies).length,
      hasSpecialRestrictions: Object.keys(info.specialRestrictions).length > 0
    }));

    res.json({
      success: true,
      data: countries
    });

  } catch (error) {
    console.error('Countries list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get countries list'
    });
  }
});

// Get product category compliance info
router.get('/categories/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const categoryInfo = COMPLIANCE_DATA.PRODUCT_CATEGORIES[category];

    if (!categoryInfo) {
      return res.status(404).json({
        success: false,
        message: 'Category information not found'
      });
    }

    res.json({
      success: true,
      data: {
        category,
        ...categoryInfo,
        globalRestrictions: COMPLIANCE_DATA.RESTRICTED_ITEMS.categorySpecific[category] || []
      }
    });

  } catch (error) {
    console.error('Category compliance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category compliance info'
    });
  }
});

// Get HS code suggestions
router.post('/hs-codes', auth, apiLimiter, async (req, res) => {
  try {
    const { productDescription, category } = req.body;

    if (!productDescription && !category) {
      return res.status(400).json({
        success: false,
        message: 'Product description or category is required'
      });
    }

    const mockProduct = {
      title: productDescription || '',
      category: category || 'General',
      description: productDescription || ''
    };

    const hsCodeSuggestions = ComplianceChecker.getHSCodeSuggestions(mockProduct);

    res.json({
      success: true,
      data: hsCodeSuggestions
    });

  } catch (error) {
    console.error('HS code suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get HS code suggestions'
    });
  }
});

// Calculate duty estimate
router.post('/duty-estimate', auth, apiLimiter, async (req, res) => {
  try {
    const { productValue, quantity = 1, destinationCountry, hsCode } = req.body;

    if (!productValue || !destinationCountry) {
      return res.status(400).json({
        success: false,
        message: 'Product value and destination country are required'
      });
    }

    const mockProduct = { category: 'General' }; // For basic calculation
    const dutyEstimate = ComplianceChecker.calculateEstimatedDuties(
      mockProduct,
      destinationCountry,
      quantity,
      productValue
    );

    // Enhanced calculation with HS code if provided
    if (hsCode) {
      dutyEstimate.hsCode = hsCode;
      dutyEstimate.note += ` (HS Code: ${hsCode})`;
    }

    res.json({
      success: true,
      data: dutyEstimate
    });

  } catch (error) {
    console.error('Duty estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate duty estimate'
    });
  }
});

// Get document templates
router.get('/documents/:documentType', auth, async (req, res) => {
  try {
    const { documentType } = req.params;
    const docInfo = COMPLIANCE_DATA.DOCUMENT_REQUIREMENTS[documentType.toUpperCase()];

    if (!docInfo) {
      return res.status(404).json({
        success: false,
        message: 'Document type not found'
      });
    }

    // In a real implementation, you might return actual document templates
    const template = {
      type: documentType.toUpperCase(),
      ...docInfo,
      sampleUrl: `/api/compliance/documents/${documentType}/sample`,
      downloadUrl: `/api/compliance/documents/${documentType}/template`
    };

    res.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Document template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get document template'
    });
  }
});

// Bulk compliance check for orders
router.post('/bulk-check', auth, apiLimiter, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('buyer', 'address.country')
      .populate('items.seller', 'address.country');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const destinationCountry = order.buyer.address.country;
    const results = [];

    // Check compliance for each item in the order
    for (const item of order.items) {
      const product = item.product;
      const originCountry = item.seller.address.country || product.origin;
      
      const complianceResult = ComplianceChecker.checkProductCompliance(
        product,
        originCountry,
        destinationCountry
      );

      results.push({
        productId: product._id,
        productTitle: product.title,
        quantity: item.quantity,
        compliance: complianceResult,
        origin: originCountry
      });
    }

    // Aggregate results
    const overallCompliance = {
      compliant: results.every(r => r.compliance.compliant),
      totalWarnings: results.reduce((sum, r) => sum + r.compliance.warnings.length, 0),
      totalProhibitions: results.reduce((sum, r) => sum + r.compliance.prohibitions.length, 0),
      allRequirements: [...new Set(results.flatMap(r => r.compliance.requirements))],
      allRecommendations: [...new Set(results.flatMap(r => r.compliance.recommendations))]
    };

    res.json({
      success: true,
      data: {
        orderId,
        destinationCountry,
        overallCompliance,
        itemResults: results
      }
    });

  } catch (error) {
    console.error('Bulk compliance check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk compliance check'
    });
  }
});

export default router;
