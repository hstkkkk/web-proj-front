import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

/**
 * 页面头部组件
 * 包含导航菜单和用户信息
 */
const Header = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo和网站名称 */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200">
              体育活动室
            </Link>
          </div>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/activities" 
              className="hover:text-blue-200 transition-colors"
            >
              活动列表
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/my/registrations" 
                  className="hover:text-blue-200 transition-colors"
                >
                  我的报名
                </Link>
                <Link 
                  to="/my/activities" 
                  className="hover:text-blue-200 transition-colors"
                >
                  我的活动
                </Link>
                <Link 
                  to="/my/orders" 
                  className="hover:text-blue-200 transition-colors"
                >
                  我的订单
                </Link>
                <Link 
                  to="/activities/create" 
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
                >
                  创建活动
                </Link>
              </>
            )}
          </nav>

          {/* 用户区域 */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  欢迎, {user?.realName || user?.username}
                </span>
                <Link 
                  to="/profile" 
                  className="hover:text-blue-200 transition-colors"
                >
                  个人资料
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="hover:text-blue-200 transition-colors"
                >
                  登录
                </Link>
                <span className="text-blue-300">|</span>
                <Link 
                  to="/register" 
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 移动端菜单 */}
        <div className="md:hidden mt-4 space-y-2">
          <Link 
            to="/activities" 
            className="block hover:text-blue-200 transition-colors"
          >
            活动列表
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/my/registrations" 
                className="block hover:text-blue-200 transition-colors"
              >
                我的报名
              </Link>
              <Link 
                to="/my/activities" 
                className="block hover:text-blue-200 transition-colors"
              >
                我的活动
              </Link>
              <Link 
                to="/my/orders" 
                className="block hover:text-blue-200 transition-colors"
              >
                我的订单
              </Link>
              <Link 
                to="/activities/create" 
                className="block bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors w-fit"
              >
                创建活动
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
