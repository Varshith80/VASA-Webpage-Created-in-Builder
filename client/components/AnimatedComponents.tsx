import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  ShoppingCart, 
  Heart, 
  Star, 
  Plus, 
  Minus,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  TrendingUp,
  Gift
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

// Loading states and animations
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };
  
  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

export const PulsingDot: React.FC<{ color?: string, size?: 'sm' | 'md' | 'lg' }> = ({ 
  color = 'bg-blue-500', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };
  
  return (
    <div className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`} />
  );
};

// Success animations
export const SuccessCheckmark: React.FC<{ 
  show: boolean, 
  onComplete?: () => void,
  size?: 'sm' | 'md' | 'lg' 
}> = ({ show, onComplete, size = 'md' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20 animate-in fade-in duration-200">
      <div className="bg-white rounded-full p-4 shadow-lg animate-in zoom-in duration-300">
        <CheckCircle className={`${sizeClasses[size]} text-green-500 animate-in zoom-in duration-500 delay-100`} />
      </div>
    </div>
  );
};

// Add to cart animation
export const AddToCartButton: React.FC<{
  onAddToCart: () => void,
  disabled?: boolean,
  children?: React.ReactNode
}> = ({ onAddToCart, disabled = false, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      onAddToCart();
      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button 
        onClick={handleClick}
        disabled={disabled || isLoading}
        className="relative overflow-hidden transition-all duration-200 hover:shadow-lg"
      >
        <div className={`flex items-center gap-2 transition-all duration-300 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <ShoppingCart className="h-4 w-4" />
          {children || 'Add to Cart'}
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
        
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500 text-white animate-in zoom-in duration-200">
            <Check className="h-4 w-4" />
          </div>
        )}
      </Button>
      
      <SuccessCheckmark show={showSuccess} />
    </>
  );
};

// Heart animation for wishlist
export const AnimatedHeart: React.FC<{
  isLiked: boolean,
  onToggle: () => void,
  size?: 'sm' | 'md' | 'lg'
}> = ({ isLiked, onToggle, size = 'md' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const handleClick = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isLiked 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
      } ${isAnimating ? 'animate-bounce' : ''}`}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isLiked ? 'fill-current scale-110' : ''
        }`} 
      />
    </button>
  );
};

// Star rating with animation
export const AnimatedStarRating: React.FC<{
  rating: number,
  maxRating?: number,
  size?: 'sm' | 'md' | 'lg',
  interactive?: boolean,
  onRatingChange?: (rating: number) => void
}> = ({ rating, maxRating = 5, size = 'md', interactive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const handleStarClick = (starRating: number) => {
    if (!interactive) return;
    
    setIsAnimating(true);
    onRatingChange?.(starRating);
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;
        const isActive = starNumber <= (hoverRating || rating);
        
        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} transition-all duration-200 cursor-pointer ${
              isActive 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'hover:scale-110' : ''} ${
              isAnimating && starNumber <= rating ? 'animate-pulse' : ''
            }`}
            onClick={() => handleStarClick(starNumber)}
            onMouseEnter={() => interactive && setHoverRating(starNumber)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

// Notification toast animations
export const NotificationToast: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  message?: string,
  show: boolean,
  onClose: () => void,
  duration?: number
}> = ({ type, title, message, show, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);
  
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-500',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      iconColor: 'text-white'
    }
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  
  if (!show) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <Card className={`${config.bgColor} border-none shadow-lg min-w-80`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h4 className={`font-semibold ${config.textColor}`}>{title}</h4>
              {message && (
                <p className={`text-sm ${config.textColor} opacity-90 mt-1`}>{message}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className={`${config.textColor} hover:opacity-70 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Counter animation
export const AnimatedCounter: React.FC<{
  value: number,
  duration?: number,
  className?: string
}> = ({ value, duration = 1000, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (difference * easeOut));
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span className={className}>{displayValue.toLocaleString()}</span>;
};

// Quantity selector with animation
export const AnimatedQuantitySelector: React.FC<{
  quantity: number,
  onQuantityChange: (quantity: number) => void,
  min?: number,
  max?: number,
  size?: 'sm' | 'md' | 'lg'
}> = ({ quantity, onQuantityChange, min = 1, max = 999, size = 'md' }) => {
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const inputSizeClasses = {
    sm: 'h-8 w-16 text-sm',
    md: 'h-10 w-20 text-base',
    lg: 'h-12 w-24 text-lg'
  };
  
  const handleIncrement = () => {
    if (quantity < max) {
      setIsIncrementing(true);
      onQuantityChange(quantity + 1);
      setTimeout(() => setIsIncrementing(false), 150);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > min) {
      setIsDecrementing(true);
      onQuantityChange(quantity - 1);
      setTimeout(() => setIsDecrementing(false), 150);
    }
  };
  
  return (
    <div className="flex items-center border rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={`${sizeClasses[size]} rounded-none transition-all duration-150 ${
          isDecrementing ? 'scale-95 bg-gray-100' : ''
        }`}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || min;
          if (newValue >= min && newValue <= max) {
            onQuantityChange(newValue);
          }
        }}
        className={`${inputSizeClasses[size]} border-0 text-center focus:outline-none focus:ring-0 bg-transparent`}
        min={min}
        max={max}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`${sizeClasses[size]} rounded-none transition-all duration-150 ${
          isIncrementing ? 'scale-95 bg-gray-100' : ''
        }`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Progress indicator
export const AnimatedProgressBar: React.FC<{
  progress: number,
  showPercentage?: boolean,
  color?: string,
  height?: 'sm' | 'md' | 'lg',
  className?: string
}> = ({ progress, showPercentage = false, color = 'bg-blue-500', height = 'md', className = '' }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);
  
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[height]} overflow-hidden`}>
        <div 
          className={`${color} ${heightClasses[height]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, animatedProgress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          <AnimatedCounter value={Math.round(progress)} />%
        </div>
      )}
    </div>
  );
};

// Floating action button with ripple effect
export const FloatingActionButton: React.FC<{
  onClick: () => void,
  icon: React.ReactNode,
  label?: string,
  className?: string
}> = ({ onClick, icon, label, className = '' }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative overflow-hidden
        bg-blue-500 hover:bg-blue-600 text-white
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-200
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${label ? 'px-6 py-3' : 'p-4'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {icon}
        {label && <span className="font-medium">{label}</span>}
      </div>
      
      {isPressed && (
        <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping" />
      )}
    </button>
  );
};

// Badge with animation
export const AnimatedBadge: React.FC<{
  children: React.ReactNode,
  variant?: 'default' | 'success' | 'warning' | 'error',
  animate?: boolean,
  className?: string
}> = ({ children, variant = 'default', animate = false, className = '' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };
  
  return (
    <Badge 
      className={`
        ${variants[variant]} 
        transition-all duration-200 
        ${animate ? 'animate-pulse' : ''} 
        ${className}
      `}
    >
      {children}
    </Badge>
  );
};

export default {
  LoadingSpinner,
  PulsingDot,
  SuccessCheckmark,
  AddToCartButton,
  AnimatedHeart,
  AnimatedStarRating,
  NotificationToast,
  AnimatedCounter,
  AnimatedQuantitySelector,
  AnimatedProgressBar,
  FloatingActionButton,
  AnimatedBadge
};
