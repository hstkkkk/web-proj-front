import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

/**
 * 主应用组件
 * 包含路由配置和全局布局
 */
function App() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* TODO: 添加更多路由 */}
            {/* <Route path="/activities" element={<ActivityListPage />} />
            <Route path="/activities/:id" element={<ActivityDetailPage />} />
            <Route path="/activities/create" element={<CreateActivityPage />} />
            <Route path="/my/registrations" element={<MyRegistrationsPage />} />
            <Route path="/my/activities" element={<MyActivitiesPage />} />
            <Route path="/my/orders" element={<MyOrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  )
}

export default App
