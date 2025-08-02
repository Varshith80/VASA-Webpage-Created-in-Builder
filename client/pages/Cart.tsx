import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, ShoppingCart, Truck, CheckCircle, Clock, X, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Types for cart data
interface CartItem {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  status: 'in_cart' | 'importing' | 'exporting' | 'delivered' | 'cancelled';
  exporterName?: string;
  importerName?: string;
  orderDate?: Date;
  trackingNumber?: string;
  milestones?: Array<{
    title: string;
    completed: boolean;
    date?: Date;
  }>;
}

interface User {
  id: string;
  name: string;
  role: 'importer' | 'exporter';
  avatar?: string;
}

// Mock data - replace with API calls
const mockUser: User = {
  id: '1',
  name: 'John Smith',
  role: 'importer', // Switch between 'importer' and 'exporter' to test
  avatar: '/placeholder-user.jpg'
};

const mockCartItems: CartItem[] = [
  {
    id: '1',
    productName: 'Premium Organic Coffee Beans',
    productImage: '/placeholder.svg',
    price: 45.99,
    quantity: 2,
    status: 'in_cart',
    exporterName: 'Colombia Coffee Co.',
  },
  {
    id: '2',
    productName: 'Handcrafted Textiles',
    productImage: '/placeholder.svg',
    price: 89.50,
    quantity: 1,
    status: 'importing',
    exporterName: 'Artisan Textiles Ltd.',
    orderDate: new Date('2024-01-15'),
    trackingNumber: 'TRACK123456',
    milestones: [
      { title: 'Order Placed', completed: true, date: new Date('2024-01-15') },
      { title: 'Processing', completed: true, date: new Date('2024-01-16') },
      { title: 'Shipped', completed: false },
      { title: 'Delivered', completed: false },
    ]
  },
];

const mockExportOrders: CartItem[] = [
  {
    id: '3',
    productName: 'Vintage Wine Collection',
    productImage: '/placeholder.svg',
    price: 299.99,
    quantity: 1,
    status: 'exporting',
    importerName: 'Wine Enthusiasts Inc.',
    orderDate: new Date('2024-01-20'),
    trackingNumber: 'EXP789012',
    milestones: [
      { title: 'Order Received', completed: true, date: new Date('2024-01-20') },
      { title: 'Preparing Shipment', completed: true, date: new Date('2024-01-21') },
      { title: 'Ready to Ship', completed: false },
      { title: 'Shipped', completed: false },
    ]
  },
];

const StatusBadge: React.FC<{ status: CartItem['status'] }> = ({ status }) => {
  const getBadgeProps = (status: CartItem['status']) => {
    switch (status) {
      case 'in_cart':
        return { 
          variant: 'secondary' as const, 
          className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          icon: <ShoppingCart className="w-3 h-3 mr-1" />,
          text: 'In Cart'
        };
      case 'importing':
        return { 
          variant: 'default' as const, 
          className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
          icon: <Package className="w-3 h-3 mr-1" />,
          text: 'Importing'
        };
      case 'exporting':
        return { 
          variant: 'default' as const, 
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
          icon: <Truck className="w-3 h-3 mr-1" />,
          text: 'Exporting'
        };
      case 'delivered':
        return { 
          variant: 'default' as const, 
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          text: 'Delivered'
        };
      case 'cancelled':
        return { 
          variant: 'destructive' as const, 
          className: 'bg-red-50 text-red-700 border-red-200',
          icon: <X className="w-3 h-3 mr-1" />,
          text: 'Cancelled'
        };
      default:
        return { 
          variant: 'secondary' as const, 
          className: '',
          icon: <Clock className="w-3 h-3 mr-1" />,
          text: 'Unknown'
        };
    }
  };

  const { variant, className, icon, text } = getBadgeProps(status);

  return (
    <Badge variant={variant} className={`${className} transition-colors duration-200 cursor-default`}>
      {icon}
      {text}
    </Badge>
  );
};

const CartItemCard: React.FC<{ 
  item: CartItem; 
  userRole: User['role']; 
  onRemove?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}> = ({ item, userRole, onRemove, onAction }) => {
  const [showActions, setShowActions] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActionButtons = () => {
    if (userRole === 'importer') {
      if (item.status === 'in_cart') {
        return [
          { label: 'Remove', action: 'remove', variant: 'destructive' as const },
          { label: 'Move to Wishlist', action: 'wishlist', variant: 'secondary' as const }
        ];
      } else if (item.status === 'importing') {
        return [
          { label: 'Track Order', action: 'track', variant: 'default' as const },
          { label: 'Contact Exporter', action: 'contact', variant: 'secondary' as const }
        ];
      }
    } else if (userRole === 'exporter') {
      if (item.status === 'exporting') {
        return [
          { label: 'Update Status', action: 'update', variant: 'default' as const },
          { label: 'Contact Importer', action: 'contact', variant: 'secondary' as const }
        ];
      }
    }
    return [];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300 border hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={item.productImage} 
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.productName}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <StatusBadge status={item.status} />
                    {item.quantity > 1 && (
                      <span className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </div>
                    )}
                  </div>
                  
                  {getActionButtons().length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {getActionButtons().map((button) => (
                          <DropdownMenuItem
                            key={button.action}
                            onClick={() => onAction?.(item.id, button.action)}
                            className={button.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            {button.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {/* Order Details */}
              {(item.orderDate || item.trackingNumber) && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {item.orderDate && (
                      <div>
                        <span className="font-medium">Order Date:</span> {formatDate(item.orderDate)}
                      </div>
                    )}
                    {item.trackingNumber && (
                      <div>
                        <span className="font-medium">Tracking:</span> {item.trackingNumber}
                      </div>
                    )}
                    {userRole === 'importer' && item.exporterName && (
                      <div>
                        <span className="font-medium">Exporter:</span> {item.exporterName}
                      </div>
                    )}
                    {userRole === 'exporter' && item.importerName && (
                      <div>
                        <span className="font-medium">Importer:</span> {item.importerName}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {item.milestones && item.milestones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex space-x-4">
                    {item.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            milestone.completed 
                              ? 'bg-green-500' 
                              : 'bg-muted border-2 border-muted-foreground'
                          }`}
                        />
                        <span className={`text-xs ${
                          milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyCartState: React.FC<{ userRole: User['role'] }> = ({ userRole }) => {
  const getEmptyStateContent = () => {
    if (userRole === 'importer') {
      return {
        title: 'Your cart is empty',
        description: 'Browse products to start importing from global exporters.',
        actionText: 'Browse Products',
        actionLink: '/importer',
        icon: <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
      };
    } else {
      return {
        title: 'No active export orders',
        description: 'Add products to attract importers and start exporting.',
        actionText: 'Add Products',
        actionLink: '/exporter',
        icon: <Package className="w-16 h-16 text-muted-foreground mb-4" />
      };
    }
  };

  const content = getEmptyStateContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        {content.icon}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {content.title}
        </h3>
        <p className="text-muted-foreground mb-6">
          {content.description}
        </p>
        <Button asChild className="btn-corporate">
          <Link to={content.actionLink}>
            <Plus className="w-4 h-4 mr-2" />
            {content.actionText}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

const Cart: React.FC = () => {
  const [user] = useState<User>(mockUser);
  const [cartItems, setCartItems] = useState<CartItem[]>(
    user.role === 'importer' ? mockCartItems : mockExportOrders
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    setShowConfirmDialog(null);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  const handleAction = (itemId: string, action: string) => {
    switch (action) {
      case 'remove':
        setShowConfirmDialog(itemId);
        break;
      case 'track':
        toast({
          title: "Opening tracking",
          description: "Redirecting to tracking page...",
        });
        break;
      case 'contact':
        toast({
          title: "Opening messages",
          description: "Redirecting to messages...",
        });
        break;
      case 'update':
        toast({
          title: "Status updated",
          description: "Order status has been updated.",
        });
        break;
      default:
        toast({
          title: "Action triggered",
          description: `${action} action has been triggered.`,
        });
    }
  };

  const getTotalValue = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getPageTitle = () => {
    if (user.role === 'importer') {
      const inCartItems = cartItems.filter(item => item.status === 'in_cart').length;
      const orderItems = cartItems.filter(item => item.status !== 'in_cart').length;
      
      if (inCartItems > 0 && orderItems > 0) {
        return `Cart & Orders (${inCartItems + orderItems})`;
      } else if (inCartItems > 0) {
        return `Shopping Cart (${inCartItems})`;
      } else {
        return `My Orders (${orderItems})`;
      }
    } else {
      return `Export Orders (${cartItems.length})`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="corporate-header">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {getPageTitle()}
                </h1>
                <p className="text-muted-foreground">
                  {user.role === 'importer' 
                    ? 'Manage your cart and track your orders' 
                    : 'Manage your export orders and shipments'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-lg font-semibold text-foreground">
                  ${getTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <EmptyCartState userRole={user.role} />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  userRole={user.role}
                  onAction={handleAction}
                />
              ))}
            </AnimatePresence>

            {/* Action Buttons */}
            {cartItems.some(item => item.status === 'in_cart') && user.role === 'importer' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end space-x-4 pt-6 border-t border-border"
              >
                <Button variant="outline">
                  Continue Shopping
                </Button>
                <Button className="btn-corporate">
                  Proceed to Checkout
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!showConfirmDialog} onOpenChange={() => setShowConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item will be permanently removed from your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showConfirmDialog && handleRemoveItem(showConfirmDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cart;
