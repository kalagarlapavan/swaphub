import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './pages/ItemDetail';
import MyItems from './pages/MyItems';
import MyRequests from './pages/MyRequests';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400 mb-4"></div>
        <p className="text-sm text-slate-450 font-medium">Validating secure session...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 md:px-8 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/:id" element={<ItemDetail />} />

          {/* Protected Routes */}
          <Route
            path="/my-items"
            element={
              <ProtectedRoute>
                <MyItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unmatched routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} SwapHub. Peer-to-peer MERN items exchange platform.</p>
          <div className="flex gap-4">
            <span>Tailwind React Interface</span>
            <span>Secure JWT Encryption</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
