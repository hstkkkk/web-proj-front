import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Clock, Star, Share2, 
  Heart, MessageCircle, User, Phone, Mail, ArrowLeft 
} from 'lucide-react';
import { activityAPI, registrationAPI, commentAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

/**
 * 活动详情页面
 */
const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [activity, setActivity] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

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

  const fetchActivityDetail = useCallback(async () => {
    console.log('正在获取活动详情, ID:', id);
    try {
      const response = await activityAPI.getActivityDetail(parseInt(id));
      console.log('活动详情响应:', response);
      if (response.success) {
        setActivity(response.data);
      } else {
        console.error('获取活动详情失败:', response.message);
      }
    } catch (error) {
      console.error('获取活动详情失败:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentAPI.getActivityComments(parseInt(id));
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  }, [id]);

  const checkRegistrationStatus = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await registrationAPI.checkRegistration(parseInt(id));
      setIsRegistered(response.data?.isRegistered || false);
    } catch (error) {
      console.error('检查报名状态失败:', error);
      setIsRegistered(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (id) {
      fetchActivityDetail();
      fetchComments();
      if (user) {
        checkRegistrationStatus();
      }
    }
  }, [id, user, fetchActivityDetail, fetchComments, checkRegistrationStatus]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      const response = await registrationAPI.registerActivity({
        activityId: parseInt(id),
        notes: ''
      });
      if (response.success) {
        setIsRegistered(true);
        // 刷新活动详情以获取最新的参与人数
        fetchActivityDetail();
        alert('报名成功！');
      } else {
        alert(response.message || '报名失败');
      }
    } catch (error) {
      console.error('报名失败:', error);
      alert('报名失败，请稍后重试');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true);
      const response = await registrationAPI.cancelRegistration(id);
      if (response.success) {
        setIsRegistered(false);
        fetchActivityDetail();
        alert('取消报名成功！');
      } else {
        alert(response.message || '取消报名失败');
      }
    } catch (error) {
      console.error('取消报名失败:', error);
      alert('取消报名失败，请稍后重试');
    } finally {
      setRegistering(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await commentAPI.createComment({ 
        activityId: parseInt(id), 
        content: newComment.trim(),
        rating: 5 // 默认5星评分
      });
      if (response.success) {
        setNewComment('');
        alert('评论发表成功！');
        // 刷新评论列表
        await fetchComments();
      } else {
        alert(response.message || '评论发表失败');
      }
    } catch (error) {
      console.error('发表评论失败:', error);
      alert('评论发表失败，请稍后重试');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">活动不存在</h2>
          <button
            onClick={() => navigate('/activities')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            返回活动列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回按钮 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 活动封面和基本信息 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getCategoryDisplayName(activity.category)}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getActivityDisplayStatus(activity) === '报名中' ? 'bg-green-500 text-white' :
                    getActivityDisplayStatus(activity) === '进行中' ? 'bg-blue-500 text-white' :
                    getActivityDisplayStatus(activity) === '已取消' ? 'bg-red-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {getActivityDisplayStatus(activity)}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      4.8
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {activity.currentParticipants}人参与
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 right-20 flex space-x-2">
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                    <Heart className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">开始时间</div>
                      <div className="text-xs">{new Date(activity.startTime).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    <div>
                      <div className="text-sm font-medium">活动地点</div>
                      <div className="text-xs">{activity.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">持续时间</div>
                      <div className="text-xs">{activity.duration} 小时</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium">参与人数</div>
                      <div className="text-xs">{activity.currentParticipants}/{activity.maxParticipants}</div>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">活动详情</h3>
                  <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                </div>
              </div>
            </div>

            {/* 创建者信息 */}
            <div
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">创建者信息</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.creator?.realName || '活动创建者'}</h4>
                  <p className="text-sm text-gray-600">@{activity.creator?.username}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* 评论区 */}
            <div
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                评论 ({comments.length})
              </h3>

              {/* 发表评论 */}
              {user && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="分享您的想法..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? '发表中...' : '发表评论'}
                    </button>
                  </div>
                </form>
              )}

              {/* 评论列表 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.user?.realName}</span>
                        <span className="text-xs text-gray-600">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-gray-600 text-center py-8">暂无评论，快来发表第一条评论吧！</p>
                )}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div
            className="space-y-6"
          >
            {/* 报名卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ¥{activity.price || 0}
                </div>
                {activity.price > 0 && <div className="text-gray-600 text-sm">每人</div>}
              </div>

              {getActivityDisplayStatus(activity) === '报名中' ? (
                isRegistered ? (
                  <button
                    onClick={handleCancelRegistration}
                    disabled={registering}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {registering ? '处理中...' : '取消报名'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || activity.currentParticipants >= activity.maxParticipants}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {registering ? '报名中...' : 
                     activity.currentParticipants >= activity.maxParticipants ? '已满员' : '立即报名'}
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed font-medium"
                >
                  {getActivityDisplayStatus(activity) === '进行中' ? '活动进行中' : 
                   getActivityDisplayStatus(activity) === '已取消' ? '活动已取消' : '活动已结束'}
                </button>
              )}

              <div className="mt-4 text-center text-sm text-gray-600">
                还有 {activity.maxParticipants - activity.currentParticipants} 个名额
              </div>
            </div>

            {/* 活动须知 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-4">活动须知</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 请提前10分钟到达活动现场</li>
                <li>• 请穿着适合运动的服装和鞋子</li>
                <li>• 活动期间请注意安全，听从组织者安排</li>
                <li>• 如需取消报名，请提前24小时通知</li>
                <li>• 恶劣天气活动可能会延期或取消</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
