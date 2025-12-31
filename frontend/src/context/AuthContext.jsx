import { createContext, useContext, useState, useEffect } from 'react';
import { register as registerService, login as loginService, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      const { data } = response;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }));
      
      setToken(data.token);
      setUser({ id: data.id, name: data.name, email: data.email });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginService(credentials);
      const { data } = response;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email }));
      
      setToken(data.token);
      setUser({ id: data.id, name: data.name, email: data.email });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials.';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

