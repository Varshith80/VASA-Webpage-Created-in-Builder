import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  Award,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Minus,
  Eye,
  MessageCircle,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    companyName: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    location: string;
  };
  specifications: Array<{
    name: string;
    value: string;
  }>;
  availability: {
    inStock: boolean;
    quantity: number;
    leadTime: string;
  };
  shipping: {
    methods: string[];
    estimatedDelivery: string;
    freeShipping: boolean;
  };
  certifications: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  minOrderQuantity: number;
  maxOrderQuantity: number;
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onSaveForLater?: (product: Product) => void;
  onShare?: (product: Product) => void;
  onContactSeller?: (product: Product) => void;
  className?: string;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onSaveForLater,
  onShare,
  onContactSeller,
  className = ""
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(product.minOrderQuantity || 1);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart?.(product, quantity);
      // Show success animation
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSaveForLater = () => {
    setIsSaved(!isSaved);
    onSaveForLater?.(product);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const min = product.minOrderQuantity || 1;
    const max = product.maxOrderQuantity || 10000;
    setQuantity(Math.max(min, Math.min(max, newQuantity)));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({product.reviewCount} reviews)
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-6xl max-h-[90vh] overflow-y-auto p-0 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column - Images */}
          <div className="relative bg-gray-50 p-6">
            <div className="relative aspect-square mb-4">
              <img
                src={product.images[selectedImageIndex] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <span className="text-sm text-gray-600">
                    {selectedImageIndex + 1} / {product.images.length}
                  </span>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveForLater}
                className={`absolute top-4 left-4 p-2 rounded-full shadow-lg transition-colors ${
                  isSaved 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isSaved ? <Heart className="h-5 w-5 fill-current" /> : <Heart className="h-5 w-5" />}
              </button>
            </div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </DialogTitle>
                  <div className="flex items-center gap-4 mb-4">
                    {renderStars(product.rating)}
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            {/* Price and Availability */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500">
                  {product.currency}
                </span>
                <span className="text-sm text-gray-500">
                  per unit
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className={product.availability.inStock ? 'text-green-600' : 'text-red-600'}>
                    {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">
                    {product.shipping.estimatedDelivery}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <Card className="mb-6 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {product.seller.companyName}
                      </span>
                      {product.seller.verified && (
                        <Shield className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      {renderStars(product.seller.rating, 'sm')}
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {product.seller.location}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onContactSeller?.(product)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </Card>

            {/* Quantity and Actions */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity:
                  </Label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= (product.minOrderQuantity || 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 border-0 text-center focus:ring-0"
                      min={product.minOrderQuantity || 1}
                      max={product.maxOrderQuantity || 10000}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.maxOrderQuantity || 10000)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Min: {product.minOrderQuantity || 1} units
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.availability.inStock || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Add to Cart
                </Button>
                
                <Button variant="outline" onClick={() => onShare?.(product)}>
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" onClick={handleSaveForLater}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {product.certifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {product.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-4">
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Methods</h4>
                    <div className="space-y-2">
                      {product.shipping.methods.map((method, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-700">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Estimated delivery: {product.shipping.estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>Lead time: {product.availability.leadTime}</span>
                      </div>
                      {product.shipping.freeShipping && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Free shipping available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* View Full Product Link */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Product Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
