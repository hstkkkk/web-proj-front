import React from 'react';

/**
 * 页面底部组件
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 网站信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">体育活动室</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              专业的体育活动管理平台，提供活动创建、报名、订单管理等全方位服务，
              让体育活动组织更简单，参与更便捷。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/activities" className="text-gray-300 hover:text-white transition-colors">
                  活动列表
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  关于我们
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  联系我们
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  帮助中心
                </a>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📧 Email: contact@sports-activity.com</p>
              <p>📞 电话: 400-123-4567</p>
              <p>📍 地址: 北京市朝阳区体育大街123号</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  微信
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  微博
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  QQ
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © 2025 体育活动室. All rights reserved. | 
            <a href="/privacy" className="hover:text-white ml-1">隐私政策</a> | 
            <a href="/terms" className="hover:text-white ml-1">服务条款</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
