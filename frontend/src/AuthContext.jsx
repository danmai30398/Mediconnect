import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider initialized with token:', token ? token.substring(0, 20) + '...' : 'null');

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.defaults.headers.common['Accept'] = 'application/json';
      console.log('Auth token set:', token.substring(0, 20) + '...'); // Debug log
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('Auth token removed'); // Debug log
    }
  }, [token]);

  // Thêm request interceptor để đảm bảo token luôn được gửi - setup ngay lập tức
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
        console.log('Request interceptor - Token added to request:', config.url, currentToken.substring(0, 20) + '...');
      } else {
        console.log('Request interceptor - No token found for request:', config.url);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thêm response interceptor để debug lỗi 401 - setup ngay lập tức
  const responseInterceptor = axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.error('401 Unauthorized - Token might be invalid or expired:', error.config?.url);
        console.error('Request headers:', error.config?.headers);
        console.error('Current token:', localStorage.getItem('token')?.substring(0, 20) + '...');
      }
      return Promise.reject(error);
    }
  );

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('Checking auth with token:', token.substring(0, 20) + '...');
          const response = await axios.get('http://localhost:8000/api/me');
          console.log('Auth check successful:', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          console.error('Error details:', error.response?.data);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: username,
        password
      });

      const { token, user } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('MediUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      console.log('Login successful, token saved:', token.substring(0, 20) + '...'); // Debug log

      return { success: true };
    } catch (error) {
      console.error("Login Error: ", error);  

      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };


  const register = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);

      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('MediUser', JSON.stringify(user));
      localStorage.setItem('token', token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('MediUser');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    // Cleanup interceptors
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const updateUserAvatar = (newAvatarPath) => {
    if (user) {
      setUser({
        ...user,
        image: newAvatarPath
      });
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateUserAvatar,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
