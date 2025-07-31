import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: object;
  robots?: string;
  alternateUrls?: Array<{
    hreflang: string;
    href: string;
  }>;
}

interface ProductSEOData {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  brand?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  seller: {
    name: string;
    location: string;
  };
  sku?: string;
  condition?: 'new' | 'used' | 'refurbished';
}

interface SEOManagerProps {
  pageType: 'home' | 'product' | 'category' | 'search' | 'profile' | 'custom';
  metaData?: SEOMetaData;
  productData?: ProductSEOData;
  categoryData?: {
    name: string;
    description: string;
    productCount: number;
  };
  searchData?: {
    query: string;
    resultCount: number;
  };
  customData?: any;
}

export const SEOManager: React.FC<SEOManagerProps> = ({
  pageType,
  metaData = {},
  productData,
  categoryData,
  searchData,
  customData
}) => {
  // Generate SEO data based on page type
  const generateSEOData = (): SEOMetaData => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vasa-platform.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : baseUrl;
    
    const defaultData: SEOMetaData = {
      title: 'VASA - Global Export-Import Trade Platform',
      description: 'Connect with verified exporters and importers worldwide. Secure transactions, compliance tools, and comprehensive trade solutions for international business.',
      keywords: ['export', 'import', 'trade', 'global commerce', 'B2B marketplace', 'international trade', 'exporters', 'importers'],
      canonicalUrl: currentUrl,
      ogType: 'website',
      ogTitle: 'VASA - Global Trade Platform',
      ogDescription: 'Professional export-import platform connecting global traders with secure transactions and compliance tools.',
      ogImage: `${baseUrl}/og-image.jpg`,
      twitterCard: 'summary_large_image',
      robots: 'index, follow'
    };

    switch (pageType) {
      case 'home':
        return {
          ...defaultData,
          title: 'VASA - Global Export-Import Trade Platform | Connect Worldwide Traders',
          description: 'Join VASA, the leading platform for international trade. Connect with verified exporters and importers, manage secure transactions, and access comprehensive compliance tools.',
          keywords: ['global trade platform', 'export import marketplace', 'international commerce', 'B2B trading', 'verified traders', 'trade compliance'],
          schema: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "VASA",
            "description": "Global Export-Import Trade Platform",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
            "sameAs": [
              "https://twitter.com/vasa_platform",
              "https://linkedin.com/company/vasa-platform"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-VASA-TRADE",
              "contactType": "customer service"
            }
          }
        };

      case 'product':
        if (!productData) return defaultData;
        
        const productTitle = `${productData.title} - ${productData.seller.name} | VASA Trade Platform`;
        const productDescription = `${productData.description.substring(0, 150)}... Buy from verified ${productData.category.toLowerCase()} exporters. Price: ${productData.currency} ${productData.price.toLocaleString()}`;
        
        return {
          ...defaultData,
          title: productTitle,
          description: productDescription,
          keywords: [
            productData.title.toLowerCase(),
            productData.category.toLowerCase(),
            'export',
            'import',
            'trade',
            productData.seller.location.toLowerCase(),
            ...(productData.brand ? [productData.brand.toLowerCase()] : [])
          ],
          ogTitle: productData.title,
          ogDescription: productDescription,
          ogImage: productData.images[0] || `${baseUrl}/placeholder-product.jpg`,
          ogType: 'product',
          twitterTitle: productData.title,
          twitterDescription: productDescription,
          twitterImage: productData.images[0] || `${baseUrl}/placeholder-product.jpg`,
          schema: {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productData.title,
            "description": productData.description,
            "image": productData.images,
            "brand": productData.brand ? {
              "@type": "Brand",
              "name": productData.brand
            } : undefined,
            "sku": productData.sku,
            "category": productData.category,
            "offers": {
              "@type": "Offer",
              "price": productData.price,
              "priceCurrency": productData.currency,
              "availability": `https://schema.org/${productData.availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
              "seller": {
                "@type": "Organization",
                "name": productData.seller.name,
                "address": {
                  "@type": "PostalAddress",
                  "addressRegion": productData.seller.location
                }
              },
              "itemCondition": `https://schema.org/${productData.condition === 'new' ? 'NewCondition' : productData.condition === 'used' ? 'UsedCondition' : 'RefurbishedCondition'}`
            },
            "aggregateRating": productData.rating && productData.reviewCount ? {
              "@type": "AggregateRating",
              "ratingValue": productData.rating,
              "reviewCount": productData.reviewCount
            } : undefined
          }
        };

      case 'category':
        if (!categoryData) return defaultData;
        
        const categoryTitle = `${categoryData.name} Export Import | ${categoryData.productCount} Products | VASA`;
        const categoryDescription = `Find verified ${categoryData.name.toLowerCase()} exporters and importers. Browse ${categoryData.productCount} products with secure trading and compliance support.`;
        
        return {
          ...defaultData,
          title: categoryTitle,
          description: categoryDescription,
          keywords: [
            categoryData.name.toLowerCase(),
            `${categoryData.name.toLowerCase()} export`,
            `${categoryData.name.toLowerCase()} import`,
            'trade',
            'marketplace',
            'B2B'
          ],
          ogTitle: `${categoryData.name} Trade Category`,
          ogDescription: categoryDescription,
          schema: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${categoryData.name} Products`,
            "description": categoryData.description,
            "numberOfItems": categoryData.productCount,
            "about": {
              "@type": "Thing",
              "name": categoryData.name
            }
          }
        };

      case 'search':
        if (!searchData) return defaultData;
        
        const searchTitle = `Search Results for "${searchData.query}" | ${searchData.resultCount} Products | VASA`;
        const searchDescription = `Found ${searchData.resultCount} products for "${searchData.query}". Connect with verified exporters and importers on VASA trade platform.`;
        
        return {
          ...defaultData,
          title: searchTitle,
          description: searchDescription,
          keywords: [
            searchData.query.toLowerCase(),
            `${searchData.query.toLowerCase()} export`,
            `${searchData.query.toLowerCase()} import`,
            'search',
            'trade',
            'marketplace'
          ],
          robots: searchData.resultCount > 0 ? 'index, follow' : 'noindex, follow',
          schema: {
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "query": searchData.query,
            "numberOfItems": searchData.resultCount
          }
        };

      case 'profile':
        return {
          ...defaultData,
          title: 'User Profile | VASA Trade Platform',
          description: 'Manage your VASA trading profile, view orders, track shipments, and connect with global trade partners.',
          robots: 'noindex, follow'
        };

      case 'custom':
        return {
          ...defaultData,
          ...metaData
        };

      default:
        return defaultData;
    }
  };

  const seoData = generateSEOData();

  // Add structured data to page
  useEffect(() => {
    if (seoData.schema && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(seoData.schema);
      script.id = 'structured-data';
      
      // Remove existing structured data
      const existingScript = document.getElementById('structured-data');
      if (existingScript) {
        existingScript.remove();
      }
      
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.getElementById('structured-data');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [seoData.schema]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      {seoData.keywords && (
        <meta name="keywords" content={seoData.keywords.join(', ')} />
      )}
      <meta name="robots" content={seoData.robots} />
      
      {/* Canonical URL */}
      {seoData.canonicalUrl && (
        <link rel="canonical" href={seoData.canonicalUrl} />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoData.ogTitle || seoData.title} />
      <meta property="og:description" content={seoData.ogDescription || seoData.description} />
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      {seoData.ogImage && (
        <>
          <meta property="og:image" content={seoData.ogImage} />
          <meta property="og:image:alt" content={seoData.ogTitle || seoData.title} />
        </>
      )}
      <meta property="og:site_name" content="VASA" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.twitterTitle || seoData.ogTitle || seoData.title} />
      <meta name="twitter:description" content={seoData.twitterDescription || seoData.ogDescription || seoData.description} />
      {seoData.twitterImage && (
        <meta name="twitter:image" content={seoData.twitterImage} />
      )}
      <meta name="twitter:site" content="@vasa_platform" />
      
      {/* Alternate Language URLs */}
      {seoData.alternateUrls?.map((alt, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.href}
        />
      ))}
      
      {/* Additional Meta Tags for Trade Platform */}
      <meta name="application-name" content="VASA" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="VASA Trade" />
      
      {/* Business/Commerce Specific */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="coverage" content="worldwide" />
      <meta name="target" content="all" />
      <meta name="audience" content="businesses, traders, exporters, importers" />
      
      {/* Security and Trust */}
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};

// SEO Hook for easy usage
export const useSEO = (config: {
  pageType: SEOManagerProps['pageType'];
  metaData?: SEOMetaData;
  productData?: ProductSEOData;
  categoryData?: SEOManagerProps['categoryData'];
  searchData?: SEOManagerProps['searchData'];
}) => {
  return <SEOManager {...config} />;
};

// SEO Utilities
export const SEOUtils = {
  // Generate breadcrumb schema
  generateBreadcrumbSchema: (breadcrumbs: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  }),

  // Generate FAQ schema
  generateFAQSchema: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // Generate review schema
  generateReviewSchema: (reviews: Array<{
    rating: number;
    author: string;
    datePublished: string;
    reviewBody: string;
  }>, productName: string) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "review": reviews.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.datePublished,
      "reviewBody": review.reviewBody
    }))
  }),

  // Generate Organization schema
  generateOrganizationSchema: (org: {
    name: string;
    description: string;
    url: string;
    logo: string;
    contactInfo: {
      phone?: string;
      email?: string;
      address?: string;
    };
  }) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": org.name,
    "description": org.description,
    "url": org.url,
    "logo": org.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": org.contactInfo.phone,
      "email": org.contactInfo.email,
      "contactType": "customer service"
    },
    "address": org.contactInfo.address ? {
      "@type": "PostalAddress",
      "streetAddress": org.contactInfo.address
    } : undefined
  }),

  // Clean text for meta descriptions
  cleanTextForMeta: (text: string, maxLength: number = 160): string => {
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, maxLength)
      .replace(/\s\S*$/, '') + '...';
  },

  // Generate keywords from text
  generateKeywords: (text: string, additionalKeywords: string[] = []): string[] => {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did'];
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 10);

    return [...new Set([...words, ...additionalKeywords])];
  }
};

export default SEOManager;
