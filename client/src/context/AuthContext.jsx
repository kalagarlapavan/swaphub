import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

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
    const response = await axios.post('/api/auth/login', { email, password });
    const { token: userToken, ...userData } = response.data;
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, location) => {
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
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
