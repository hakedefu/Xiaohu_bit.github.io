import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { RootState } from './store';
import { restoreSession } from './store/slices/authSlice';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

/**
 * 受保护的路由 - 需要认证
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 公开路由 - 未认证用户重定向
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 恢复会话
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* 受保护的路由 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            {/* 其他受保护的路由在这里添加 */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
