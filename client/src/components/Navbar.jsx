import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, LogOut, Menu, X, Package, MessageSquare, Compass, User } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-slate-800/80 sticky top-0 z-50 px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary-600 to-sky-400 p-2 rounded-xl shadow-md shadow-primary-500/10">
            <RefreshCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">SwapHub</h1>
            <span className="text-[10px] text-slate-400">Exchange Items</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isActive('/') ? 'text-primary-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4" />
            Browse
          </Link>

          {user ? (
            <>
              <Link
                to="/my-items"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive('/my-items') ? 'text-primary-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Package className="h-4 w-4" />
                My Items
              </Link>
              <Link
                to="/my-requests"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive('/my-requests') ? 'text-primary-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                My Requests
              </Link>

              <div className="h-4 w-[1px] bg-slate-800"></div>

              {/* User Avatar Details */}
              <div className="flex items-center gap-3 pl-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-slate-700 bg-slate-900"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-none mb-0.5">{user.name}</p>
                  <p className="text-[10px] text-slate-450 leading-none">{user.location}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-450 hover:text-rose-400 hover:bg-rose-950/20 transition-all ml-1"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-medium text-white shadow-lg shadow-primary-500/15 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl glass text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-850 flex flex-col gap-4 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 p-2 rounded-xl text-sm font-medium ${
              isActive('/') ? 'bg-primary-500/10 text-primary-400' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Compass className="h-4.5 w-4.5" />
            Browse Items
          </Link>

          {user ? (
            <>
              <Link
                to="/my-items"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl text-sm font-medium ${
                  isActive('/my-items') ? 'bg-primary-500/10 text-primary-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Package className="h-4.5 w-4.5" />
                My Items
              </Link>
              <Link
                to="/my-requests"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-xl text-sm font-medium ${
                  isActive('/my-requests') ? 'bg-primary-500/10 text-primary-400' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="h-4.5 w-4.5" />
                My Requests
              </Link>

              <div className="border-t border-slate-850 my-1"></div>

              <div className="flex items-center gap-3 p-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full border border-slate-700 bg-slate-900"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-450">{user.location}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 p-2 rounded-xl text-sm font-medium text-rose-450 hover:bg-rose-950/20 text-left w-full"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-center text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-medium text-center text-white shadow-lg shadow-primary-500/15"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
