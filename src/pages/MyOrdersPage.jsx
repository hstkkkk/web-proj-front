import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, Clock, Eye, RefreshCw } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

/**
 * 我的订单页面
 */
const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, paid, cancelled, refunded
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      setProcessingId(orderId);
      const response = await orderAPI.payOrder(orderId);
      if (response.success) {
        fetchOrders();
        alert('支付成功！');
      } else {
        alert(response.message || '支付失败');
      }
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请稍后重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('确定要取消这个订单吗？')) {
      return;
    }

    try {
      setProcessingId(orderId);
      const response = await orderAPI.cancelOrder(orderId);
      if (response.success) {
        fetchOrders();
        alert('订单取消成功！');
      } else {
        alert(response.message || '取消订单失败');
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败，请稍后重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefundOrder = async (orderId) => {
    if (!confirm('确定要申请退款吗？')) {
      return;
    }

    try {
      setProcessingId(orderId);
      const response = await orderAPI.refundOrder(orderId);
      if (response.success) {
        fetchOrders();
        alert('退款申请提交成功！');
      } else {
        alert(response.message || '申请退款失败');
      }
    } catch (error) {
      console.error('申请退款失败:', error);
      alert('申请退款失败，请稍后重试');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待支付';
      case 'paid':
        return '已支付';
      case 'cancelled':
        return '已取消';
      case 'refunded':
        return '已退款';
      default:
        return '未知';
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
          <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
          <p className="mt-2 text-gray-600">管理您的活动订单和支付记录</p>
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
              全部订单 ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              待支付 ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'paid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已支付 ({orders.filter(o => o.status === 'paid').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'cancelled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已取消 ({orders.filter(o => o.status === 'cancelled').length})
            </button>
            <button
              onClick={() => setFilter('refunded')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === 'refunded'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已退款 ({orders.filter(o => o.status === 'refunded').length})
            </button>
          </div>
        </div>

        {/* 订单列表 */}
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
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {order.activity.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {order.activity.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      订单号：{order.orderNumber}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/activities/${order.activity.id}`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      title="查看活动详情"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handlePayOrder(order.id)}
                          disabled={processingId === order.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 text-sm"
                        >
                          {processingId === order.id ? '支付中...' : '立即支付'}
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={processingId === order.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 text-sm"
                        >
                          取消订单
                        </button>
                      </>
                    )}
                    
                    {order.status === 'paid' && 
                     new Date(order.activity.startTime) > new Date() && (
                      <button
                        onClick={() => handleRefundOrder(order.id)}
                        disabled={processingId === order.id}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 text-sm flex items-center"
                      >
                        {processingId === order.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        申请退款
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">活动时间</div>
                      <div>{new Date(order.activity.startTime).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <div>
                      <div className="font-medium">活动地点</div>
                      <div>{order.activity.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">支付方式</div>
                      <div>{order.paymentMethod || '在线支付'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    <div>
                      <div className="font-medium">下单时间</div>
                      <div>{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* 价格信息 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>活动费用</span>
                    <span>¥{order.amount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>优惠减免</span>
                    <span>-¥{order.discount || 0}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">实付金额</span>
                      <span className="text-xl font-bold text-blue-600">
                        ¥{order.finalAmount || order.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 支付时间和退款信息 */}
                {order.status === 'paid' && order.paidAt && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">支付时间：</span>
                    {new Date(order.paidAt).toLocaleString()}
                  </div>
                )}

                {order.status === 'refunded' && order.refundedAt && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">退款时间：</span>
                    {new Date(order.refundedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? '暂无订单记录' : 
               filter === 'pending' ? '暂无待支付订单' :
               filter === 'paid' ? '暂无已支付订单' :
               filter === 'cancelled' ? '暂无已取消订单' :
               '暂无已退款订单'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? '快去参与付费活动生成订单吧！' : '试试切换其他筛选条件'}
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
  );
};

export default MyOrdersPage;
