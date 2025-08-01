import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, X, Eye } from 'lucide-react';
import { registrationAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

/**
 * 我的报名页面
 */
const MyRegistrationsPage = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [cancellingId, setCancellingId] = useState(null);

  // 分类名称标准化函数 - 将英文转为中文显示
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'football': '足球',
      'basketball': '篮球',
      'tennis': '网球',
      'badminton': '羽毛球',
      'table tennis': '乒乓球',
      'ping pong': '乒乓球',
      'swimming': '游泳',
      'running': '跑步',
      'fitness': '健身',
      'gym': '健身'
    };
    
    return categoryMap[category?.toLowerCase()] || category;
  };

  useEffect(() => {
    // 等待UserContext加载完成
    if (userLoading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRegistrations();
  }, [user, userLoading, navigate]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationAPI.getMyRegistrations();
      if (response.success) {
        setRegistrations(response.data);
      }
    } catch (error) {
      console.error('获取报名记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!confirm('确定要取消报名吗？')) {
      return;
    }

    try {
      setCancellingId(registrationId);
      const response = await registrationAPI.cancelRegistrationById(registrationId);
      if (response.success) {
        fetchRegistrations();
        alert('取消报名成功！');
      } else {
        alert(response.message || '取消报名失败');
      }
    } catch (error) {
      console.error('取消报名失败:', error);
      alert('取消报名失败，请稍后重试');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const now = new Date();
    const activityStart = new Date(registration.activity.startTime);
    
    switch (filter) {
      case 'upcoming':
        return activityStart > now && registration.status === 'confirmed';
      case 'past':
        return activityStart <= now;
      case 'cancelled':
        return registration.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return '已确认';
      case 'cancelled':
        return '已取消';
      case 'pending':
        return '待确认';
      default:
        return '未知';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">我的报名</h1>
          <p className="text-gray-700 text-lg">管理您参与的活动报名记录</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
        {/* 筛选器 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部报名 ({registrations.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              即将开始 ({registrations.filter(r => {
                const now = new Date();
                const activityStart = new Date(r.activity.startTime);
                return activityStart > now && r.status === 'confirmed';
              }).length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已结束 ({registrations.filter(r => {
                const now = new Date();
                const activityStart = new Date(r.activity.startTime);
                return activityStart <= now;
              }).length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'cancelled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已取消 ({registrations.filter(r => r.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* 报名列表 */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <div key={registration.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {registration.activity.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {getStatusText(registration.status)}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getCategoryDisplayName(registration.activity.category)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {registration.activity.description}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/activities/${registration.activity.id}`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {registration.status === 'confirmed' && 
                     new Date(registration.activity.startTime) > new Date() && (
                      <button
                        onClick={() => handleCancelRegistration(registration.id)}
                        disabled={cancellingId === registration.id}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
                        title="取消报名"
                      >
                        {cancellingId === registration.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">开始时间</div>
                      <div>{new Date(registration.activity.startTime).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <div>
                      <div className="font-medium">地点</div>
                      <div>{registration.activity.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">参与人数</div>
                      <div>{registration.activity.currentParticipants}/{registration.activity.maxParticipants}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    <div>
                      <div className="font-medium">报名时间</div>
                      <div>{new Date(registration.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {registration.activity.price > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">活动费用</span>
                      <span className="text-lg font-bold text-blue-600">
                        ¥{registration.activity.price}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? '暂无报名记录' : 
               filter === 'upcoming' ? '暂无即将开始的活动' :
               filter === 'past' ? '暂无已结束的活动' :
               '暂无已取消的报名'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? '快去发现精彩的活动吧！' : '试试切换其他筛选条件'}
            </p>
            {filter === 'all' && (
              <Link
                to="/activities"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                浏览活动
              </Link>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MyRegistrationsPage;
