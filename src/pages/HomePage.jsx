import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityAPI } from '../services/api';
import ActivityCard from '../components/ActivityCard';
import Loading from '../components/Loading';

/**
 * 首页组件
 * 展示平台介绍和热门活动
 */
const HomePage = () => {
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedActivities();
  }, []);

  const fetchFeaturedActivities = async () => {
    try {
      const response = await activityAPI.getActivities({ 
        page: 1, 
        limit: 6,
        // 按创建时间排序获取最新活动
      });
      
      if (response.success) {
        setFeaturedActivities(response.data);
      }
    } catch (error) {
      console.error('获取推荐活动失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="加载首页数据中..." />;
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            体育活动室
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            专业的体育活动管理平台，让体育运动更有趣、更便捷。
            创建活动、参与报名、管理订单，一站式解决方案。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/activities"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              浏览活动
            </Link>
            <Link
              to="/activities/create"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              创建活动
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            平台特色
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">丰富活动</h3>
              <p className="text-gray-600">
                涵盖跑步、篮球、足球、羽毛球等多种体育项目，
                满足不同运动爱好者的需求。
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">便捷报名</h3>
              <p className="text-gray-600">
                简单快捷的报名流程，支持在线支付，
                让参与体育活动变得更加容易。
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">智能管理</h3>
              <p className="text-gray-600">
                活动组织者可以轻松管理参与者、订单和评价，
                提供完整的活动管理解决方案。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              热门活动
            </h2>
            <Link
              to="/activities"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              查看全部 →
            </Link>
          </div>
          
          {featuredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600">
                暂无活动
              </h3>
              <p className="text-gray-600 mb-6">
                现在还没有活动，成为第一个创建活动的人吧！
              </p>
              <Link
                to="/activities/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                创建首个活动
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">活跃用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">举办活动</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-blue-200">运动项目</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">用户满意度</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
