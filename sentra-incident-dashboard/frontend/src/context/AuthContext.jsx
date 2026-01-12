import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { _id, name, email, role }
  const [token, setToken] = useState(localStorage.getItem('sentraToken') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    // Optional: call /api/auth/me here later
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('sentraToken', jwtToken);
    localStorage.setItem('sentraUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('sentraToken');
    localStorage.removeItem('sentraUser');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('sentraUser');
    const savedToken = localStorage.getItem('sentraToken');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
