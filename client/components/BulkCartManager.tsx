import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Truck, 
  DollarSign, 
  Package, 
  Users, 
  Calendar,
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileText,
  Calculator,
  Globe,
  Building2,
  CreditCard,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  quantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  seller: {
    id: string;
    name: string;
    companyName: string;
    location: string;
    rating: number;
  };
  shipping: {
    estimatedDelivery: string;
    cost: number;
    freeShipping: boolean;
    methods: string[];
  };
  specifications: Array<{
    name: string;
    value: string;
  }>;
  customization?: {
    options: string[];
    notes: string;
  };
  availability: {
    inStock: boolean;
    stockQuantity: number;
    leadTime: string;
  };
}

interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
  description: string;
}

interface ShippingGroup {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  totalWeight: number;
  shippingCost: number;
  estimatedDelivery: string;
  freeShipping: boolean;
}

interface BulkCartManagerProps {
  cartItems: CartItem[];
  bulkDiscounts: BulkDiscount[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onClearCart?: () => void;
  onProceedToCheckout?: (items: CartItem[], options: any) => void;
  onSaveForLater?: (itemId: string) => void;
  onRequestQuote?: (items: CartItem[]) => void;
  onDuplicateOrder?: (items: CartItem[]) => void;
  className?: string;
}

export const BulkCartManager: React.FC<BulkCartManagerProps> = ({
  cartItems = [],
  bulkDiscounts = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onSaveForLater,
  onRequestQuote,
  onDuplicateOrder,
  className = ""
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(cartItems.map(item => item.id)));
  const [groupBy, setGroupBy] = useState<'seller' | 'category' | 'shipping'>('seller');
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [deliveryPreference, setDeliveryPreference] = useState<'fastest' | 'cheapest' | 'consolidated'>('consolidated');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter cart items based on search and category
  const filteredItems = cartItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(cartItems.map(item => item.category))];

  // Group items by selected criteria
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: CartItem[] } = {};
    
    filteredItems.forEach(item => {
      let groupKey: string;
      
      switch (groupBy) {
        case 'seller':
          groupKey = item.seller.id;
          break;
        case 'category':
          groupKey = item.category;
          break;
        case 'shipping':
          groupKey = item.shipping.estimatedDelivery;
          break;
        default:
          groupKey = 'all';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    
    return groups;
  }, [filteredItems, groupBy]);

  // Calculate totals for selected items
  const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate bulk discounts
  const applicableBulkDiscounts = bulkDiscounts.filter(discount => totalQuantity >= discount.minQuantity);
  const bestDiscount = applicableBulkDiscounts.reduce((best, current) => 
    current.discountPercentage > best.discountPercentage ? current : best, 
    { discountPercentage: 0, minQuantity: 0, description: '' }
  );
  
  const discountAmount = subtotal * (bestDiscount.discountPercentage / 100);
  const discountedSubtotal = subtotal - discountAmount;

  // Calculate shipping costs by seller
  const shippingGroups: ShippingGroup[] = useMemo(() => {
    const groups: { [sellerId: string]: ShippingGroup } = {};
    
    selectedCartItems.forEach(item => {
      if (!groups[item.seller.id]) {
        groups[item.seller.id] = {
          sellerId: item.seller.id,
          sellerName: item.seller.companyName,
          items: [],
          totalWeight: 0,
          shippingCost: 0,
          estimatedDelivery: item.shipping.estimatedDelivery,
          freeShipping: false
        };
      }
      
      groups[item.seller.id].items.push(item);
      groups[item.seller.id].shippingCost += item.shipping.cost * item.quantity;
      groups[item.seller.id].freeShipping = groups[item.seller.id].items.every(i => i.shipping.freeShipping);
    });
    
    return Object.values(groups);
  }, [selectedCartItems]);

  const totalShipping = shippingGroups.reduce((sum, group) => 
    sum + (group.freeShipping ? 0 : group.shippingCost), 0
  );
  
  const grandTotal = discountedSubtotal + totalShipping;

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      const validQuantity = Math.max(
        item.minOrderQuantity, 
        Math.min(item.maxOrderQuantity, newQuantity)
      );
      onUpdateQuantity?.(itemId, validQuantity);
    }
  };

  const handleRequestQuote = () => {
    onRequestQuote?.(selectedCartItems);
    setShowQuoteDialog(false);
    setQuoteNotes('');
  };

  const renderCartItem = (item: CartItem) => {
    const isSelected = selectedItems.has(item.id);
    const itemTotal = item.price * item.quantity;
    
    return (
      <Card key={item.id} className={`mb-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleSelectItem(item.id)}
            />
            
            <img
              src={item.image || '/placeholder.svg'}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {item.seller.companyName}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {item.shipping.estimatedDelivery}
                    </span>
                  </div>

                  {!item.availability.inStock && (
                    <div className="flex items-center gap-2 mt-2 text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Out of stock - Lead time: {item.availability.leadTime}</span>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem?.(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= item.minOrderQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-20 border-0 text-center focus:ring-0"
                      min={item.minOrderQuantity}
                      max={item.maxOrderQuantity}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxOrderQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Min: {item.minOrderQuantity}, Max: {item.maxOrderQuantity}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    ${itemTotal.toLocaleString()} {item.currency}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${item.price.toLocaleString()} × {item.quantity}
                  </div>
                </div>
              </div>

              {item.customization && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Customization</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {item.customization.options.map((option, index) => (
                      <div key={index}>• {option}</div>
                    ))}
                    {item.customization.notes && (
                      <div className="mt-2">
                        <strong>Notes:</strong> {item.customization.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGroupHeader = (groupKey: string, items: CartItem[]) => {
    const groupInfo = items[0];
    
    switch (groupBy) {
      case 'seller':
        return (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{groupInfo.seller.companyName}</h3>
              <p className="text-sm text-gray-600">{groupInfo.seller.location}</p>
            </div>
            <Badge variant="secondary">{items.length} items</Badge>
          </div>
        );
      case 'category':
        return (
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">{groupKey}</h3>
            <Badge variant="secondary">{items.length} items</Badge>
          </div>
        );
      case 'shipping':
        return (
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Delivery: {groupKey}</h3>
            <Badge variant="secondary">{items.length} items</Badge>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} items in your cart
          </p>
        </div>
        
        {cartItems.length > 0 && (
          <Button variant="outline" onClick={onClearCart}>
            Clear Cart
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-4">
            Add some products to get started with your bulk order.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Browse Products
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedItems.size === cartItems.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    Select All ({selectedItems.size}/{cartItems.length})
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search cart..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller">By Seller</SelectItem>
                      <SelectItem value="category">By Category</SelectItem>
                      <SelectItem value="shipping">By Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Grouped Items */}
            {Object.entries(groupedItems).map(([groupKey, items]) => (
              <div key={groupKey}>
                {renderGroupHeader(groupKey, items)}
                {items.map(renderCartItem)}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  
                  {bestDiscount.discountPercentage > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Bulk Discount ({bestDiscount.discountPercentage}%)</span>
                        <span>-${discountAmount.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                        {bestDiscount.description}
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${totalShipping.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Shipping Groups */}
                {shippingGroups.length > 1 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Shipping Groups</h4>
                    {shippingGroups.map((group, index) => (
                      <div key={group.sellerId} className="text-xs bg-gray-50 p-3 rounded">
                        <div className="font-medium">{group.sellerName}</div>
                        <div className="text-gray-600">
                          {group.items.length} items • ${group.shippingCost.toLocaleString()} shipping
                        </div>
                        <div className="text-gray-600">
                          Delivery: {group.estimatedDelivery}
                        </div>
                        {group.freeShipping && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Free Shipping
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Available Bulk Discounts */}
                {bulkDiscounts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Bulk Discounts</h4>
                    {bulkDiscounts.map((discount, index) => (
                      <div 
                        key={index} 
                        className={`text-xs p-2 rounded ${
                          totalQuantity >= discount.minQuantity 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="font-medium">
                          {discount.discountPercentage}% off {discount.minQuantity}+ items
                        </div>
                        <div>{discount.description}</div>
                        {totalQuantity >= discount.minQuantity && (
                          <div className="flex items-center gap-1 mt-1">
                            <Check className="h-3 w-3" />
                            <span>Applied</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => onProceedToCheckout?.(selectedCartItems, { deliveryPreference })}
                    disabled={selectedItems.size === 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout ({selectedItems.size} items)
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowQuoteDialog(true)}
                    disabled={selectedItems.size === 0}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Request Quote
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDuplicateOrder?.(selectedCartItems)}
                      disabled={selectedItems.size === 0}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {/* Export cart logic */}}
                      disabled={selectedItems.size === 0}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quote Request Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Bulk Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Additional Requirements</Label>
              <Textarea
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="Describe any specific requirements, customizations, or delivery preferences..."
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Delivery Preference</Label>
              <Select value={deliveryPreference} onValueChange={(value: any) => setDeliveryPreference(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fastest">Fastest Delivery</SelectItem>
                  <SelectItem value="cheapest">Cheapest Shipping</SelectItem>
                  <SelectItem value="consolidated">Consolidated Shipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowQuoteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestQuote}>
                <FileText className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkCartManager;
