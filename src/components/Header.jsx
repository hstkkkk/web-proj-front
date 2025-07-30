import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Plus, 
  Home,
  Calendar,
  UserCheck,
  Activity,
  ShoppingBag,
  Dumbbell
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

/**
 * 页面头部组件
 * 包含导航菜单和用户信息
 */
const Header = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-2xl relative overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full transform rotate-12"></div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo和网站名称 */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-xl">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
              体育活动室
            </Link>
          </motion.div>

          {/* 桌面端导航菜单 */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/" 
                className="flex items-center space-x-2 hover:text-blue-200 transition-colors group bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl"
              >
                <Home className="h-4 w-4 group-hover:animate-pulse" />
                <span>首页</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/activities" 
                className="flex items-center space-x-2 hover:text-blue-200 transition-colors group"
              >
                <Calendar className="h-4 w-4 group-hover:animate-pulse" />
                <span>活动列表</span>
              </Link>
            </motion.div>
            
            {isAuthenticated && (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/my/registrations" 
                    className="flex items-center space-x-2 hover:text-blue-200 transition-colors group bg-blue-500/20 backdrop-blur-sm px-3 py-2 rounded-xl"
                  >
                    <UserCheck className="h-4 w-4 group-hover:animate-pulse" />
                    <span>我的报名</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/my/activities" 
                    className="flex items-center space-x-2 hover:text-blue-200 transition-colors group"
                  >
                    <Activity className="h-4 w-4 group-hover:animate-pulse" />
                    <span>我的活动</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/my/orders" 
                    className="flex items-center space-x-2 hover:text-blue-200 transition-colors group bg-purple-500/20 backdrop-blur-sm px-3 py-2 rounded-xl"
                  >
                    <ShoppingBag className="h-4 w-4 group-hover:animate-pulse" />
                    <span>我的订单</span>
                  </Link>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/activities/create" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-xl transition-all duration-300 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>创建活动</span>
                  </Link>
                </motion.div>
              </>
            )}
          </nav>

          {/* 用户区域 */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-1 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.realName || user?.username}
                  </span>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/profile" 
                    className="hover:text-blue-200 transition-colors bg-blue-500/20 backdrop-blur-sm px-3 py-2 rounded-xl text-sm"
                  >
                    个人资料
                  </Link>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-xl text-sm transition-all duration-300 shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>退出</span>
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login" 
                    className="hover:text-blue-200 transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
                  >
                    登录
                  </Link>
                </motion.div>
                <span className="text-blue-300">|</span>
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg"
                  >
                    注册
                  </Link>
                </motion.div>
              </div>
            )}

            {/* 移动端菜单按钮 */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="md:hidden bg-white bg-opacity-20 p-2 rounded-xl hover:bg-opacity-30 transition-all"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <motion.div 
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>首页</span>
            </Link>
            
            <Link 
              to="/activities" 
              className="flex items-center space-x-3 hover:text-blue-200 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar className="h-4 w-4" />
              <span>活动列表</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/my/registrations" 
                  className="flex items-center space-x-3 hover:text-blue-200 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>我的报名</span>
                </Link>
                
                <Link 
                  to="/my/activities" 
                  className="flex items-center space-x-3 hover:text-blue-200 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Activity className="h-4 w-4" />
                  <span>我的活动</span>
                </Link>
                
                <Link 
                  to="/my/orders" 
                  className="flex items-center space-x-3 hover:text-blue-200 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>我的订单</span>
                </Link>
                
                <Link 
                  to="/activities/create" 
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 rounded-xl transition-all w-fit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  <span>创建活动</span>
                </Link>
                
                <div className="border-t border-white border-opacity-20 pt-3 mt-3">
                  <div className="flex items-center space-x-3 text-sm mb-3">
                    <User className="h-4 w-4" />
                    <span>{user?.realName || user?.username}</span>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block hover:text-blue-200 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    个人资料
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-red-300 hover:text-red-200 transition-colors py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>退出登录</span>
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="border-t border-white border-opacity-20 pt-3 mt-3 space-y-3">
                <Link 
                  to="/login" 
                  className="block hover:text-blue-200 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 rounded-xl transition-all w-fit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
