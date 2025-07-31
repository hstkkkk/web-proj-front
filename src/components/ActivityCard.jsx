import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* 活动图片 */}
      <div className="h-48 ocean-bg relative overflow-hidden">
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <div className="text-white text-4xl">🏃‍♂️</div>
          </div>
        )}
        
        {/* 状态标签 */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
            {getStatusText(activity.status)}
          </span>
        </div>

        {/* 价格标签 */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-lg text-sm font-semibold">
            {activity.price > 0 ? `¥${activity.price}` : '免费'}
          </span>
        </div>
      </div>

      {/* 活动信息 */}
      <div className="p-4">
        {/* 活动标题 */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {activity.title}
        </h3>

        {/* 活动分类 */}
        <div className="flex items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {activity.category}
          </span>
        </div>

        {/* 活动描述 */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {activity.description}
        </p>

        {/* 活动详情 */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>{formatDate(activity.startTime)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span className="truncate">{activity.location}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">👥</span>
            <span>
              {activity.currentParticipants}/{activity.maxParticipants} 人
            </span>
            {isActivityFull && (
              <span className="ml-2 text-red-500 text-xs">(已满)</span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center">
          <Link
            to={`/activities/${activity.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            查看详情 →
          </Link>
          
          <div className="flex items-center space-x-2">
            {isActivityStarted ? (
              <span className="text-gray-600 text-xs">已开始</span>
            ) : isActivityFull ? (
              <span className="text-red-500 text-xs">已满员</span>
            ) : (
              <Link
                to={`/activities/${activity.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
              >
                立即报名
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
