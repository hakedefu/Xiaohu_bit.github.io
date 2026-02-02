import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Space, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { registerSuccess } from '../store/slices/authSlice';
import { authApi } from '../services/api';
import './Auth.css';
const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleRegister = async (values) => {
        try {
            setLoading(true);
            const response = await authApi.register(values.email, values.username, values.password, values.fullName);
            const { data: result } = response.data;
            dispatch(registerSuccess({
                token: result.token,
                user: result.user,
            }));
            message.success('注册成功');
            navigate('/dashboard');
        }
        catch (error) {
            const errorMessage = error.response?.data?.error || '注册失败，请重试';
            message.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs(Card, { className: "auth-card", children: [_jsxs("div", { className: "auth-header", children: [_jsx("h1", { children: "\u521B\u5EFA\u8D26\u6237" }), _jsx("p", { children: "\u6CE8\u518C\u5BA2\u6237\u7BA1\u7406\u7CFB\u7EDF" })] }), _jsx(Spin, { spinning: loading, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleRegister, className: "auth-form", children: [_jsx(Form.Item, { name: "email", label: "\u90AE\u7BB1", rules: [
                                    { required: true, message: '请输入邮箱' },
                                    { type: 'email', message: '请输入有效的邮箱' },
                                ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1", size: "large" }) }), _jsx(Form.Item, { name: "username", label: "\u7528\u6237\u540D", rules: [
                                    { required: true, message: '请输入用户名' },
                                    { min: 3, message: '用户名至少 3 个字符' },
                                ], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D", size: "large" }) }), _jsx(Form.Item, { name: "fullName", label: "\u5B8C\u6574\u540D\u79F0", rules: [{ required: true, message: '请输入完整名称' }], children: _jsx(Input, { placeholder: "\u8BF7\u8F93\u5165\u5B8C\u6574\u540D\u79F0", size: "large" }) }), _jsx(Form.Item, { name: "password", label: "\u5BC6\u7801", rules: [
                                    { required: true, message: '请输入密码' },
                                    { min: 6, message: '密码至少 6 个字符' },
                                ], children: _jsx(Input, { prefix: _jsx(LockOutlined, {}), type: "password", placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801", size: "large" }) }), _jsx(Form.Item, { name: "confirmPassword", label: "\u786E\u8BA4\u5BC6\u7801", dependencies: ['password'], rules: [
                                    { required: true, message: '请确认密码' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('密码不一致'));
                                        },
                                    }),
                                ], children: _jsx(Input, { prefix: _jsx(LockOutlined, {}), type: "password", placeholder: "\u8BF7\u518D\u6B21\u8F93\u5165\u5BC6\u7801", size: "large" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, size: "large", loading: loading, children: "\u6CE8\u518C" }) })] }) }), _jsx("div", { className: "auth-footer", children: _jsxs(Space, { children: [_jsx("span", { children: "\u5DF2\u6709\u8D26\u6237\uFF1F" }), _jsx(Link, { to: "/login", children: "\u7ACB\u5373\u767B\u5F55" })] }) })] }) }));
};
export default Register;
