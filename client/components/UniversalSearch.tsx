import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Package, Building2, ShoppingCart, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface SearchSuggestion {
  title: string;
  subtitle?: string;
  type: 'product' | 'category' | 'company' | 'order';
  rating?: number;
  price?: number;
  image?: string;
  id?: string;
}

interface SearchResult {
  query: string;
  type: string;
  totalResults: number;
  results: {
    products?: { data: any[]; total: number; hasMore: boolean };
    orders?: { data: any[]; total: number; hasMore: boolean };
    users?: { data: any[]; total: number; hasMore: boolean };
  };
}

interface UniversalSearchProps {
  onSearch?: (query: string, filters?: any) => void;
  onSelect?: (item: any) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({
  onSearch,
  onSelect,
  placeholder = "Search products, orders, companies...",
  showFilters = false,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'products' | 'orders' | 'companies'>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vasa_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
    fetchPopularSearches();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length > 0) {
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, selectedType]);

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&type=${selectedType}&limit=5`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch('/api/search/popular');
      const data = await response.json();
      
      if (data.success) {
        setPopularSearches(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch popular searches:', error);
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('vasa_recent_searches', JSON.stringify(newRecentSearches));

    // Perform search
    onSearch?.(searchQuery, { type: selectedType });
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
    onSelect?.(suggestion);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'category':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xs ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="pl-10 pr-10 h-12 text-base border-2 border-gray-200 focus:border-blue-500"
            />
            {query && (
              <button
                onClick={clearQuery}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {showFilters && (
            <Button
              variant="outline"
              size="icon"
              className="ml-2 h-12 w-12"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Type Selector */}
        <div className="flex gap-2 mt-2">
          {(['all', 'products', 'orders', 'companies'] as const).map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "secondary"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                Searching...
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <div className="flex-shrink-0 text-gray-400">
                      {getTypeIcon(suggestion.type)}
                    </div>
                    
                    {suggestion.image && (
                      <img
                        src={suggestion.image}
                        alt={suggestion.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {suggestion.title}
                      </div>
                      {suggestion.subtitle && (
                        <div className="text-sm text-gray-500 truncate">
                          {suggestion.subtitle}
                        </div>
                      )}
                      {suggestion.rating && renderStars(suggestion.rating)}
                    </div>
                    
                    {suggestion.price && (
                      <div className="flex-shrink-0 text-right">
                        <div className="font-medium text-gray-900">
                          ${suggestion.price.toLocaleString()}
                        </div>
                      </div>
                    )}
                    
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!isLoading && query.length === 0 && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSearch(search)}
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-gray-700">{search}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {!isLoading && query.length === 0 && popularSearches.popularCategories && (
              <div>
                <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Popular Categories
                </div>
                {popularSearches.popularCategories.slice(0, 5).map((category: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSearch(category.category)}
                  >
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-gray-700">{category.category}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.count} products
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length > 0 && suggestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium mb-2">No suggestions found</p>
                <p className="text-sm">
                  Try adjusting your search terms or{' '}
                  <button
                    onClick={() => handleSearch()}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    search anyway
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversalSearch;
