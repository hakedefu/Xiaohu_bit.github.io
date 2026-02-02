import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Space, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authApi } from '../services/api';
import './Auth.css';
const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleLogin = async (values) => {
        try {
            dispatch(loginStart());
            setLoading(true);
            const response = await authApi.login(values.email, values.password);
            const { data: result } = response.data;
            dispatch(loginSuccess({
                token: result.token,
                user: result.user,
            }));
            message.success('登录成功');
            navigate('/dashboard');
        }
        catch (error) {
            const errorMessage = error.response?.data?.error || '登录失败，请重试';
            dispatch(loginFailure(errorMessage));
            message.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs(Card, { className: "auth-card", children: [_jsxs("div", { className: "auth-header", children: [_jsx("h1", { children: "\u5BA2\u6237\u7BA1\u7406\u7CFB\u7EDF" }), _jsx("p", { children: "Customer CRM" })] }), _jsx(Spin, { spinning: loading, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleLogin, className: "auth-form", children: [_jsx(Form.Item, { name: "email", label: "\u90AE\u7BB1", rules: [
                                    { required: true, message: '请输入邮箱' },
                                    { type: 'email', message: '请输入有效的邮箱' },
                                ], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1", size: "large" }) }), _jsx(Form.Item, { name: "password", label: "\u5BC6\u7801", rules: [{ required: true, message: '请输入密码' }], children: _jsx(Input, { prefix: _jsx(LockOutlined, {}), type: "password", placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801", size: "large" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, size: "large", loading: loading, children: "\u767B\u5F55" }) })] }) }), _jsx("div", { className: "auth-footer", children: _jsxs(Space, { children: [_jsx("span", { children: "\u6CA1\u6709\u8D26\u6237\uFF1F" }), _jsx(Link, { to: "/register", children: "\u7ACB\u5373\u6CE8\u518C" })] }) })] }) }));
};
export default Login;
