import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sentraToken') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = () => {
      const savedToken = localStorage.getItem('sentraToken');
      const savedUser = localStorage.getItem('sentraUser');

      if (!savedToken || !savedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(savedUser);

        // Optional: basic JWT expiration check (client-side)
        try {
          const payload = JSON.parse(atob(savedToken.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            console.warn('Token expired — clearing session');
            localStorage.removeItem('sentraToken');
            localStorage.removeItem('sentraUser');
            setLoading(false);
            return;
          }
        } catch {
          // malformed token → ignore expiration check
        }

        setUser(parsed);
        setToken(savedToken);
      } catch (err) {
        console.error('Invalid auth data in localStorage', err);
        localStorage.removeItem('sentraToken');
        localStorage.removeItem('sentraUser');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // After successful login
const login = async (credentials) => {
  const res = await axios.post('/api/auth/login', credentials);
  const { token, user } = res.data;

  console.log("LOGIN SUCCESS — received user:", user);

  localStorage.setItem("token", token);
  setUser(user);           // ← very important
  // or setUser({ ...user, token }); if your context expects it
};

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('sentraToken');
    localStorage.removeItem('sentraUser');
  };

  const value = { user, token, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};