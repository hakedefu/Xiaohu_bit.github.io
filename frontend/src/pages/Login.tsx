import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Space, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authApi } from '../services/api';
import './Auth.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormData) => {
    try {
      dispatch(loginStart());
      setLoading(true);

      const response = await authApi.login(values.email, values.password);
      const { data: result } = response.data;

      dispatch(
        loginSuccess({
          token: result.token,
          user: result.user,
        })
      );

      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '登录失败，请重试';
      dispatch(loginFailure(errorMessage));
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1>客户管理系统</h1>
          <p>Customer CRM</p>
        </div>

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
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
                prefix={<UserOutlined />}
                placeholder="请输入邮箱"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="请输入密码"
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
                登录
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div className="auth-footer">
          <Space>
            <span>没有账户？</span>
            <Link to="/register">立即注册</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;
