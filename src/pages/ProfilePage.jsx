import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Edit2, Save, X, Camera } from 'lucide-react';
import { userAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';

/**
 * 个人资料页面
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    realName: '',
  });
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setProfileData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      realName: user.realName || '',
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // 清除对应字段的错误信息
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (profileData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }

    if (!profileData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = '手机号不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(profileData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }

    if (!profileData.realName.trim()) {
      newErrors.realName = '真实姓名不能为空';
    } else if (profileData.realName.length < 2) {
      newErrors.realName = '真实姓名至少需要2个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = '请输入当前密码';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = '请输入新密码';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = '新密码至少需要6个字符';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = '请确认新密码';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.updateProfile(profileData);
      if (response.success) {
        await updateUser(response.data);
        setEditing(false);
        alert('个人资料更新成功！');
      } else {
        setErrors({ general: response.message });
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      setErrors({ general: '更新失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setChangingPassword(true);
    try {
      const response = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        alert('密码修改成功！');
      } else {
        setPasswordErrors({ general: response.message });
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      setPasswordErrors({ general: '修改密码失败，请稍后重试' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      realName: user.realName || '',
    });
    setEditing(false);
    setErrors({});
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
          <p className="mt-2 text-gray-700">管理您的个人信息和账户设置</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 个人信息卡片 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">基本信息</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    编辑资料
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? '保存中...' : '保存'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      取消
                    </button>
                  </div>
                )}
              </div>

              {/* 通用错误信息 */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                  {errors.general}
                </div>
              )}

              <div className="space-y-6">
                {/* 用户名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    用户名
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !editing ? 'bg-gray-50' : errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* 真实姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    真实姓名
                  </label>
                  <input
                    type="text"
                    name="realName"
                    value={profileData.realName}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !editing ? 'bg-gray-50' : errors.realName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.realName && (
                    <p className="mt-1 text-sm text-red-600">{errors.realName}</p>
                  )}
                </div>

                {/* 邮箱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !editing ? 'bg-gray-50' : errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* 手机号 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    手机号码
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !editing ? 'bg-gray-50' : errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 修改密码 */}
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">修改密码</h2>
              
              {/* 密码错误信息 */}
              {passwordErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                  {passwordErrors.general}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* 当前密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前密码
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请输入当前密码"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* 新密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新密码
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请输入新密码（至少6位）"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* 确认新密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请再次输入新密码"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-medium"
                >
                  {changingPassword ? '修改中...' : '修改密码'}
                </button>
              </form>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 头像卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.realName ? user.realName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors duration-200">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user.realName || user.username}</h3>
              <p className="text-gray-600 text-sm">@{user.username}</p>
            </div>

            {/* 账户统计 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">账户统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">创建活动</span>
                  <span className="font-medium text-blue-600">12 个</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">参与活动</span>
                  <span className="font-medium text-green-600">28 次</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">总消费</span>
                  <span className="font-medium text-purple-600">¥486</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">会员等级</span>
                  <span className="font-medium text-yellow-600">黄金会员</span>
                </div>
              </div>
            </div>

            {/* 账户安全 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">账户安全</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">邮箱验证</span>
                  <span className="text-green-600 font-medium">已验证</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">手机验证</span>
                  <span className="text-green-600 font-medium">已验证</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">两步验证</span>
                  <span className="text-gray-400 font-medium">未开启</span>
                </div>
                <div className="text-xs text-gray-600 mt-4">
                  最后登录：{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
