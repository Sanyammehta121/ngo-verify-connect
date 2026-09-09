import React, { useState } from 'react';
import { Star, MessageSquare, ShieldAlert, User, CheckCircle, Send, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ReviewSection({ ngo, onOpenReportFraud, onReviewAdded }) {
  const { user, demoLogin } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reviews = ngo.reviews || [];
  const averageRating = ngo.averageRating || (ngo.trustScore ? ngo.trustScore.toFixed(1) : '5.0');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a written comment regarding your donor or volunteer experience.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.submitReview(ngo.id, rating, comment.trim());
      setSuccess('Your feedback has been verified and added to the public record!');
      setComment('');
      setRating(5);
      if (onReviewAdded) {
        onReviewAdded(response.review, response.updatedTrustScore, response.updatedTrustPercentage);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Community Ratings & Feedback</h3>
            <p className="text-xs text-slate-500">First-hand donor, volunteer, and beneficiary testimonials</p>
          </div>
        </div>

        {/* Whistleblower / Fraud Report Trigger */}
        <button
          onClick={onOpenReportFraud}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Report Fraud / Suspicious Claim</span>
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Rating Summary & Submission Form */}
        <div className="space-y-6">
          {/* Rating Summary Box */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <div className="text-4xl font-extrabold text-slate-900">
              {averageRating}
            </div>
            <div className="flex items-center justify-center space-x-1 my-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Based on {reviews.length} public {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Review Submission Form */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share Donor or Volunteer Experience</span>
            </h4>

            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                {error && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Interactive Star Picker */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-300 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            num <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {hoverRating || rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Your Review</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Mention program transparency, 80G receipt delivery, or volunteer experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Post Public Review'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs">
                <User className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-800">Sign in to leave a review</p>
                <p className="text-slate-500 text-[11px] mt-0.5 mb-3">
                  Reviews require authenticated accounts to prevent spam.
                </p>
                <button
                  onClick={() => demoLogin('citizen')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition"
                >
                  ⚡ Sign In as Demo Citizen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Review List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Recent Verified Testimonials ({reviews.length})
            </h4>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No community reviews yet</p>
              <p className="text-[11px] mt-0.5">Be the first verified donor to share your feedback!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                        {(rev.userName || 'D').charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{rev.userName}</span>
                          <span className="text-[10px] font-normal px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded-sm">
                            Verified Contributor
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mt-2">
                    "{rev.comment}"
                  </p>

                  <div className="mt-2 text-[10px] text-slate-400">
                    Posted on {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Date'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
