# 体育活动管理系统 - 前端

基于 React + Vite 构建的现代化体育活动管理系统前端应用。

## 🚀 技术栈

- **框架**: React 18
- **构建工具**: Vite 5.4
- **路由**: React Router DOM 6
- **状态管理**: React Context + useReducer
- **HTTP 客户端**: Axios
- **样式**: CSS3 + 响应式设计
- **测试**: Vitest + React Testing Library
- **代码检查**: ESLint

## 📋 功能特性

### 🔐 用户认证
- 用户注册/登录
- JWT Token 认证
- 自动登录状态维护
- 用户信息管理

### 🏃‍♀️ 活动管理
- 浏览活动列表
- 查看活动详情
- 创建活动（需登录）
- 编辑/删除自己的活动

### 📝 报名系统
- 活动报名
- 取消报名
- 查看我的报名记录
- 报名状态管理

### 💬 评论功能
- 活动评论
- 评分系统
- 评论管理

### 📊 订单管理
- 订单创建
- 订单支付
- 订单状态跟踪

## 🛠️ 开发环境设置

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问: http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 🧪 测试

### 运行所有测试
```bash
npm run test
```

### 运行测试并生成覆盖率报告
```bash
npm run test:coverage
```

### 监听模式运行测试
```bash
npm run test:watch
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Header.jsx      # 导航头部
│   └── ...
├── contexts/           # React Context
│   └── UserContext.jsx # 用户状态管理
├── pages/              # 页面组件
│   ├── LoginPage.jsx   # 登录页面
│   ├── RegisterPage.jsx # 注册页面
│   ├── HomePage.jsx    # 首页
│   ├── ActivityPage.jsx # 活动页面
│   └── ...
├── services/           # API 服务
│   └── api.js         # API 接口封装
├── styles/            # 样式文件
├── utils/             # 工具函数
├── App.jsx            # 根组件
└── main.jsx           # 入口文件

test/
├── components/        # 组件测试
├── contexts/          # Context 测试
├── pages/             # 页面测试
├── services/          # API 测试
└── setup.js           # 测试配置
```

## 🔧 配置说明

### API 配置
在 `src/services/api.js` 中配置后端 API 地址：
```javascript
const api = axios.create({
  baseURL: 'http://localhost:7001/api', // 后端 API 地址
  timeout: 10000,
});
```

### 路由配置
主要路由在 `src/App.jsx` 中定义：
- `/` - 首页
- `/login` - 登录页
- `/register` - 注册页
- `/activities` - 活动列表
- `/activities/:id` - 活动详情
- `/profile` - 用户中心

## 🎨 样式约定

- 使用 CSS3 Flexbox/Grid 布局
- 响应式设计，支持移动端
- 遵循 BEM 命名规范
- 主题色彩系统统一

## 📱 响应式设计

- **桌面端**: >= 1024px
- **平板端**: 768px - 1023px
- **手机端**: < 768px

## 🔒 安全特性

- JWT Token 自动添加到请求头
- 登录状态自动检查
- 路由级别的权限控制
- XSS 防护

## 🚀 部署

### 环境变量
创建 `.env.production` 文件：
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### 构建并部署
```bash
npm run build
# 将 dist/ 目录部署到您的静态文件服务器
```

## 🤝 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 组件使用函数式组件 + Hooks
- 状态管理优先使用 Context
- 异步操作使用 async/await

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📞 联系方式

如有问题或建议，请联系开发团队。

## 📄 许可证

MIT License
