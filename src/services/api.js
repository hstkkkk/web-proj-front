import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:7001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    
    // 处理401错误 - token过期或无效
    if (error.response && error.response.status === 401) {
      console.log('收到401错误，清除认证信息');
      // 清除本地存储的认证信息
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

// 用户相关API
export const userAPI = {
  // 用户注册
  register: (userData) => api.post('/users/register', userData),
  
  // 用户登录
  login: (loginData) => api.post('/users/login', loginData),
  
  // 获取用户信息
  getUserInfo: (userId) => api.get(`/users/${userId}`),
  
  // 更新用户信息
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
};

// 活动相关API
export const activityAPI = {
  // 获取活动列表
  getActivities: (params) => api.get('/activities', { params }),
  
  // 获取活动详情
  getActivityDetail: (activityId) => api.get(`/activities/${activityId}`),
  
  // 创建活动
  createActivity: (activityData) => api.post('/activities', activityData),
  
  // 更新活动
  updateActivity: (activityId, activityData) => api.put(`/activities/${activityId}`, activityData),
  
  // 删除活动
  deleteActivity: (activityId) => api.delete(`/activities/${activityId}`),
  
  // 获取我创建的活动
  getMyCreatedActivities: () => api.get('/activities/my/created'),
  getMyActivities: () => api.get('/activities/my/created'), // 保持向后兼容
};

// 报名相关API
export const registrationAPI = {
  // 报名活动
  registerActivity: (registrationData) => api.post('/registrations', registrationData),
  
  // 取消报名
  cancelRegistration: (activityId) => api.delete(`/registrations/activity/${activityId}`),
  
  // 通过报名ID取消报名
  cancelRegistrationById: (registrationId) => api.delete(`/registrations/${registrationId}`),
  
  // 获取我的报名记录
  getMyRegistrations: () => api.get('/registrations/my'),
  
  // 获取活动报名列表
  getActivityRegistrations: (activityId) => api.get(`/registrations/activity/${activityId}`),
  
  // 检查是否已报名
  checkRegistration: (activityId) => api.get(`/registrations/check/${activityId}`),
};

// 评论相关API
export const commentAPI = {
  // 创建评论
  createComment: (commentData) => api.post('/comments', commentData),
  
  // 获取活动评论
  getActivityComments: (activityId, params) => api.get(`/comments/activity/${activityId}`, { params }),
  
  // 获取我的评论
  getMyComments: () => api.get('/comments/my'),
  
  // 删除评论
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  
  // 获取活动评分统计
  getActivityRatingStats: (activityId) => api.get(`/comments/stats/${activityId}`),
};

// 订单相关API
export const orderAPI = {
  // 创建订单
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // 获取我的订单
  getMyOrders: (status) => api.get('/orders/my', { params: { status } }),
  
  // 获取订单详情
  getOrderDetail: (orderNumber) => api.get(`/orders/${orderNumber}`),
  
  // 支付订单
  payOrder: (orderNumber) => api.put(`/orders/${orderNumber}/pay`),
  
  // 取消订单
  cancelOrder: (orderNumber) => api.put(`/orders/${orderNumber}/cancel`),
  
  // 申请退款
  refundOrder: (orderNumber) => api.put(`/orders/${orderNumber}/refund`),
  
  // 获取订单统计
  getOrderStats: () => api.get('/orders/stats/my'),
};

export default api;
