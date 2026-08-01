import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertTriangle } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-primary-500/5 blur-2xl rounded-3xl -z-10"></div>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to start trading items on SwapHub
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 text-rose-450 flex items-start gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-primary-500 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-4.5 w-4.5 text-primary-200 group-hover:text-primary-100 transition-colors" />
              </span>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-350 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
