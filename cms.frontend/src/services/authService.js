// src/services/authService.js
import axiosClient from '../api/axiosClient';

const authService = {
    /**
     * POST /api/Auth/register
     * Đăng ký tài khoản khách hàng mới
     */
    register: async (data) => {
        return await axiosClient.post('/Auth/register', data);
    },

    /**
     * POST /api/Auth/login
     * Đăng nhập và nhận thông tin khách hàng
     */
    login: async (data) => {
        return await axiosClient.post('/Auth/login', data);
    },

    /**
     * Lưu thông tin customer vào localStorage sau khi đăng nhập
     */
    saveCustomer: (customerData) => {
        localStorage.setItem('customer', JSON.stringify(customerData));
    },

    /**
     * Lấy thông tin customer từ localStorage
     */
    getCustomer: () => {
        const data = localStorage.getItem('customer');
        return data ? JSON.parse(data) : null;
    },

    /**
     * Xóa thông tin customer (đăng xuất)
     */
    logout: () => {
        localStorage.removeItem('customer');
    },

    /**
     * Kiểm tra đã đăng nhập chưa
     */
    isLoggedIn: () => {
        return localStorage.getItem('customer') !== null;
    }
};

export default authService;
