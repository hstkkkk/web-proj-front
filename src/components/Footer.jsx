import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Shield, 
  HelpCircle, 
  MessageSquare,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Dumbbell,
  Heart
} from 'lucide-react';

/**
 * 页面底部组件
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', name: 'GitHub' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' }
  ];

  const quickLinks = [
    { icon: FileText, text: '用户协议', href: '/terms' },
    { icon: Shield, text: '隐私政策', href: '/privacy' },
    { icon: HelpCircle, text: '帮助中心', href: '/help' },
    { icon: MessageSquare, text: '意见反馈', href: '/feedback' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden mt-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌区域 - 左对齐 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                体育活动室
              </h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              专业的体育活动管理平台，提供活动创建、报名、订单管理等全方位服务，
              让体育活动组织更简单，参与更便捷。
            </p>
            
            {/* 社交媒体链接 */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg transition-all duration-300 group"
                >
                  <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* 联系方式 - 居中 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/20"
          >
            <h3 className="text-lg font-semibold mb-6 text-blue-400">联系我们</h3>
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-3 text-gray-300 hover:text-white transition-colors group bg-white/5 rounded-xl p-3"
              >
                <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">400-123-4567</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-3 text-gray-300 hover:text-white transition-colors group bg-white/5 rounded-xl p-3"
              >
                <div className="bg-green-500 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">contact@sports-activity.com</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-3 text-gray-300 hover:text-white transition-colors group bg-white/5 rounded-xl p-3"
              >
                <div className="bg-red-500 bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">北京市朝阳区体育大街123号</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 快捷链接 - 右对齐 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-right bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/20"
          >
            <h3 className="text-lg font-semibold mb-6 text-purple-400">快捷链接</h3>
            <div className="space-y-3">
              <motion.a
                href="/activities"
                whileHover={{ x: -5 }}
                className="block text-gray-300 hover:text-white transition-colors text-sm bg-white/5 rounded-xl p-3 hover:bg-white/10"
              >
                活动列表
              </motion.a>
              <motion.a
                href="/about"
                whileHover={{ x: -5 }}
                className="block text-gray-300 hover:text-white transition-colors text-sm bg-white/5 rounded-xl p-3 hover:bg-white/10"
              >
                关于我们
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ x: -5 }}
                className="block text-gray-300 hover:text-white transition-colors text-sm bg-white/5 rounded-xl p-3 hover:bg-white/10"
              >
                联系我们
              </motion.a>
              <motion.a
                href="/help"
                whileHover={{ x: -5 }}
                className="block text-gray-300 hover:text-white transition-colors text-sm bg-white/5 rounded-xl p-3 hover:bg-white/10"
              >
                帮助中心
              </motion.a>
            </div>
          </motion.div>

          {/* 服务时间和统计 - 居中 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/20"
          >
            <h3 className="text-lg font-semibold mb-6 text-pink-400">服务信息</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-white/20">
                <h4 className="text-sm font-bold text-blue-400 mb-2">服务时间</h4>
                <p className="text-xs text-gray-300">周一至周日</p>
                <p className="text-xs text-gray-300">24小时在线服务</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
                  <div className="text-lg font-bold text-blue-400">1000+</div>
                  <div className="text-xs text-gray-400">活跃用户</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg border border-green-400/30">
                  <div className="text-lg font-bold text-green-400">500+</div>
                  <div className="text-xs text-gray-400">精彩活动</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 版权信息 */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white border-opacity-20 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} 体育活动室. All rights reserved.</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>Made with love for sports enthusiasts</span>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <a href="/privacy" className="hover:text-white transition-colors">隐私政策</a>
              <a href="/terms" className="hover:text-white transition-colors">服务条款</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
