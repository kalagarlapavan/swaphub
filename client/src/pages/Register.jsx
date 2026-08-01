import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, MapPin, AlertTriangle } from 'lucide-react';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.location);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-primary-500/5 blur-2xl rounded-3xl -z-10"></div>
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Join SwapHub today and start swapping items
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 text-rose-450 flex items-start gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10.5 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/60 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10.5 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/60 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="block w-full pl-10.5 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/60 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10.5 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/60 text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-primary-500 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-4.5 w-4.5 text-primary-200 group-hover:text-primary-100 transition-colors" />
              </span>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-350 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
