import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userAPI } from '../services/api';

// 创建用户上下文
const UserContext = createContext();

// 初始状态
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// 用户状态reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// 用户上下文提供者组件
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // 登录
  const login = async (loginData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await userAPI.login(loginData);
      
      if (response.success) {
        const userData = response.data;
        // 保存用户数据和token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('token', userData.token);
        dispatch({ type: 'SET_USER', payload: userData });
        return { success: true, data: userData };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '登录失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // 注册
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await userAPI.register(userData);
      
      if (response.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, data: response.data };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // 登出
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // 更新用户信息
  const updateUser = async (userId, userData) => {
    try {
      const response = await userAPI.updateUser(userId, userData);
      
      if (response.success) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
        return { success: true, data: updatedUser };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '更新失败';
      return { success: false, message: errorMessage };
    }
  };

  // 验证当前用户token是否有效
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('验证Token - token存在:', !!token);
    console.log('验证Token - user存在:', !!storedUser);
    
    if (!token || !storedUser) {
      console.log('Token或用户数据不存在，设置为未登录状态');
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      // 解析存储的用户数据
      const userData = JSON.parse(storedUser);
      console.log('解析用户数据成功:', userData);
      
      // 先直接恢复用户状态，让真实的API调用来验证token有效性
      dispatch({ type: 'SET_USER', payload: userData });
      
    } catch (error) {
      // 用户数据格式错误，清除本地数据
      console.error('用户数据解析失败:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 初始化时检查本地存储的用户信息并验证token
  useEffect(() => {
    validateToken();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义hook来使用用户上下文
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser必须在UserProvider内部使用');
  }
  return context;
};

export default UserContext;
