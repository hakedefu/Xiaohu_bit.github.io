import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Space, Button, Drawer, Divider } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import './Layout.css';
import { useState } from 'react';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'customers',
      icon: <UserOutlined />,
      label: '客户管理',
      onClick: () => navigate('/customers'),
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目看板',
      onClick: () => navigate('/projects'),
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: '高级搜索',
      onClick: () => navigate('/search'),
    },
    {
      key: 'work-logs',
      icon: <FileTextOutlined />,
      label: '工作日志',
      onClick: () => navigate('/work-logs'),
    },
  ];

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout className="layout-container">
      {/* 桌面端侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="layout-sider desktop-only"
        width={250}
      >
        <div className="logo">
          <span className="logo-text">CRM</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>

      {/* 主布局 */}
      <AntLayout>
        {/* 顶部导航栏 */}
        <Header className="layout-header">
          <div className="header-left">
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="desktop-only"
              onClick={() => setCollapsed(!collapsed)}
            />
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="mobile-only"
              onClick={() => setMobileDrawerOpen(true)}
            />
            <h1 className="header-title">客户管理系统</h1>
          </div>

          <div className="header-right">
            <Dropdown menu={{ items: userMenu as any }} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} size="large" />
                <span className="user-name">{user?.fullName || user?.username}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="layout-content">
          <Outlet />
        </Content>
      </AntLayout>

      {/* 移动端菜单抽屉 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        className="mobile-drawer"
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={() => setMobileDrawerOpen(false)}
        />
        <Divider />
        <Menu
          mode="vertical"
          items={userMenu as any}
          onClick={() => setMobileDrawerOpen(false)}
        />
      </Drawer>
    </AntLayout>
  );
};

export default Layout;
