import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Space, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { registerSuccess } from '../store/slices/authSlice';
import { authApi } from '../services/api';
import './Auth.css';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: RegisterFormData) => {
    try {
      setLoading(true);

      const response = await authApi.register(
        values.email,
        values.username,
        values.password,
        values.fullName
      );

      const { data: result } = response.data;

      dispatch(
        registerSuccess({
          token: result.token,
          user: result.user,
        })
      );

      message.success('注册成功');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '注册失败，请重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1>创建账户</h1>
          <p>注册客户管理系统</p>
        </div>

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            className="auth-form"
          >
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少 3 个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="fullName"
              label="完整名称"
              rules={[{ required: true, message: '请输入完整名称' }]}
            >
              <Input
                placeholder="请输入完整名称"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少 6 个字符' },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="请输入密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('密码不一致'));
                  },
                }),
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="请再次输入密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div className="auth-footer">
          <Space>
            <span>已有账户？</span>
            <Link to="/login">立即登录</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Register;
