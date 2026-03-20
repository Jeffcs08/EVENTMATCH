import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    
    console.log('AuthContext - Token:', token ? 'Presente' : 'Ausente');
    console.log('AuthContext - Username:', username);
    
    if (token && username) {
      setUser({ username: username });
    }
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    console.log('Login no contexto - User:', userData);
    console.log('Login no contexto - Tokens:', tokens);
    
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('username', userData.username);
    setUser(userData);
  };

  const logout = () => {
    console.log('Logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};