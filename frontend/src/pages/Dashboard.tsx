import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Space, Tag, Button, Empty, Spin, Segmented } from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { projectApi } from '../services/api';
import { Project, ProjectStatus, Priority } from '../types';
import './Dashboard.css';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  overdueProjects: number;
  dueSoonProjects: number;
}

interface ViewMode {
  projects: 'list' | 'stats';
  quadrant: 'view' | 'hide';
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>({ projects: 'list', quadrant: 'hide' });

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
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    const colors: Record<Priority, string> = {
      [Priority.LOW]: 'blue',
      [Priority.MEDIUM]: 'cyan',
      [Priority.HIGH]: 'orange',
      [Priority.URGENT]: 'red',
    };
    return colors[priority];
  };

  const getStatusColor = (status: ProjectStatus): string => {
    const colors: Record<ProjectStatus, string> = {
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

  const getTimeWarning = (dueDate: string): React.ReactNode => {
    const days = dayjs(dueDate).diff(dayjs(), 'day');

    if (days < 0) {
      return <Tag icon={<ExclamationCircleOutlined />} color="red">逾期</Tag>;
    } else if (days <= 3) {
      return <Tag icon={<ClockCircleOutlined />} color="orange">紧急</Tag>;
    } else if (days <= 7) {
      return <Tag icon={<ClockCircleOutlined />} color="gold">即将到期</Tag>;
    }

    return <Tag icon={<CheckCircleOutlined />} color="green">充足</Tag>;
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
      render: (_: any, record: Project) => record.customer?.name || '-',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: Priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate: string) => {
        const date = dayjs(dueDate);
        return (
          <Space>
            <span>{date.format('YYYY-MM-DD')}</span>
            {getTimeWarning(dueDate)}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Project) => (
        <Button type="link" size="small" onClick={() => console.log(record.id)}>
          详情
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }} />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>仪表板</h1>
        <p>欢迎回来！这是您的项目和任务概览。</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总项目数"
              value={stats?.totalProjects || 0}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1f2937' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="已完成"
              value={stats?.completedProjects || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="逾期项目"
              value={stats?.overdueProjects || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="即将到期"
              value={stats?.dueSoonProjects || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 项目列表 */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="最近项目"
            extra={
              <Segmented
                value={viewMode.projects}
                onChange={(value) =>
                  setViewMode({ ...viewMode, projects: value as any })
                }
                options={[
                  { label: '列表视图', value: 'list' },
                  { label: '统计视图', value: 'stats' },
                ]}
              />
            }
          >
            {projects.length === 0 ? (
              <Empty description="暂无项目" />
            ) : (
              <Table
                dataSource={projects}
                columns={projectColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
