import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Space, Button, Drawer, Divider } from 'antd';
import { DashboardOutlined, UserOutlined, ProjectOutlined, FileTextOutlined, LogoutOutlined, MenuOutlined, SearchOutlined, SettingOutlined, } from '@ant-design/icons';
import { logout } from '../store/slices/authSlice';
import './Layout.css';
import { useState } from 'react';
const { Header, Sider, Content } = AntLayout;
const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    const menuItems = [
        {
            key: 'dashboard',
            icon: _jsx(DashboardOutlined, {}),
            label: '仪表板',
            onClick: () => navigate('/dashboard'),
        },
        {
            key: 'customers',
            icon: _jsx(UserOutlined, {}),
            label: '客户管理',
            onClick: () => navigate('/customers'),
        },
        {
            key: 'projects',
            icon: _jsx(ProjectOutlined, {}),
            label: '项目看板',
            onClick: () => navigate('/projects'),
        },
        {
            key: 'search',
            icon: _jsx(SearchOutlined, {}),
            label: '高级搜索',
            onClick: () => navigate('/search'),
        },
        {
            key: 'work-logs',
            icon: _jsx(FileTextOutlined, {}),
            label: '工作日志',
            onClick: () => navigate('/work-logs'),
        },
    ];
    const userMenu = [
        {
            key: 'profile',
            icon: _jsx(UserOutlined, {}),
            label: '个人资料',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            icon: _jsx(SettingOutlined, {}),
            label: '设置',
            onClick: () => navigate('/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: _jsx(LogoutOutlined, {}),
            label: '登出',
            onClick: handleLogout,
        },
    ];
    return (_jsxs(AntLayout, { className: "layout-container", children: [_jsxs(Sider, { trigger: null, collapsible: true, collapsed: collapsed, className: "layout-sider desktop-only", width: 250, children: [_jsx("div", { className: "logo", children: _jsx("span", { className: "logo-text", children: "CRM" }) }), _jsx(Menu, { theme: "dark", mode: "inline", defaultSelectedKeys: ['dashboard'], items: menuItems })] }), _jsxs(AntLayout, { children: [_jsxs(Header, { className: "layout-header", children: [_jsxs("div", { className: "header-left", children: [_jsx(Button, { type: "text", icon: _jsx(MenuOutlined, {}), className: "desktop-only", onClick: () => setCollapsed(!collapsed) }), _jsx(Button, { type: "text", icon: _jsx(MenuOutlined, {}), className: "mobile-only", onClick: () => setMobileDrawerOpen(true) }), _jsx("h1", { className: "header-title", children: "\u5BA2\u6237\u7BA1\u7406\u7CFB\u7EDF" })] }), _jsx("div", { className: "header-right", children: _jsx(Dropdown, { menu: { items: userMenu }, trigger: ['click'], children: _jsxs(Space, { style: { cursor: 'pointer' }, children: [_jsx(Avatar, { icon: _jsx(UserOutlined, {}), size: "large" }), _jsx("span", { className: "user-name", children: user?.fullName || user?.username })] }) }) })] }), _jsx(Content, { className: "layout-content", children: _jsx(Outlet, {}) })] }), _jsxs(Drawer, { title: "\u83DC\u5355", placement: "left", onClose: () => setMobileDrawerOpen(false), open: mobileDrawerOpen, className: "mobile-drawer", children: [_jsx(Menu, { mode: "vertical", items: menuItems, onClick: () => setMobileDrawerOpen(false) }), _jsx(Divider, {}), _jsx(Menu, { mode: "vertical", items: userMenu, onClick: () => setMobileDrawerOpen(false) })] })] }));
};
export default Layout;
