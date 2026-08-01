import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ArrowRight, Check, X, AlertCircle, RefreshCw, Send, Calendar } from 'lucide-react';
import { mockRequests } from '../seedData';

function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/requests');
      setRequests(res.data);
    } catch (err) {
      console.warn('Fetch requests failed. Using mock client-side fallback:', err);
      // Filter mock requests where current user is requester or receiver
      const filtered = mockRequests.filter(
        (r) => r.requester?._id === user?._id || r.receiver?._id === user?._id
      );
      setRequests(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAccept = async (reqId) => {
    if (!window.confirm('Accepting this swap will transfer item ownership. Proceed?')) return;
    try {
      await axios.put(`/api/requests/${reqId}/accept`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error accepting swap request');
    }
  };

  const handleReject = async (reqId) => {
    if (!window.confirm('Are you sure you want to decline this proposal?')) return;
    try {
      await axios.put(`/api/requests/${reqId}/reject`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Error declining request');
    }
  };

  const handleCancel = async (reqId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await axios.put(`/api/requests/${reqId}/cancel`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Error cancelling request');
    }
  };

  // Filter requests based on tab
  // Incoming: receiver is logged in user
  // Outgoing: requester is logged in user
  const incomingRequests = requests.filter((r) => r.receiver?._id === user?._id);
  const outgoingRequests = requests.filter((r) => r.requester?._id === user?._id);

  const displayedRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20';
      case 'Rejected':
        return 'text-rose-450 bg-rose-950/20 border-rose-500/20';
      case 'Cancelled':
        return 'text-slate-450 bg-slate-900 border-slate-800';
      default:
        return 'text-amber-400 bg-amber-950/20 border-amber-500/20';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 text-left space-y-8 px-2">
      {/* Banner */}
      <div className="border-b border-slate-805 pb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Swap Requests</h2>
        <p className="text-sm text-slate-400 mt-1">Accept incoming proposals or track requests you sent.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-850 gap-6">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'incoming'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Incoming Offers
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-350">
            {incomingRequests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'outgoing'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Sent Proposals
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-350">
            {outgoingRequests.length}
          </span>
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400"></div>
          <p className="text-slate-400 text-sm">Loading requests...</p>
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-slate-800/80 p-12">
          <MessageSquare className="h-16 w-16 text-slate-650 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Requests Found</h3>
          <p className="text-slate-450 max-w-sm mx-auto text-sm">
            {activeTab === 'incoming'
              ? "You haven't received any swap offers from other users yet."
              : "You haven't sent any swap proposals yet. Find items in the browser to start trades!"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedRequests.map((req) => (
            <div
              key={req._id}
              className="glass rounded-2xl border border-slate-800/80 p-5 md:p-6 space-y-4"
            >
              {/* Request Metadata header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-400">Submitted on {formatDate(req.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getStatusStyle(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Items Swap Visualizer */}
              <div className="flex flex-col md:flex-row items-center gap-6 py-2">
                {/* Offered Item */}
                <div className="w-full md:w-[45%] flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-850">
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-850 overflow-hidden flex items-center justify-center border border-slate-800">
                    {req.offeredItem?.images?.[0] ? (
                      <img src={req.offeredItem.images[0]} alt={req.offeredItem.title} className="w-full h-full object-cover" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-slate-650" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">Offered Item</p>
                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                      {req.offeredItem ? req.offeredItem.title : 'One-sided Message'}
                    </p>
                    <p className="text-xs text-slate-450 truncate">
                      {req.offeredItem ? `Condition: ${req.offeredItem.condition}` : 'No item traded'}
                    </p>
                  </div>
                </div>

                {/* Swap Sync Indicator */}
                <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <ArrowRight className="h-4.5 w-4.5 text-primary-400" />
                </div>

                {/* Requested Item */}
                <div className="w-full md:w-[45%] flex items-center gap-4 bg-slate-900/30 p-3.5 rounded-xl border border-slate-850">
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-850 overflow-hidden flex items-center justify-center border border-slate-800">
                    {req.requestedItem?.images?.[0] ? (
                      <img src={req.requestedItem.images[0]} alt={req.requestedItem.title} className="w-full h-full object-cover" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-slate-650" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Requested Item</p>
                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">{req.requestedItem?.title}</p>
                    <p className="text-xs text-slate-450 truncate">Condition: {req.requestedItem?.condition}</p>
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850/65 text-xs text-slate-350 leading-relaxed italic text-left">
                "{req.message}"
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-850 pt-4 mt-2">
                {/* Peer user info */}
                <div className="flex items-center gap-2">
                  <img
                    src={activeTab === 'incoming' ? req.requester?.avatar : req.receiver?.avatar}
                    alt={activeTab === 'incoming' ? req.requester?.name : req.receiver?.name}
                    className="h-6 w-6 rounded-full border border-slate-800"
                  />
                  <span className="text-xs text-slate-400">
                    {activeTab === 'incoming' ? 'From' : 'To'}{' '}
                    <strong className="text-slate-200">
                      {activeTab === 'incoming' ? req.requester?.name : req.receiver?.name}
                    </strong>{' '}
                    ({activeTab === 'incoming' ? req.requester?.location : req.receiver?.location})
                  </span>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-2">
                  {activeTab === 'incoming' && req.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="p-2 border border-slate-800 hover:bg-rose-950/20 text-rose-400 hover:text-rose-350 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-650/15 transition-all"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Accept Swap
                      </button>
                    </>
                  )}
                  {activeTab === 'outgoing' && req.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      className="py-2 px-3 border border-slate-805 hover:bg-slate-900 text-slate-350 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;
