import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle,
  Star,
  Award,
  Clock,
  Globe,
  Zap,
  Crown,
  Verified,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  variant:
    | "verified"
    | "premium"
    | "top-rated"
    | "fast-delivery"
    | "global"
    | "established"
    | "power-trader"
    | "elite"
    | "rising-star";
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TrustBadge({
  variant,
  className,
  showIcon = true,
  size = "md",
}: TrustBadgeProps) {
  const badgeConfig = {
    verified: {
      icon: CheckCircle,
      text: "Verified",
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    },
    premium: {
      icon: Crown,
      text: "Premium",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    },
    "top-rated": {
      icon: Star,
      text: "Top Rated",
      className:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    },
    "fast-delivery": {
      icon: Zap,
      text: "Fast Delivery",
      className:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    },
    global: {
      icon: Globe,
      text: "Global Reach",
      className:
        "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    },
    established: {
      icon: Clock,
      text: "Established",
      className:
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
    },
    "power-trader": {
      icon: TrendingUp,
      text: "Power Trader",
      className:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    },
    elite: {
      icon: Award,
      text: "Elite",
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    },
    "rising-star": {
      icon: Verified,
      text: "Rising Star",
      className:
        "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
    },
  };

  const config = badgeConfig[variant];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        sizeClasses[size],
        "font-medium inline-flex items-center gap-1",
        className,
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.text}
    </Badge>
  );
}

interface UserTrustIndicatorProps {
  user: {
    isVerified?: boolean;
    isPremium?: boolean;
    rating?: number;
    totalReviews?: number;
    establishedYear?: number;
    totalOrders?: number;
    successRate?: number;
    averageDeliveryTime?: number;
    hasGlobalReach?: boolean;
  };
  className?: string;
  maxBadges?: number;
}

export function UserTrustIndicator({
  user,
  className,
  maxBadges = 3,
}: UserTrustIndicatorProps) {
  const badges: Array<{
    variant: TrustBadgeProps["variant"];
    priority: number;
  }> = [];

  // Determine which badges to show based on user attributes
  if (user.isVerified) {
    badges.push({ variant: "verified", priority: 10 });
  }

  if (user.isPremium) {
    badges.push({ variant: "premium", priority: 9 });
  }

  if (
    user.rating &&
    user.rating >= 4.8 &&
    user.totalReviews &&
    user.totalReviews >= 50
  ) {
    badges.push({ variant: "top-rated", priority: 8 });
  }

  if (user.totalOrders && user.totalOrders >= 1000) {
    badges.push({ variant: "elite", priority: 9 });
  } else if (user.totalOrders && user.totalOrders >= 500) {
    badges.push({ variant: "power-trader", priority: 7 });
  }

  if (user.averageDeliveryTime && user.averageDeliveryTime <= 3) {
    badges.push({ variant: "fast-delivery", priority: 6 });
  }

  if (user.hasGlobalReach) {
    badges.push({ variant: "global", priority: 5 });
  }

  if (
    user.establishedYear &&
    new Date().getFullYear() - user.establishedYear >= 5
  ) {
    badges.push({ variant: "established", priority: 4 });
  }

  // Special case for new but promising traders
  if (
    user.totalOrders &&
    user.totalOrders < 50 &&
    user.rating &&
    user.rating >= 4.5
  ) {
    badges.push({ variant: "rising-star", priority: 3 });
  }

  // Sort by priority and take top badges
  const topBadges = badges
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxBadges);

  if (topBadges.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {topBadges.map((badge, index) => (
        <TrustBadge
          key={`${badge.variant}-${index}`}
          variant={badge.variant}
          size="sm"
        />
      ))}
    </div>
  );
}

interface ProductTrustIndicatorProps {
  product: {
    isVerified?: boolean;
    seller?: {
      isVerified?: boolean;
      isPremium?: boolean;
      rating?: number;
      totalReviews?: number;
    };
    hasQualityCertification?: boolean;
    isFeatured?: boolean;
    averageDeliveryTime?: number;
    category?: string;
  };
  className?: string;
}

export function ProductTrustIndicator({
  product,
  className,
}: ProductTrustIndicatorProps) {
  const badges: Array<{ variant: TrustBadgeProps["variant"]; show: boolean }> =
    [
      { variant: "verified", show: product.isVerified || false },
      { variant: "premium", show: product.seller?.isPremium || false },
      { variant: "top-rated", show: (product.seller?.rating || 0) >= 4.5 },
      {
        variant: "fast-delivery",
        show: (product.averageDeliveryTime || 0) <= 5,
      },
    ];

  const visibleBadges = badges.filter((badge) => badge.show);

  if (visibleBadges.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleBadges.map((badge, index) => (
        <TrustBadge
          key={`${badge.variant}-${index}`}
          variant={badge.variant}
          size="sm"
        />
      ))}
    </div>
  );
}

interface PlatformTrustSectionProps {
  className?: string;
}

export function PlatformTrustSection({ className }: PlatformTrustSectionProps) {
  const trustMetrics = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "End-to-end encrypted payments with escrow protection",
    },
    {
      icon: CheckCircle,
      title: "Verified Members",
      description: "All traders undergo KYC verification and background checks",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description:
        "Product quality guaranteed with inspection and certification",
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Fully compliant with international trade regulations",
    },
  ];

  return (
    <section className={cn("py-16 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Traders Trust VASA</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform is built on trust, security, and transparency to ensure
            safe and successful international trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{metric.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <TrustBadge variant="verified" size="lg" />
            <TrustBadge variant="premium" size="lg" />
            <TrustBadge variant="global" size="lg" />
            <TrustBadge variant="established" size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Example usage data for demonstration
export const sampleUsers = {
  premiumExporter: {
    isVerified: true,
    isPremium: true,
    rating: 4.9,
    totalReviews: 234,
    establishedYear: 2015,
    totalOrders: 1250,
    successRate: 99.2,
    averageDeliveryTime: 2,
    hasGlobalReach: true,
  },
  establishedImporter: {
    isVerified: true,
    isPremium: false,
    rating: 4.6,
    totalReviews: 89,
    establishedYear: 2018,
    totalOrders: 156,
    successRate: 98.1,
    averageDeliveryTime: 4,
    hasGlobalReach: false,
  },
  risingTrader: {
    isVerified: true,
    isPremium: false,
    rating: 4.7,
    totalReviews: 15,
    establishedYear: 2023,
    totalOrders: 28,
    successRate: 100,
    averageDeliveryTime: 3,
    hasGlobalReach: false,
  },
};

export const sampleProducts = {
  verifiedProduct: {
    isVerified: true,
    seller: sampleUsers.premiumExporter,
    hasQualityCertification: true,
    isFeatured: true,
    averageDeliveryTime: 3,
    category: "electronics",
  },
  standardProduct: {
    isVerified: false,
    seller: sampleUsers.establishedImporter,
    hasQualityCertification: false,
    isFeatured: false,
    averageDeliveryTime: 7,
    category: "textiles",
  },
};
