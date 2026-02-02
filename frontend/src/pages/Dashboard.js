import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Space, Tag, Button, Empty, Spin, Segmented } from 'antd';
import { ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { projectApi } from '../services/api';
import { ProjectStatus, Priority } from '../types';
import './Dashboard.css';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState({ projects: 'list', quadrant: 'hide' });
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // 获取项目统计
            const statsResponse = await projectApi.getStats();
            setStats(statsResponse.data.data);
            // 获取最近项目
            const projectResponse = await projectApi.search({}, 1, 10);
            setProjects(projectResponse.data.data.data);
        }
        catch (error) {
            console.error('获取仪表板数据失败:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getPriorityColor = (priority) => {
        const colors = {
            [Priority.LOW]: 'blue',
            [Priority.MEDIUM]: 'cyan',
            [Priority.HIGH]: 'orange',
            [Priority.URGENT]: 'red',
        };
        return colors[priority];
    };
    const getStatusColor = (status) => {
        const colors = {
            [ProjectStatus.BACKLOG]: 'default',
            [ProjectStatus.TODO]: 'processing',
            [ProjectStatus.IN_PROGRESS]: 'processing',
            [ProjectStatus.REVIEW]: 'processing',
            [ProjectStatus.COMPLETED]: 'success',
            [ProjectStatus.BLOCKED]: 'error',
            [ProjectStatus.CANCELLED]: 'default',
        };
        return colors[status];
    };
    const getTimeWarning = (dueDate) => {
        const days = dayjs(dueDate).diff(dayjs(), 'day');
        if (days < 0) {
            return _jsx(Tag, { icon: _jsx(ExclamationCircleOutlined, {}), color: "red", children: "\u903E\u671F" });
        }
        else if (days <= 3) {
            return _jsx(Tag, { icon: _jsx(ClockCircleOutlined, {}), color: "orange", children: "\u7D27\u6025" });
        }
        else if (days <= 7) {
            return _jsx(Tag, { icon: _jsx(ClockCircleOutlined, {}), color: "gold", children: "\u5373\u5C06\u5230\u671F" });
        }
        return _jsx(Tag, { icon: _jsx(CheckCircleOutlined, {}), color: "green", children: "\u5145\u8DB3" });
    };
    const projectColumns = [
        {
            title: '项目名称',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '客户',
            key: 'customer',
            render: (_, record) => record.customer?.name || '-',
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (_jsx(Tag, { color: getPriorityColor(priority), children: priority })),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (_jsx(Tag, { color: getStatusColor(status), children: status })),
        },
        {
            title: '截止日期',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (dueDate) => {
                const date = dayjs(dueDate);
                return (_jsxs(Space, { children: [_jsx("span", { children: date.format('YYYY-MM-DD') }), getTimeWarning(dueDate)] }));
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (_jsx(Button, { type: "link", size: "small", onClick: () => console.log(record.id), children: "\u8BE6\u60C5" })),
        },
    ];
    if (loading) {
        return _jsx(Spin, { size: "large", style: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' } });
    }
    return (_jsxs("div", { className: "dashboard-container", children: [_jsxs("div", { className: "dashboard-header", children: [_jsx("h1", { children: "\u4EEA\u8868\u677F" }), _jsx("p", { children: "\u6B22\u8FCE\u56DE\u6765\uFF01\u8FD9\u662F\u60A8\u7684\u9879\u76EE\u548C\u4EFB\u52A1\u6982\u89C8\u3002" })] }), _jsxs(Row, { gutter: [24, 24], children: [_jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u603B\u9879\u76EE\u6570", value: stats?.totalProjects || 0, prefix: _jsx(ProjectOutlined, {}), valueStyle: { color: '#1f2937' } }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u5DF2\u5B8C\u6210", value: stats?.completedProjects || 0, prefix: _jsx(CheckCircleOutlined, {}), valueStyle: { color: '#10b981' } }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u903E\u671F\u9879\u76EE", value: stats?.overdueProjects || 0, prefix: _jsx(ExclamationCircleOutlined, {}), valueStyle: { color: '#ef4444' } }) }) }), _jsx(Col, { xs: 24, sm: 12, lg: 6, children: _jsx(Card, { hoverable: true, children: _jsx(Statistic, { title: "\u5373\u5C06\u5230\u671F", value: stats?.dueSoonProjects || 0, prefix: _jsx(ClockCircleOutlined, {}), valueStyle: { color: '#f59e0b' } }) }) })] }), _jsx(Row, { gutter: [24, 24], style: { marginTop: 24 }, children: _jsx(Col, { span: 24, children: _jsx(Card, { title: "\u6700\u8FD1\u9879\u76EE", extra: _jsx(Segmented, { value: viewMode.projects, onChange: (value) => setViewMode({ ...viewMode, projects: value }), options: [
                                { label: '列表视图', value: 'list' },
                                { label: '统计视图', value: 'stats' },
                            ] }), children: projects.length === 0 ? (_jsx(Empty, { description: "\u6682\u65E0\u9879\u76EE" })) : (_jsx(Table, { dataSource: projects, columns: projectColumns, rowKey: "id", pagination: false, size: "small" })) }) }) })] }));
};
export default Dashboard;
