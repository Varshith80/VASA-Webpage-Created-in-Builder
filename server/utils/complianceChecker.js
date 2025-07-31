// Comprehensive trade compliance data for major trading countries
export const COMPLIANCE_DATA = {
  // Product-specific regulations
  PRODUCT_CATEGORIES: {
    'Electronics': {
      commonRestrictions: ['CE_MARKING', 'FCC_CERTIFICATION', 'RoHS_COMPLIANCE'],
      dangerousGoods: false,
      specialLicensing: ['DUAL_USE_TECHNOLOGY']
    },
    'Pharmaceuticals': {
      commonRestrictions: ['FDA_APPROVAL', 'WHO_CERTIFICATION', 'DRUG_LICENSE'],
      dangerousGoods: true,
      specialLicensing: ['CONTROLLED_SUBSTANCES', 'NARCOTICS_PERMIT'],
      temperatureControlled: true
    },
    'Food & Beverages': {
      commonRestrictions: ['HACCP_CERTIFICATION', 'ORGANIC_CERTIFICATION', 'HALAL_CERTIFICATION'],
      dangerousGoods: false,
      specialLicensing: ['FOOD_SAFETY_LICENSE'],
      temperatureControlled: true,
      shelfLife: true
    },
    'Chemicals': {
      commonRestrictions: ['SDS_SHEETS', 'REACH_REGISTRATION', 'GHS_LABELING'],
      dangerousGoods: true,
      specialLicensing: ['HAZMAT_LICENSE', 'CHEMICAL_EXPORT_LICENSE'],
      temperatureControlled: true
    },
    'Textiles': {
      commonRestrictions: ['OEKO_TEX_STANDARD', 'COUNTRY_OF_ORIGIN_MARKING'],
      dangerousGoods: false,
      specialLicensing: []
    },
    'Machinery': {
      commonRestrictions: ['CE_MARKING', 'MACHINERY_DIRECTIVE', 'SAFETY_STANDARDS'],
      dangerousGoods: false,
      specialLicensing: ['DUAL_USE_TECHNOLOGY']
    },
    'Agricultural Products': {
      commonRestrictions: ['PHYTOSANITARY_CERTIFICATE', 'ORGANIC_CERTIFICATION', 'PESTICIDE_RESIDUE_TEST'],
      dangerousGoods: false,
      specialLicensing: ['PLANT_QUARANTINE'],
      temperatureControlled: true,
      shelfLife: true
    }
  },

  // Country-specific requirements
  COUNTRIES: {
    'US': {
      name: 'United States',
      generalRequirements: [
        'Commercial Invoice',
        'Bill of Lading/Airway Bill',
        'Packing List',
        'Export Declaration (EEI)',
        'Certificate of Origin'
      ],
      agencies: {
        customs: 'CBP (Customs and Border Protection)',
        foodSafety: 'FDA (Food and Drug Administration)',
        agriculture: 'USDA (Department of Agriculture)',
        export: 'BIS (Bureau of Industry and Security)'
      },
      specialRestrictions: {
        'Electronics': ['FCC_ID', 'ENERGY_STAR'],
        'Food & Beverages': ['FDA_REGISTRATION', 'NUTRITION_LABELING'],
        'Pharmaceuticals': ['FDA_APPROVAL', 'DEA_REGISTRATION'],
        'Chemicals': ['EPA_REGISTRATION', 'TSCA_COMPLIANCE']
      },
      prohibitedItems: [
        'Certain Cuban products',
        'Iranian goods',
        'North Korean products',
        'Counterfeit goods'
      ],
      dutyRates: 'Varies by HTS code',
      preferentialTrade: ['USMCA', 'GSP']
    },
    'EU': {
      name: 'European Union',
      generalRequirements: [
        'Commercial Invoice',
        'Transport Document',
        'Packing List',
        'EUR.1 Certificate (for preferential rates)',
        'Certificate of Origin'
      ],
      agencies: {
        customs: 'European Commission DG TAXUD',
        foodSafety: 'EFSA (European Food Safety Authority)',
        chemicals: 'ECHA (European Chemicals Agency)'
      },
      specialRestrictions: {
        'Electronics': ['CE_MARKING', 'WEEE_DIRECTIVE', 'RoHS_COMPLIANCE'],
        'Food & Beverages': ['EFSA_APPROVAL', 'NOVEL_FOOD_REGULATION'],
        'Chemicals': ['REACH_REGISTRATION', 'CLP_REGULATION'],
        'Textiles': ['REACH_COMPLIANCE', 'TEXTILE_LABELING']
      },
      prohibitedItems: [
        'Products from certain sanctioned countries',
        'Ivory and endangered species products',
        'Conflict minerals'
      ],
      dutyRates: 'EU Common Customs Tariff',
      preferentialTrade: ['GSP', 'EPA', 'FTA agreements']
    },
    'IN': {
      name: 'India',
      generalRequirements: [
        'Commercial Invoice',
        'Bill of Lading/Airway Bill',
        'Packing List',
        'Certificate of Origin',
        'Insurance Certificate'
      ],
      agencies: {
        customs: 'CBIC (Central Board of Indirect Taxes and Customs)',
        foodSafety: 'FSSAI (Food Safety and Standards Authority)',
        agriculture: 'Department of Agriculture',
        pharmaceuticals: 'CDSCO (Central Drugs Standard Control Organisation)'
      },
      specialRestrictions: {
        'Electronics': ['BIS_CERTIFICATION', 'WIRELESS_PLANNING_COORDINATION'],
        'Food & Beverages': ['FSSAI_LICENSE', 'AGMARK_CERTIFICATION'],
        'Pharmaceuticals': ['DRUG_LICENSE', 'CDSCO_APPROVAL'],
        'Chemicals': ['POLLUTION_CONTROL_CLEARANCE', 'HAZARDOUS_WASTE_AUTHORIZATION']
      },
      prohibitedItems: [
        'Beef and beef products',
        'Certain chemicals and pesticides',
        'Used/refurbished goods (restrictions apply)'
      ],
      dutyRates: 'India Customs Tariff',
      preferentialTrade: ['SAFTA', 'ASEAN-India FTA', 'GSP']
    },
    'CN': {
      name: 'China',
      generalRequirements: [
        'Commercial Invoice',
        'Transport Document',
        'Packing List',
        'Certificate of Origin',
        'Customs Declaration'
      ],
      agencies: {
        customs: 'GACC (General Administration of Customs)',
        foodSafety: 'SAMR (State Administration for Market Regulation)',
        agriculture: 'Ministry of Agriculture and Rural Affairs'
      },
      specialRestrictions: {
        'Electronics': ['CCC_CERTIFICATION', 'NETWORK_ACCESS_LICENSE'],
        'Food & Beverages': ['FOOD_SAFETY_CERTIFICATE', 'HEALTH_CERTIFICATE'],
        'Pharmaceuticals': ['NMPA_APPROVAL', 'DRUG_REGISTRATION'],
        'Chemicals': ['CHEMICAL_REGISTRATION', 'SAFETY_ASSESSMENT']
      },
      prohibitedItems: [
        'Used machinery',
        'Right-hand drive vehicles',
        'Certain publications and media'
      ],
      dutyRates: 'China Customs Tariff',
      preferentialTrade: ['RCEP', 'ASEAN-China FTA', 'Belt and Road Initiative']
    },
    'GB': {
      name: 'United Kingdom',
      generalRequirements: [
        'Commercial Invoice',
        'Transport Document',
        'Packing List',
        'Certificate of Origin',
        'Import License (if required)'
      ],
      agencies: {
        customs: 'HMRC (HM Revenue and Customs)',
        foodSafety: 'FSA (Food Standards Agency)',
        pharmaceuticals: 'MHRA (Medicines and Healthcare products Regulatory Agency)'
      },
      specialRestrictions: {
        'Electronics': ['UKCA_MARKING', 'RADIO_EQUIPMENT_REGULATIONS'],
        'Food & Beverages': ['FSA_APPROVAL', 'FOOD_LABELING_STANDARDS'],
        'Pharmaceuticals': ['MHRA_LICENSE', 'GOOD_MANUFACTURING_PRACTICE'],
        'Chemicals': ['UK_REACH', 'CLASSIFICATION_LABELING_PACKAGING']
      },
      prohibitedItems: [
        'Offensive weapons',
        'Counterfeit goods',
        'Endangered species products'
      ],
      dutyRates: 'UK Global Tariff',
      preferentialTrade: ['GSP', 'UK-EU TCA']
    }
  },

  // Document requirements by category
  DOCUMENT_REQUIREMENTS: {
    'CERTIFICATE_OF_ORIGIN': {
      description: 'Document certifying the country of manufacture or production',
      issuingAuthority: 'Chamber of Commerce or designated authority',
      validity: '12 months from issue date',
      digitalAvailable: true
    },
    'COMMERCIAL_INVOICE': {
      description: 'Detailed invoice showing transaction value and terms',
      issuingAuthority: 'Exporter/Seller',
      validity: 'No expiry',
      requiredFields: ['Buyer/Seller details', 'Product description', 'Quantity', 'Unit price', 'Total value', 'Terms of sale']
    },
    'PACKING_LIST': {
      description: 'Detailed list of package contents and specifications',
      issuingAuthority: 'Exporter/Freight forwarder',
      validity: 'No expiry',
      requiredFields: ['Package dimensions', 'Weight', 'Contents', 'Marks and numbers']
    },
    'PHYTOSANITARY_CERTIFICATE': {
      description: 'Certificate for plant and plant products health status',
      issuingAuthority: 'National Plant Protection Organization',
      validity: '14 days from issue',
      applicableCategories: ['Agricultural Products', 'Food & Beverages']
    },
    'HEALTH_CERTIFICATE': {
      description: 'Certificate for animal products health status',
      issuingAuthority: 'Veterinary authority',
      validity: '30 days from issue',
      applicableCategories: ['Food & Beverages', 'Agricultural Products']
    }
  },

  // Restricted/Prohibited items
  RESTRICTED_ITEMS: {
    global: [
      'Nuclear materials',
      'Chemical weapons',
      'Biological weapons',
      'Torture equipment',
      'Conflict diamonds',
      'Counterfeit goods',
      'Endangered species (CITES)',
      'Ozone-depleting substances'
    ],
    categorySpecific: {
      'Pharmaceuticals': ['Controlled substances', 'Narcotics', 'Psychotropic substances'],
      'Chemicals': ['Dual-use chemicals', 'Precursor chemicals', 'Toxic substances'],
      'Electronics': ['Cryptographic equipment', 'Surveillance equipment', 'Military electronics'],
      'Food & Beverages': ['Genetically modified organisms (some countries)', 'Irradiated foods', 'Novel foods']
    }
  }
};

// Compliance checker functions
export class ComplianceChecker {
  static checkProductCompliance(product, originCountry, destinationCountry) {
    const results = {
      compliant: true,
      warnings: [],
      requirements: [],
      prohibitions: [],
      recommendations: []
    };

    const category = product.category;
    const destination = COMPLIANCE_DATA.COUNTRIES[destinationCountry];
    
    if (!destination) {
      results.warnings.push(`Compliance data not available for ${destinationCountry}`);
      return results;
    }

    // Check general requirements
    results.requirements.push(...destination.generalRequirements);

    // Check category-specific requirements
    const categoryReqs = destination.specialRestrictions[category];
    if (categoryReqs) {
      results.requirements.push(...categoryReqs);
    }

    // Check for prohibited items
    const productRestrictions = COMPLIANCE_DATA.PRODUCT_CATEGORIES[category];
    if (productRestrictions) {
      // Check if it's dangerous goods
      if (productRestrictions.dangerousGoods) {
        results.requirements.push('Dangerous Goods Declaration');
        results.requirements.push('Proper shipping classification');
        results.warnings.push('Product classified as dangerous goods - special handling required');
      }

      // Check for special licensing
      if (productRestrictions.specialLicensing?.length > 0) {
        results.requirements.push(...productRestrictions.specialLicensing.map(license => 
          `Special License: ${license.replace(/_/g, ' ')}`
        ));
      }

      // Temperature control requirements
      if (productRestrictions.temperatureControlled) {
        results.requirements.push('Temperature monitoring documentation');
        results.recommendations.push('Use refrigerated transport if required');
      }

      // Shelf life considerations
      if (productRestrictions.shelfLife) {
        results.requirements.push('Product expiry date documentation');
        results.recommendations.push('Ensure adequate shelf life for transit time');
      }
    }

    // Check for country-specific prohibitions
    const prohibitions = destination.prohibitedItems || [];
    prohibitions.forEach(item => {
      if (this.matchesProhibition(product, item)) {
        results.prohibitions.push(item);
        results.compliant = false;
      }
    });

    // Check global restrictions
    COMPLIANCE_DATA.RESTRICTED_ITEMS.global.forEach(item => {
      if (this.matchesProhibition(product, item)) {
        results.prohibitions.push(`Global restriction: ${item}`);
        results.compliant = false;
      }
    });

    // Add recommendations based on destination
    if (destination.preferentialTrade?.length > 0) {
      results.recommendations.push(
        `Consider preferential trade agreements: ${destination.preferentialTrade.join(', ')}`
      );
    }

    return results;
  }

  static matchesProhibition(product, prohibition) {
    // Simple matching logic - in production, this would be more sophisticated
    const keywords = prohibition.toLowerCase().split(' ');
    const productText = `${product.title} ${product.description} ${product.category}`.toLowerCase();
    
    return keywords.some(keyword => productText.includes(keyword));
  }

  static getDocumentRequirements(documents) {
    return documents.map(docType => {
      const docInfo = COMPLIANCE_DATA.DOCUMENT_REQUIREMENTS[docType.toUpperCase()];
      return {
        type: docType,
        ...docInfo
      };
    });
  }

  static getCountryRequirements(countryCode) {
    return COMPLIANCE_DATA.COUNTRIES[countryCode] || null;
  }

  static calculateEstimatedDuties(product, destinationCountry, quantity, value) {
    // Simplified duty calculation - in production, integrate with tariff APIs
    const baseRates = {
      'US': 0.05,    // 5% average
      'EU': 0.04,    // 4% average
      'IN': 0.10,    // 10% average
      'CN': 0.08,    // 8% average
      'GB': 0.06     // 6% average
    };

    const rate = baseRates[destinationCountry] || 0.05;
    const estimatedDuty = value * quantity * rate;

    return {
      estimatedDuty,
      rate: rate * 100,
      currency: 'USD',
      note: 'Estimated duties - actual rates may vary based on specific HS codes and trade agreements'
    };
  }

  static getHSCodeSuggestions(product) {
    // Simplified HS code mapping - in production, use comprehensive database
    const hsCodes = {
      'Electronics': ['8517', '8523', '8543'],
      'Textiles': ['6109', '6204', '6302'],
      'Chemicals': ['2905', '3204', '3808'],
      'Food & Beverages': ['2008', '2202', '1905'],
      'Machinery': ['8479', '8421', '8413'],
      'Agricultural Products': ['0709', '0803', '1006'],
      'Pharmaceuticals': ['3003', '3004', '3006']
    };

    const suggestions = hsCodes[product.category] || [];
    return suggestions.map(code => ({
      code,
      description: `HS Code ${code} - ${product.category}`,
      confidence: 'medium'
    }));
  }

  static validateShippingRoute(originCountry, destinationCountry, transitCountries = []) {
    const issues = [];
    const recommendations = [];

    // Check for transit country complications
    transitCountries.forEach(transit => {
      const transitInfo = COMPLIANCE_DATA.COUNTRIES[transit];
      if (transitInfo) {
        recommendations.push(`Transit through ${transitInfo.name} - ensure compliance with transit regulations`);
      }
    });

    // Check for sanctions
    const sanctionedRoutes = {
      'IR': 'Iran - Special sanctions apply',
      'KP': 'North Korea - Prohibited',
      'SY': 'Syria - Restricted'
    };

    [originCountry, destinationCountry, ...transitCountries].forEach(country => {
      if (sanctionedRoutes[country]) {
        issues.push(sanctionedRoutes[country]);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }
}

export default ComplianceChecker;
