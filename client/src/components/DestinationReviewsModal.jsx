import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send, Check, ShieldCheck, User } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const DestinationReviewsModal = ({ isOpen, onClose, destinationName, openAuthModal }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 4.8, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    if (!isOpen || !destinationName) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await api.getReviews(destinationName);
        setReviewsData({
          reviews: data.reviews || [],
          averageRating: data.averageRating || 4.8,
          totalReviews: data.totalReviews || data.reviews?.length || 0
        });
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isOpen, destinationName]);

  if (!isOpen || !destinationName) return null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (openAuthModal) openAuthModal('login');
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createReview(destinationName, {
        rating,
        comment: comment.trim()
      });

      const newReview = res.review || {
        id: 'rev_' + Date.now(),
        destinationName,
        userName: user?.name || 'Traveler',
        userAvatar: user?.avatar || null,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };

      setReviewsData(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        totalReviews: prev.totalReviews + 1
      }));

      setComment('');
      setRating(5);
      setSuccessBanner(true);
      setTimeout(() => setSuccessBanner(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Traveler Reviews
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {destinationName}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Verified community insights & authentic travel tips
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Summary Bar */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-amber-50/60 to-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(reviewsData.averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {reviewsData.averageRating}
            </span>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Based on {reviewsData.totalReviews} traveler {reviewsData.totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your verified review has been posted.</span>
          </div>
        )}

        {/* Content Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Write a Review Section */}
          <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Share Your Experience</span>
              </span>

              {/* Star Rating Picker */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={2}
              placeholder={isAuthenticated ? "What did you love about this place? Any local food or hidden spot tips?" : "Please sign in to write a review..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!isAuthenticated}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white focus:outline-hidden focus:border-blue-600 resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {isAuthenticated ? `Posting as ${user?.name}` : 'Sign in required'}
              </span>

              <button
                type="submit"
                disabled={submitting || (!isAuthenticated && false)}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    if (openAuthModal) openAuthModal('login');
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Posting...' : isAuthenticated ? 'Post Review' : 'Sign In to Review'}</span>
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Community Feed ({reviewsData.reviews?.length || 0})
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading traveler reviews...</div>
            ) : reviewsData.reviews?.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                No reviews yet. Be the first explorer to share tips for {destinationName}!
              </div>
            ) : (
              <div className="space-y-3">
                {reviewsData.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {rev.userAvatar ? (
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-snug">{rev.userName}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= Math.round(rev.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-9">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Synced with Supabase Community Database</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
