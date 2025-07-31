import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { activityAPI } from '../services/api';

/**
 * 活动列表页面
 */
const ActivityListPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['足球', '篮球', '网球', '羽毛球', '乒乓球', '游泳', '跑步', '健身'];
  const statuses = ['报名中', '进行中', '已结束'];

  // 根据活动时间和状态计算显示状态
  const getActivityDisplayStatus = (activity) => {
    if (!activity) return '未知';
    
    const now = new Date();
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);
    
    // 如果活动被取消
    if (activity.status === 'cancelled') {
      return '已取消';
    }
    
    // 如果活动被标记为完成
    if (activity.status === 'completed') {
      return '已结束';
    }
    
    // 根据时间判断状态
    if (now < startTime) {
      return '报名中';
    } else if (now >= startTime && now <= endTime) {
      return '进行中';
    } else {
      return '已结束';
    }
  };

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getActivities({
        page: currentPage,
        limit: 12,
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
      });

      if (response.success) {
        setActivities(response.data || []);
        // 计算总页数
        const totalPages = Math.ceil((response.total || 0) / 12);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error('获取活动列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchActivities();
  };

  const ActivityCard = ({ activity }) => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {activity.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            getActivityDisplayStatus(activity) === '报名中' ? 'bg-green-500 text-white' :
            getActivityDisplayStatus(activity) === '进行中' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {getActivityDisplayStatus(activity)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(activity.startTime).toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {activity.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {activity.currentParticipants}/{activity.maxParticipants} 人
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            持续 {activity.duration} 小时
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              ¥{activity.price || 0}
            </span>
            {activity.price > 0 && <span className="text-gray-600 ml-1">/人</span>}
          </div>
          <Link
            to={`/activities/${activity.id}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">活动列表</h1>
          <p className="text-gray-700 text-lg">发现精彩的体育活动，开始您的运动之旅</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 搜索和筛选 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索活动..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 分类筛选 */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* 状态筛选 */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">所有状态</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </button>
            </div>
          </form>
        </div>

        {/* 活动网格 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  上一页
                </button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏃</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无活动</h3>
            <p className="text-gray-600">当前筛选条件下没有找到相关活动</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ActivityListPage;
