import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Box, ArrowLeft, RefreshCw, Send, AlertCircle, ShieldAlert } from 'lucide-react';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [item, setItem] = useState(null);
  const [myItems, setMyItems] = useState([]); // Owner items to offer
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Swap request Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchItemAndOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get item details
      const response = await axios.get(`/api/items/${id}`);
      setItem(response.data);

      // If user logged in and NOT the owner, load their items to offer
      if (token && response.data.owner?._id !== user?._id) {
        const userItemsRes = await axios.get(`/api/items?owner=${user._id}`);
        // Only allow offering "Available" items
        setMyItems(userItemsRes.data.filter((i) => i.status === 'Available'));
      }
    } catch (err) {
      console.error(err);
      setError('Item not found or server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemAndOffers();
  }, [id, token]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!message) return;
    setSubmitting(true);
    try {
      await axios.post('/api/requests', {
        requestedItemId: item._id,
        offeredItemId: selectedOfferId || null,
        message,
      });
      setSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        navigate('/my-requests');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit swap request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400"></div>
        <p className="text-slate-400 text-sm">Fetching item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <p className="text-rose-450 font-medium mb-4">{error || 'Item not found'}</p>
        <Link to="/" className="px-5 py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-850 text-white">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isOwner = user && item.owner?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 space-y-6">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Link>

      {/* Main Detail Card */}
      <div className="glass rounded-3xl overflow-hidden border border-slate-800 flex flex-col md:flex-row gap-8 p-6 md:p-8">
        {/* Gallery / Image view */}
        <div className="w-full md:w-1/2 aspect-square bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-850 flex items-center justify-center">
          {item.images && item.images[0] ? (
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-650">
              <Box className="h-16 w-16" />
              <span className="text-xs uppercase font-bold tracking-wider">No Image</span>
            </div>
          )}
          {item.status !== 'Available' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-350 text-sm font-bold uppercase tracking-widest">
                {item.status}
              </span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-primary-950/45 border border-primary-500/20 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                {item.category}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-350 uppercase">
                {item.condition} Condition
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{item.title}</h3>
            
            <p className="text-slate-350 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
          </div>

          <div className="border-t border-slate-850 pt-6 space-y-6 text-left">
            {/* Owner Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={item.owner?.avatar} alt={item.owner?.name} className="h-10 w-10 rounded-full bg-slate-900 border border-slate-700" />
                <div>
                  <p className="text-xs text-slate-450 leading-none">Listed by</p>
                  <p className="text-sm font-bold text-white mt-1">{item.owner?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-350">
                <MapPin className="h-4.5 w-4.5 text-primary-500" />
                <span>{item.owner?.location}</span>
              </div>
            </div>

            {/* CTA Actions */}
            {isOwner ? (
              <div className="p-4 rounded-xl border border-primary-500/10 bg-primary-950/10 text-primary-400 text-xs flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>This is your item listing. View or manage it in the <strong>My Items</strong> dashboard.</span>
              </div>
            ) : item.status !== 'Available' ? (
              <button disabled className="w-full py-3.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-sm font-semibold cursor-not-allowed">
                Item Unavailable for Exchange
              </button>
            ) : token ? (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <RefreshCw className="h-4.5 w-4.5" />
                Propose Swap Exchange
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center"
                >
                  Log In to Swap
                </Link>
                <p className="text-[11px] text-center text-slate-500">Authentication is required to swap items securely.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap request modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-md w-full p-6 rounded-3xl border border-slate-800 relative shadow-2xl">
            <h4 className="text-xl font-bold text-white mb-2">Propose Swap</h4>
            <p className="text-slate-400 text-xs mb-5">Offer one of your items and write a friendly message to {item.owner?.name}.</p>

            {success ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-950/30 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mx-auto">
                  <Send className="h-5 w-5 animate-pulse" />
                </div>
                <h5 className="text-lg font-bold text-white">Swap Request Sent!</h5>
                <p className="text-xs text-slate-400">Redirecting to requests dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4 text-left">
                {/* Offer Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-2 pl-0.5">
                    Offer An Item (Optional)
                  </label>
                  {myItems.length === 0 ? (
                    <div className="p-3.5 rounded-xl border border-slate-850 bg-slate-900/30 text-xs text-slate-500 leading-relaxed">
                      You have no available items listed. You can still send a one-sided message request, or add an item to trade first.
                    </div>
                  ) : (
                    <select
                      value={selectedOfferId}
                      onChange={(e) => setSelectedOfferId(e.target.value)}
                      className="block w-full px-3.5 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                    >
                      <option value="">No item (One-sided request)</option>
                      {myItems.map((off) => (
                        <option key={off._id} value={off._id}>
                          {off.title} ({off.condition})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-2 pl-0.5">
                    Proposal Message
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello! I would love to trade items. Let me know if you are interested..."
                    className="block w-full px-3.5 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all resize-none"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !message}
                    className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-xs font-bold text-white shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;
