import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bookmark, 
  X, 
  Star, 
  ShoppingCart, 
  Share2, 
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Calendar,
  DollarSign,
  Package,
  Trash2,
  Eye,
  Plus,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';

interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  addedAt: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  availability: {
    inStock: boolean;
    quantity: number;
  };
  priceHistory: Array<{
    price: number;
    date: string;
  }>;
}

interface SavedForLaterItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  savedAt: string;
  expiresAt?: string;
}

interface WishlistManagerProps {
  wishlistItems: WishlistItem[];
  savedItems: SavedForLaterItem[];
  onAddToCart?: (productId: string, quantity: number) => void;
  onRemoveFromWishlist?: (itemId: string) => void;
  onRemoveFromSaved?: (itemId: string) => void;
  onMoveToWishlist?: (itemId: string) => void;
  onUpdatePriority?: (itemId: string, priority: 'high' | 'medium' | 'low') => void;
  onAddNotes?: (itemId: string, notes: string) => void;
  onShare?: (productId: string) => void;
  onBulkAddToCart?: (productIds: string[]) => void;
  className?: string;
}

export const WishlistManager: React.FC<WishlistManagerProps> = ({
  wishlistItems = [],
  savedItems = [],
  onAddToCart,
  onRemoveFromWishlist,
  onRemoveFromSaved,
  onMoveToWishlist,
  onUpdatePriority,
  onAddNotes,
  onShare,
  onBulkAddToCart,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'saved'>('wishlist');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'priority' | 'name'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showNotesDialog, setShowNotesDialog] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Get unique categories from wishlist items
  const categories = ['all', ...new Set(wishlistItems.map(item => item.category))];

  // Filter and sort wishlist items
  const filteredWishlistItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'price':
          return a.price - b.price;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Filter saved items
  const filteredSavedItems = savedItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    if (selectedItems.size === filteredWishlistItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredWishlistItems.map(item => item.id)));
    }
  };

  const handleBulkAddToCart = () => {
    const productIds = Array.from(selectedItems);
    onBulkAddToCart?.(productIds);
    setSelectedItems(new Set());
  };

  const handleAddNotes = (itemId: string) => {
    const item = wishlistItems.find(i => i.id === itemId);
    if (item) {
      setTempNotes(item.notes || '');
      setShowNotesDialog(itemId);
    }
  };

  const handleSaveNotes = () => {
    if (showNotesDialog) {
      onAddNotes?.(showNotesDialog, tempNotes);
      setShowNotesDialog(null);
      setTempNotes('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderWishlistItem = (item: WishlistItem, index: number) => {
    const isSelected = selectedItems.has(item.id);
    
    if (viewMode === 'list') {
      return (
        <Card key={item.id} className={`mb-3 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleSelectItem(item.id)}
              />
              
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-blue-600">
                        ${item.price.toLocaleString()} {item.currency}
                      </span>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToCart?.(item.productId, 1)}
                      disabled={!item.availability.inStock}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddNotes(item.id)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onShare?.(item.productId)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveFromWishlist?.(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={item.id} className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-4">
          <div className="absolute top-3 left-3 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleSelectItem(item.id)}
              className="bg-white border-2"
            />
          </div>
          
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onShare?.(item.productId)}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRemoveFromWishlist?.(item.id)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="aspect-square mb-3 overflow-hidden rounded-lg">
            <img
              src={item.image || '/placeholder.svg'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                {item.title}
              </h3>
              <Badge className={`ml-2 text-xs ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">
                ${item.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                {item.currency}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span>{item.seller.rating}</span>
              <span>•</span>
              <span>{item.seller.location}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
              <span className={item.availability.inStock ? 'text-green-600' : 'text-red-600'}>
                {item.availability.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {item.notes && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Notes:</strong> {item.notes}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToCart?.(item.productId, 1)}
                disabled={!item.availability.inStock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddNotes(item.id)}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSavedItem = (item: SavedForLaterItem) => (
    <Card key={item.id} className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-lg font-bold text-blue-600">
                ${item.price.toLocaleString()} {item.currency}
              </span>
              <span className="text-sm text-gray-500">
                Saved {new Date(item.savedAt).toLocaleDateString()}
              </span>
              {item.expiresAt && (
                <span className="text-sm text-red-600">
                  Expires {new Date(item.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveToWishlist?.(item.id)}
            >
              <Heart className="h-4 w-4 mr-1" />
              Move to Wishlist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToCart?.(item.productId, 1)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveFromSaved?.(item.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Lists</h1>
          <p className="text-gray-600">
            Manage your wishlist and saved items
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Wishlist ({wishlistItems.length})
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved for Later ({savedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wishlist" className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedItems.size === filteredWishlistItems.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add Selected to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItems(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Wishlist Items */}
          {filteredWishlistItems.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
              : 'space-y-3'
            }>
              {filteredWishlistItems.map(renderWishlistItem)}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-4">
                Start adding products you're interested in to your wishlist.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {/* Saved Items */}
          {filteredSavedItems.length > 0 ? (
            <div className="space-y-3">
              {filteredSavedItems.map(renderSavedItem)}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No saved items
              </h3>
              <p className="text-gray-600 mb-4">
                Items you save for later will appear here.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Notes Dialog */}
      <Dialog open={!!showNotesDialog} onOpenChange={() => setShowNotesDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Personal Notes
              </label>
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Add your thoughts, requirements, or reminders about this product..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNotesDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes}>
                <Check className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WishlistManager;
