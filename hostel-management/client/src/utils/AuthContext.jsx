// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext({});

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Set up axios defaults
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//   }, []);

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('token');
      
//       if (token) {
//         try {
//           const response = await axios.get('/api/auth/me');
//           setUser(response.data.user);
//         } catch (error) {
//           console.error('Auth check failed:', error);
//           localStorage.removeItem('token');
//           delete axios.defaults.headers.common['Authorization'];
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await axios.post('/api/auth/login', credentials);
//       const { token, user } = response.data;

//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(user);

//       return { success: true, user };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed';
//       return { success: false, error: message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/api/auth/admin/register', userData);
//       const { token, user } = response.data;

//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(user);

//       return { success: true, user };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed';
//       return { success: false, error: message };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     register,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // custom axios with baseURL

const AuthContext = createContext({});

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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // ✅ LOGIN (admin: email, student: studentId)
  const login = async ({ role, studentId, email, password }) => {
    try {
      let endpoint, payload;

      if (role === 'admin') {
        endpoint = '/admin/login';
        payload = { email, password };
      } else {
        endpoint = '/student/login';
        payload = { studentId, password };
      }

      const response = await api.post(endpoint, payload);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      navigate(`/${user.role}/dashboard`);

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  // ✅ REGISTER
  const register = async (userData) => {
    const { role } = userData;

    try {
      const endpoint =
        role === 'admin' ? '/admin/register' : '/student/register';

      const response = await api.post(endpoint, userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      navigate(`/${user.role}/dashboard`);

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
