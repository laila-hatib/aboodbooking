import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        dispatch({
          type: AUTH_SUCCESS,
          payload: { user },
        });
      } else {
        dispatch({
          type: AUTH_FAILURE,
          payload: null,
        });
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    dispatch({ type: AUTH_START });
    try {
      const response = await authService.login(credentials);
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user: response.user },
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Register
  const register = async (userData) => {
    dispatch({ type: AUTH_START });
    try {
      const response = await authService.register(userData);
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user: response.user },
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch({ type: LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    isAdmin: authService.isAdmin(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('useAuth - context state:', context);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
