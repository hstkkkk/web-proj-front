import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Users, 
  Calendar, 
  Trophy, 
  Star,
  Sparkles,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* 背景动画元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full transform rotate-12 animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full transform -rotate-12"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full animate-bounce [animation-delay:1s]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full animate-bounce [animation-delay:2s]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
            >
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm">全新体育活动管理平台</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            >
              体育活动室
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed"
            >
              专业的体育活动管理平台，让体育运动更有趣、更便捷。
              <br />
              <span className="text-blue-300">创建活动、参与报名、管理订单，一站式解决方案。</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/activities"
                  className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-2xl"
                >
                  <Play className="h-5 w-5 group-hover:animate-pulse" />
                  <span>浏览活动</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/activities/create"
                  className="group inline-flex items-center space-x-3 bg-transparent border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <Zap className="h-5 w-5 group-hover:animate-spin" />
                  <span>创建活动</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* 滚动指示器 */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-500 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-right mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
              平台特色
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl ml-auto">
              为体育爱好者打造的专业平台，提供全方位的活动管理解决方案
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 第一个特色 - 左对齐 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
              }}
              className="group text-left p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    丰富活动
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4"></div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                涵盖跑步、篮球、足球、羽毛球等多种体育项目，
                满足不同运动爱好者的需求，让每个人都能找到适合的运动。
              </p>
            </motion.div>
            
            {/* 第二个特色 - 居中 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)"
              }}
              className="group text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-200"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
                  便捷报名
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4"></div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                简单快捷的报名流程，支持在线支付，
                智能匹配合适的活动，让参与体育活动变得更加容易。
              </p>
            </motion.div>
            
            {/* 第三个特色 - 右对齐 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.15)"
              }}
              className="group text-right p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200"
            >
              <div className="flex items-start space-x-4 mb-6 flex-row-reverse">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
                    智能管理
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full ml-auto mb-4"></div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                活动组织者可以轻松管理参与者、订单和评价，
                提供完整的活动管理解决方案和数据分析。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="py-20 bg-gradient-to-r from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center mb-16"
          >
            <div className="text-left md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                热门活动
              </h2>
              <p className="text-xl text-gray-600">
                发现最受欢迎的体育活动，加入运动大家庭
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 md:mt-0"
            >
              <Link
                to="/activities"
                className="group inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
              >
                <span>查看全部</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          
          {featuredActivities.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ActivityCard activity={activity} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Calendar className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                暂无活动
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                现在还没有活动，成为第一个创建活动的人，开启精彩的体育之旅！
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/activities/create"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>创建首个活动</span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-36 -translate-y-36"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              平台数据统计
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl">
              数字见证我们的成长，用户的信任是我们前进的动力
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 统计卡片 - 交替布局 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-left group"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 hover:from-blue-400/30 hover:to-blue-500/30 transition-all duration-300 border border-blue-400/20">
                <Users className="h-12 w-12 mb-4 text-blue-200 group-hover:scale-110 transition-transform" />
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  1000+
                </div>
                <div className="text-blue-200 text-lg font-medium">活跃用户</div>
                <p className="text-sm text-blue-300 mt-2">每日活跃用户持续增长</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-8 hover:from-green-400/30 hover:to-green-500/30 transition-all duration-300 border border-green-400/20">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-green-200 group-hover:scale-110 transition-transform" />
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-green-200 text-lg font-medium">举办活动</div>
                <p className="text-sm text-green-300 mt-2">涵盖多种体育项目</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-right group"
            >
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-8 hover:from-yellow-400/30 hover:to-yellow-500/30 transition-all duration-300 border border-yellow-400/20">
                <Target className="h-12 w-12 ml-auto mb-4 text-yellow-200 group-hover:scale-110 transition-transform" />
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  20+
                </div>
                <div className="text-yellow-200 text-lg font-medium">运动项目</div>
                <p className="text-sm text-yellow-300 mt-2">满足不同运动需求</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 hover:from-pink-400/30 hover:to-pink-500/30 transition-all duration-300 border border-pink-400/20">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-pink-200 group-hover:scale-110 transition-transform" />
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  98%
                </div>
                <div className="text-pink-200 text-lg font-medium">用户满意度</div>
                <p className="text-sm text-pink-300 mt-2">用户好评如潮</p>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20 bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                准备开始您的体育之旅了吗？
              </h3>
              <p className="text-xl text-blue-200 mb-10 leading-relaxed">
                加入我们，发现更多精彩活动，结识志同道合的朋友
                <br />
                <span className="text-lg text-blue-300">让运动成为生活的美好组成部分</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-white to-blue-50 text-blue-600 px-10 py-4 rounded-2xl font-bold hover:from-blue-50 hover:to-white transition-all duration-300 shadow-2xl"
                  >
                    <Star className="h-6 w-6" />
                    <span className="text-lg">立即注册</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/activities"
                    className="inline-flex items-center space-x-3 bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-lg">浏览活动</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
