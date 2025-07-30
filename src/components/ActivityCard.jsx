import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Clock, 
  Tag,
  ArrowRight,
  Heart,
  Eye
} from 'lucide-react';

/**
 * 活动卡片组件
 * 用于在活动列表中显示活动基本信息
 */
const ActivityCard = ({ activity }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      active: '进行中',
      completed: '已结束',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const isActivityFull = activity.currentParticipants >= activity.maxParticipants;
  const isActivityStarted = new Date(activity.startTime) <= new Date();

  return (
    <motion.div 
      whileHover={{ 
        y: -8,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* 活动图片 */}
      <div className="relative h-48 overflow-hidden">
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full animate-pulse [animation-delay:1s]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full animate-pulse [animation-delay:0.5s]"></div>
            </div>
            
            <div className="text-white text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
              🏃‍♂️
            </div>
          </div>
        )}
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* 状态标签 */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20 ${getStatusColor(activity.status)}`}>
            {getStatusText(activity.status)}
          </span>
        </div>

        {/* 价格标签 */}
        <div className="absolute bottom-4 left-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-xl text-sm font-bold shadow-lg border border-white/20"
          >
            {activity.price > 0 ? (
              <span className="text-orange-600">¥{activity.price}</span>
            ) : (
              <span className="text-green-600">免费</span>
            )}
          </motion.div>
        </div>

        {/* 悬浮操作按钮 */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 活动信息 */}
      <div className="p-6">
        {/* 活动分类和评分 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-sm font-medium">
              {activity.category}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 font-medium">4.8</span>
          </div>
        </div>

        {/* 活动标题 */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {activity.title}
        </h3>

        {/* 活动描述 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {activity.description}
        </p>

        {/* 活动详情 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <span className="font-medium">{formatDate(activity.startTime)}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-green-500" />
            </div>
            <span className="truncate font-medium">{activity.location}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {activity.currentParticipants}/{activity.maxParticipants} 人
              </span>
              {isActivityFull && (
                <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded-full font-medium">
                  已满
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ x: 5 }}
          >
            <Link
              to={`/activities/${activity.id}`}
              className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>查看详情</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            {isActivityStarted ? (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>已开始</span>
              </div>
            ) : isActivityFull ? (
              <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-lg">
                已满员
              </span>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/activities/${activity.id}`}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                >
                  立即报名
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
