// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Xóa lỗi khi người dùng bắt đầu gõ lại
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate phía client trước khi gửi API
    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Định dạng Email không hợp lệ';
        }
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            await authService.register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                password: formData.password
            });
            // Đăng ký thành công → chuyển sang trang Login
            navigate('/login', { state: { successMsg: 'Đăng ký thành công! Hãy đăng nhập để tiếp tục.' } });
        } catch (err) {
            const msg = err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f0f4f8', minHeight: '100vh' }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <Header />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-6">
                        {/* Card đăng ký */}
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            {/* Header card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #005088 0%, #11CAA0 100%)',
                                padding: '36px 40px 28px'
                            }}>
                                <h2 className="text-white fw-bold mb-1" style={{ fontSize: '26px', letterSpacing: '-0.5px' }}>
                                    <i className="fas fa-user-plus mr-2"></i> Tạo tài khoản mới
                                </h2>
                                <p className="text-white mb-0" style={{ opacity: 0.85, fontSize: '14px' }}>
                                    Mua sắm thời trang V.DinhCMS nhanh hơn với tài khoản cá nhân
                                </p>
                            </div>

                            {/* Body form */}
                            <div className="card-body p-4 p-md-5">
                                {serverError && (
                                    <div className="alert alert-danger d-flex align-items-center mb-4" style={{ borderRadius: '10px' }}>
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {serverError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Họ tên */}
                                    <div className="mb-3">
                                        <label className="form-label fw-600 text-dark" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-user mr-1 text-primary"></i> Họ và tên <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                            placeholder="Nhập họ và tên đầy đủ..."
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-envelope mr-1 text-primary"></i> Email <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    {/* SĐT & Địa chỉ */}
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                                <i className="fas fa-phone mr-1 text-primary"></i> Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                placeholder="09xxxxxxxx"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                                <i className="fas fa-map-marker-alt mr-1 text-primary"></i> Địa chỉ
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                className="form-control"
                                                placeholder="Số nhà, đường, phường..."
                                                value={formData.address}
                                                onChange={handleChange}
                                                style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Mật khẩu */}
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-lock mr-1 text-primary"></i> Mật khẩu <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Ít nhất 6 ký tự..."
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    {/* Xác nhận mật khẩu */}
                                    <div className="mb-4">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-lock mr-1 text-primary"></i> Xác nhận mật khẩu <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            placeholder="Nhập lại mật khẩu..."
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                    </div>

                                    {/* Nút submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-block w-100"
                                        style={{
                                            background: 'linear-gradient(135deg, #005088, #11CAA0)',
                                            color: '#fff',
                                            borderRadius: '12px',
                                            padding: '14px',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            border: 'none',
                                            transition: 'opacity 0.2s'
                                        }}
                                    >
                                        {loading
                                            ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...</>
                                            : <><i className="fas fa-user-plus mr-2"></i>Tạo tài khoản</>
                                        }
                                    </button>
                                </form>

                                {/* Link đăng nhập */}
                                <div className="text-center mt-4" style={{ fontSize: '14px', color: '#666' }}>
                                    Đã có tài khoản?{' '}
                                    <Link to="/login" style={{ color: '#005088', fontWeight: 600, textDecoration: 'none' }}>
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
