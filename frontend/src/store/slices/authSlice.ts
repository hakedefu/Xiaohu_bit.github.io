import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 登录开始
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // 登录成功
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;

      // 保存到 localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // 登录失败
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // 注册成功
    registerSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // 登出
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // 更新用户信息
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    // 恢复会话
    restoreSession: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  logout,
  updateUser,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;
