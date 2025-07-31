import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Filter,
  SortAsc,
  Camera,
  Paperclip,
  Send,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Award,
  MessageCircle,
  Image as ImageIcon,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { AnimatedStarRating } from './AnimatedComponents';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userBadges: string[];
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  images: string[];
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  userHelpfulVote?: 'helpful' | 'not_helpful' | null;
  createdAt: string;
  updatedAt?: string;
  response?: {
    content: string;
    respondedBy: string;
    respondedAt: string;
  };
  orderInfo?: {
    orderId: string;
    quantity: number;
    variant: string;
  };
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchasePercentage: number;
  recommendationPercentage: number;
}

interface ReviewSystemProps {
  productId?: string;
  sellerId?: string;
  reviews: Review[];
  reviewSummary: ReviewSummary;
  canWriteReview?: boolean;
  userReview?: Review;
  onSubmitReview?: (review: any) => void;
  onUpdateReview?: (reviewId: string, review: any) => void;
  onDeleteReview?: (reviewId: string) => void;
  onVoteHelpful?: (reviewId: string, helpful: boolean) => void;
  onReportReview?: (reviewId: string, reason: string) => void;
  className?: string;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({
  productId,
  sellerId,
  reviews = [],
  reviewSummary,
  canWriteReview = false,
  userReview,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview,
  onVoteHelpful,
  onReportReview,
  className = ""
}) => {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating_high' | 'rating_low'>('newest');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportDialog, setReportDialog] = useState<string | null>(null);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
    images: [] as string[],
    wouldRecommend: true
  });

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      const matchesVerified = !showOnlyVerified || review.verifiedPurchase;
      const matchesSearch = searchQuery === '' || 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRating && matchesVerified && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const handleSubmitReview = () => {
    if (reviewForm.rating === 0 || !reviewForm.title || !reviewForm.content) {
      return;
    }

    const review = {
      ...reviewForm,
      pros: reviewForm.pros.filter(pro => pro.trim() !== ''),
      cons: reviewForm.cons.filter(con => con.trim() !== ''),
      productId,
      sellerId
    };

    if (editingReview) {
      onUpdateReview?.(editingReview, review);
      setEditingReview(null);
    } else {
      onSubmitReview?.(review);
    }

    setShowWriteReview(false);
    setReviewForm({
      rating: 0,
      title: '',
      content: '',
      pros: [''],
      cons: [''],
      images: [],
      wouldRecommend: true
    });
  };

  const handleEditReview = (review: Review) => {
    setReviewForm({
      rating: review.rating,
      title: review.title,
      content: review.content,
      pros: review.pros.length > 0 ? review.pros : [''],
      cons: review.cons.length > 0 ? review.cons : [''],
      images: review.images,
      wouldRecommend: true
    });
    setEditingReview(review.id);
    setShowWriteReview(true);
  };

  const addProsCons = (type: 'pros' | 'cons') => {
    setReviewForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateProsCons = (type: 'pros' | 'cons', index: number, value: string) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const removeProsCons = (type: 'pros' | 'cons', index: number) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const renderRatingDistribution = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(rating => {
        const count = reviewSummary.ratingDistribution[rating as keyof typeof reviewSummary.ratingDistribution];
        const percentage = reviewSummary.totalReviews > 0 ? (count / reviewSummary.totalReviews) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center gap-3">
            <button
              onClick={() => setFilterRating(rating)}
              className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
            >
              <span>{rating}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </button>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );

  const renderReview = (review: Review) => (
    <Card key={review.id} className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {review.userAvatar ? (
                <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full" />
              ) : (
                <User className="h-6 w-6 text-gray-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{review.userName}</span>
                {review.verifiedPurchase && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
                {review.userBadges.map(badge => (
                  <Badge key={badge} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <AnimatedStarRating rating={review.rating} size="sm" />
                <span className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {review.orderInfo && (
                <div className="text-xs text-gray-500">
                  Order #{review.orderInfo.orderId} • Quantity: {review.orderInfo.quantity}
                  {review.orderInfo.variant && ` • ${review.orderInfo.variant}`}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {userReview?.id === review.id && (
              <>
                <Button variant="ghost" size="sm" onClick={() => handleEditReview(review)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteReview?.(review.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => setReportDialog(review.id)}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">{review.title}</h4>
          <p className="text-gray-700 leading-relaxed">{review.content}</p>
          
          {(review.pros.length > 0 || review.cons.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review.pros.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Pros
                  </h5>
                  <ul className="space-y-1">
                    {review.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {review.cons.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Cons
                  </h5>
                  <ul className="space-y-1">
                    {review.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {review.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {review.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Review image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {review.response && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Seller Response</span>
              <span className="text-sm text-blue-700">
                {new Date(review.response.respondedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-blue-800">{review.response.content}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onVoteHelpful?.(review.id, true)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                review.userHelpfulVote === 'helpful' 
                  ? 'text-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              Helpful ({review.helpful})
            </button>
            
            <button
              onClick={() => onVoteHelpful?.(review.id, false)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                review.userHelpfulVote === 'not_helpful' 
                  ? 'text-red-600' 
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <ThumbsDown className="h-4 w-4" />
              Not Helpful ({review.notHelpful})
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {review.updatedAt && (
              <span>Edited {new Date(review.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {reviewSummary.averageRating.toFixed(1)}
              </div>
              <AnimatedStarRating rating={reviewSummary.averageRating} size="lg" />
              <div className="text-sm text-gray-600 mt-2">
                Based on {reviewSummary.totalReviews} reviews
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="lg:col-span-2">
              {renderRatingDistribution()}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {reviewSummary.verifiedPurchasePercentage}%
              </div>
              <div className="text-sm text-gray-600">Verified Purchases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {reviewSummary.recommendationPercentage}%
              </div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
          </div>

          {/* Write Review Button */}
          {canWriteReview && !userReview && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button onClick={() => setShowWriteReview(true)} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            
            <Select value={filterRating.toString()} onValueChange={(value) => setFilterRating(value === 'all' ? 'all' : parseInt(value))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating_high">Highest Rating</SelectItem>
                <SelectItem value="rating_low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified-only"
              checked={showOnlyVerified}
              onChange={(e) => setShowOnlyVerified(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="verified-only" className="text-sm">
              Verified purchases only
            </label>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div>
        {filteredReviews.length > 0 ? (
          filteredReviews.map(renderReview)
        ) : (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              {reviews.length === 0 
                ? "Be the first to write a review!" 
                : "Try adjusting your filters to see more reviews."
              }
            </p>
          </Card>
        )}
      </div>

      {/* Write Review Dialog */}
      <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? 'Edit Review' : 'Write a Review'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-base font-medium">Overall Rating *</Label>
              <div className="mt-2">
                <AnimatedStarRating
                  rating={reviewForm.rating}
                  size="lg"
                  interactive
                  onRatingChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="review-title" className="text-base font-medium">
                Review Title *
              </Label>
              <Input
                id="review-title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience..."
                className="mt-2"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="review-content" className="text-base font-medium">
                Detailed Review *
              </Label>
              <Textarea
                id="review-content"
                value={reviewForm.content}
                onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros */}
              <div>
                <Label className="text-base font-medium text-green-700">Pros</Label>
                <div className="space-y-2 mt-2">
                  {reviewForm.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={pro}
                        onChange={(e) => updateProsCons('pros', index, e.target.value)}
                        placeholder="What did you like?"
                        className="flex-1"
                      />
                      {reviewForm.pros.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProsCons('pros', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addProsCons('pros')}
                    className="w-full"
                  >
                    Add Pro
                  </Button>
                </div>
              </div>

              {/* Cons */}
              <div>
                <Label className="text-base font-medium text-red-700">Cons</Label>
                <div className="space-y-2 mt-2">
                  {reviewForm.cons.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={con}
                        onChange={(e) => updateProsCons('cons', index, e.target.value)}
                        placeholder="What could be improved?"
                        className="flex-1"
                      />
                      {reviewForm.cons.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProsCons('cons', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addProsCons('cons')}
                    className="w-full"
                  >
                    Add Con
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-base font-medium">Photos (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload photos to help others see your experience
                </p>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Photos
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                disabled={reviewForm.rating === 0 || !reviewForm.title || !reviewForm.content}
              >
                <Send className="h-4 w-4 mr-2" />
                {editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Review Dialog */}
      <Dialog open={!!reportDialog} onOpenChange={() => setReportDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Why are you reporting this review?
            </p>
            <div className="space-y-2">
              {[
                'Spam or fake review',
                'Inappropriate content',
                'Harassment or hate speech',
                'Not relevant to product',
                'Other'
              ].map(reason => (
                <Button
                  key={reason}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onReportReview?.(reportDialog!, reason);
                    setReportDialog(null);
                  }}
                >
                  {reason}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewSystem;
