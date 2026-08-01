import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Tag, Box, ArrowRight, Star } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Books',
  'Fashion',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Toys & Games',
  'Other',
];

function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/items';
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const response = await axios.get(url, { params });
      setItems(response.data);
    } catch (err) {
      console.error('Fetch items failed:', err);
      setError('Could not load items. Ensure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const getConditionColor = (cond) => {
    switch (cond) {
      case 'New': return 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20';
      case 'Like New': return 'text-sky-400 bg-sky-950/30 border-sky-500/20';
      case 'Good': return 'text-teal-400 bg-teal-950/30 border-teal-500/20';
      case 'Fair': return 'text-amber-400 bg-amber-950/30 border-amber-500/20';
      default: return 'text-rose-405 bg-rose-950/30 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-8">
      {/* Banner */}
      <section className="relative glass rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="max-w-2xl text-left space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Exchange What You <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-sky-350">Have</span> For What You <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">Need</span>
          </h2>
          <p className="text-slate-350 text-base md:text-lg">
            SwapHub connects you with local swappers. List your items, search other lists, offer trades, and exchange hassle-free.
          </p>
        </div>
      </section>

      {/* Filter and Search controls */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-800 rounded-xl bg-slate-900/60 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
          />
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar self-start md:self-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                category === cat
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'glass text-slate-350 hover:text-white border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Items Gallery */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400"></div>
          <p className="text-slate-400 text-sm">Searching SwapHub listings...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 glass rounded-2xl border border-slate-800/80 p-8 max-w-md mx-auto">
          <p className="text-rose-400 text-sm mb-4">{error}</p>
          <button onClick={fetchItems} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium hover:bg-slate-850 text-white">
            Retry Connection
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-slate-800/80 p-12">
          <Box className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Items Available</h3>
          <p className="text-slate-450 max-w-md mx-auto text-sm">
            We couldn't find any items matching your filters. Try adjusting your search query or categories!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="glass glass-hover rounded-2xl overflow-hidden border border-slate-800/80 flex flex-col justify-between transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-square bg-slate-900 w-full relative overflow-hidden flex items-center justify-center">
                {item.images && item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-650">
                    <Box className="h-12 w-12" />
                    <span className="text-[10px] uppercase font-semibold tracking-wider">No Image Provided</span>
                  </div>
                )}
                {/* Condition Tag */}
                <span className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border capitalize ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>

                {/* Status Overlay if Pending */}
                {item.status === 'Pending' && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      Swap Pending
                    </span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-primary-400 font-bold tracking-wide uppercase mb-1.5">
                    <span>{item.category}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary-400" /> Star</span>
                  </div>
                  <h4 className="text-lg font-bold text-white line-clamp-1 mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                </div>

                <div className="border-t border-slate-850 pt-4 mt-2">
                  {/* Owner metadata */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.owner?.avatar}
                        alt={item.owner?.name}
                        className="h-6 w-6 rounded-full bg-slate-800"
                      />
                      <span className="text-xs text-slate-350 font-medium">{item.owner?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-450">
                      <MapPin className="h-3.5 w-3.5 text-primary-500/80" />
                      <span>{item.owner?.location}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/items/${item._id}`}
                    className="w-full py-2.5 px-4 rounded-xl glass border border-slate-800 hover:border-primary-500/30 hover:bg-primary-500/5 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all group"
                  >
                    View Swap Details
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
