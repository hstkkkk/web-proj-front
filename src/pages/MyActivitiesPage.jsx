import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { activityAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

/**
 * 我的活动页面
 */
const MyActivitiesPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, ongoing, past
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyActivities();
  }, [user, navigate]);

  const fetchMyActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getMyCreatedActivities();
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('获取我的活动失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm('确定要删除这个活动吗？此操作不可恢复。')) {
      return;
    }

    try {
      setDeletingId(activityId);
      const response = await activityAPI.deleteActivity(activityId);
      if (response.success) {
        fetchMyActivities();
        alert('活动删除成功！');
      } else {
        alert(response.message || '删除活动失败');
      }
    } catch (error) {
      console.error('删除活动失败:', error);
      alert('删除活动失败，请稍后重试');
    } finally {
      setDeletingId(null);
    }
  };

  const getActivityStatus = (activity) => {
    const now = new Date();
    const startTime = new Date(activity.startTime);
    const endTime = new Date(activity.endTime);

    if (now < startTime) {
      return '报名中';
    } else if (now >= startTime && now <= endTime) {
      return '进行中';
    } else {
      return '已结束';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const status = getActivityStatus(activity);
    
    switch (filter) {
      case 'upcoming':
        return status === '报名中';
      case 'ongoing':
        return status === '进行中';
      case 'past':
        return status === '已结束';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case '报名中':
        return 'bg-green-100 text-green-800';
      case '进行中':
        return 'bg-blue-100 text-blue-800';
      case '已结束':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">我的活动</h1>
              <p className="mt-2 text-gray-600">管理您创建的体育活动</p>
            </div>
            <Link
              to="/activities/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建活动
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              全部活动 ({activities.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              报名中 ({activities.filter(a => getActivityStatus(a) === '报名中').length})
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'ongoing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              进行中 ({activities.filter(a => getActivityStatus(a) === '进行中').length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已结束 ({activities.filter(a => getActivityStatus(a) === '已结束').length})
            </button>
          </div>
        </div>

        {/* 活动列表 */}
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
        ) : filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const status = getActivityStatus(activity);
              return (
                <div key={activity.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {activity.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/activities/${activity.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      {status === '报名中' && (
                        <Link
                          to={`/activities/${activity.id}/edit`}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          title="编辑活动"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )}
                      
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        disabled={deletingId === activity.id}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
                        title="删除活动"
                      >
                        {deletingId === activity.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <div>
                        <div className="font-medium">开始时间</div>
                        <div>{new Date(activity.startTime).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <div>
                        <div className="font-medium">地点</div>
                        <div>{activity.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-green-500" />
                      <div>
                        <div className="font-medium">参与人数</div>
                        <div>{activity.currentParticipants}/{activity.maxParticipants}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-500" />
                      <div>
                        <div className="font-medium">创建时间</div>
                        <div>{new Date(activity.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* 参与进度条 */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">参与进度</span>
                      <span className="text-sm text-gray-500">
                        {Math.round((activity.currentParticipants / activity.maxParticipants) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((activity.currentParticipants / activity.maxParticipants) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {activity.price > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">活动费用</span>
                        <span className="text-lg font-bold text-blue-600">
                          ¥{activity.price}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? '还没有创建任何活动' : 
               filter === 'upcoming' ? '暂无报名中的活动' :
               filter === 'ongoing' ? '暂无进行中的活动' :
               '暂无已结束的活动'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? '创建您的第一个精彩活动吧！' : '试试切换其他筛选条件'}
            </p>
            {filter === 'all' && (
              <Link
                to="/activities/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                创建活动
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActivitiesPage;
