import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Box, Image, X, Sparkles } from 'lucide-react';
import { mockItems } from '../seedData';

const CATEGORIES = [
  'Electronics',
  'Books',
  'Fashion',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Toys & Games',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

function MyItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    condition: 'Good',
    imageUrl: '',
  });

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/items?owner=${user._id}`);
      setItems(res.data);
    } catch (err) {
      console.warn('Fetch my items failed. Using mock client-side fallback:', err);
      // Load mock items where owner is user._id
      const filteredMock = mockItems.filter(
        (i) => (i.owner?._id || i.owner) === user?._id
      );
      setItems(filteredMock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]);

  const handleOpenCreateForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Electronics',
      condition: 'Good',
      imageUrl: '',
    });
    setFormOpen(true);
  };

  const handleOpenEditForm = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      imageUrl: item.images?.[0] || '',
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      if (isEditing) {
        await axios.put(`/api/items/${editingId}`, payload);
      } else {
        await axios.post('/api/items', payload);
      }

      setFormOpen(false);
      fetchMyItems();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving listing');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`/api/items/${itemId}`);
      fetchMyItems();
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 text-left space-y-8">
      {/* Dashboard Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-805 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">My Listings</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and track items you have listed for exchange.</p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" />
          Add New Item
        </button>
      </div>

      {/* Grid displaying listed items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400"></div>
          <p className="text-slate-400 text-sm">Loading your listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-slate-800/80 p-12">
          <Box className="h-16 w-16 text-slate-650 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Listings Yet</h3>
          <p className="text-slate-450 max-w-sm mx-auto text-sm mb-6">
            You haven't listed any items for exchange. Create your first listing and start exchanging!
          </p>
          <button
            onClick={handleOpenCreateForm}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs font-semibold text-white transition-all"
          >
            List My First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="glass rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="aspect-square bg-slate-900 w-full relative overflow-hidden flex items-center justify-center">
                {item.images && item.images[0] ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-700">
                    <Box className="h-12 w-12" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                  </div>
                )}
                {/* Status Badge */}
                <span
                  className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    item.status === 'Available'
                      ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20'
                      : item.status === 'Pending'
                      ? 'text-amber-400 bg-amber-950/30 border-amber-500/20'
                      : 'text-slate-400 bg-slate-900 border-slate-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Card content */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-lg font-bold text-white line-clamp-1 mt-1 mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-850 pt-4 mt-4">
                  <button
                    onClick={() => handleOpenEditForm(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="flex items-center justify-center p-2 border border-slate-800 rounded-xl text-rose-400 hover:text-rose-350 hover:bg-rose-950/20 transition-all"
                    title="Delete listing"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Drawer / Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass max-w-lg w-full p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg glass text-slate-400 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <h4 className="text-2xl font-extrabold text-white mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-400" />
              {isEditing ? 'Edit Listing' : 'List New Item'}
            </h4>
            <p className="text-slate-400 text-xs mb-6">Enter specifications for items you wish to offer.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-1.5 pl-0.5">Item Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Leather Jacket, iPad Pro 2022"
                    className="block w-full px-3.5 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-1.5 pl-0.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full px-3.5 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-1.5 pl-0.5">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="block w-full px-3.5 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-1.5 pl-0.5">Image URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Image className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="block w-full pl-10 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-350 uppercase mb-1.5 pl-0.5">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about the item's age, specs, and what you are looking for..."
                    className="block w-full px-3.5 py-3 border border-slate-800 rounded-xl bg-slate-900 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="flex-1 py-3 px-4 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-xs font-bold text-white shadow-lg transition-all"
                >
                  {isEditing ? 'Save Changes' : 'List Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyItems;
