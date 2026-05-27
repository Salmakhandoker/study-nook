import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { signInWithGoogle } from '../utils/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, photoURL, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, photoURL, password });
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleUser = await signInWithGoogle();
      // Send google user info to our backend to create/login user and set JWT cookie
      const { data } = await api.post('/auth/login', {
        email: googleUser.email,
        name: googleUser.displayName,
        photoURL: googleUser.photoURL,
        authProvider: 'google'
      });
      setUser(data.user);
      toast.success(data.message);
      return true;
    } catch (error) {
      // Ignore firebase popup closed by user
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        toast.error('Google login failed');
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
