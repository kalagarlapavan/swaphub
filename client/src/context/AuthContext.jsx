import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

let apiBaseUrl = import.meta.env.VITE_API_URL || '';
if (apiBaseUrl.endsWith('/api')) {
  apiBaseUrl = apiBaseUrl.slice(0, -4);
}
axios.defaults.baseURL = apiBaseUrl;

import { mockUsers } from '../seedData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default auth header for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if it is a mock session token
      if (token.startsWith('mock_token_')) {
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(mockUsers[0]);
        }
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Verify user session failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: userToken, ...userData } = response.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      console.warn('Auth login failed. Attempting mock user fallback...', error);
      // Fallback
      const mockUser = mockUsers.find((u) => u.email === email.toLowerCase());
      if (mockUser && password === 'password123') {
        const fakeToken = `mock_token_${mockUser._id}`;
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        setToken(fakeToken);
        setUser(mockUser);
        return mockUser;
      }
      throw error;
    }
  };

  const register = async (name, email, password, location) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        location,
      });
      const { token: userToken, ...userData } = response.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      console.warn('Auth registration failed. Attempting mock user fallback...', error);
      // Fallback
      const fakeId = `mock_user_id_${Date.now()}`;
      const mockUser = {
        _id: fakeId,
        name,
        email: email.toLowerCase(),
        location,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      };
      const fakeToken = `mock_token_${fakeId}`;
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setToken(fakeToken);
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mock_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
