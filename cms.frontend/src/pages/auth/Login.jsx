// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Hiển thị thông báo chuyển từ trang Register sang
    useEffect(() => {
        if (location.state?.successMsg) {
            setSuccessMsg(location.state.successMsg);
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Định dạng Email không hợp lệ';
        }
        if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setSuccessMsg('');
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const data = await authService.login({
                email: formData.email,
                password: formData.password
            });
            // Lưu thông tin Customer vào localStorage
            authService.saveCustomer(data);
            // Chuyển về trang chủ dưới trạng thái đã đăng nhập
            navigate('/');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Email hoặc mật khẩu không đúng.';
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper" style={{ background: '#f0f4f8', minHeight: '100vh' }}>
            <Header />

            {/* Banner breadcrumb đồng bộ với các trang khác */}
            <div className="bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Đăng Nhập</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>ĐĂNG NHẬP</h2>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            {/* Header card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #005088 0%, #11CAA0 100%)',
                                padding: '36px 40px 28px'
                            }}>
                                <h2 className="text-white fw-bold mb-1" style={{ fontSize: '26px', letterSpacing: '-0.5px' }}>
                                    <i className="fas fa-sign-in-alt mr-2"></i> Đăng nhập
                                </h2>
                                <p className="text-white mb-0" style={{ opacity: 0.85, fontSize: '14px' }}>
                                    Chào mừng trở lại V.DinhCMS.GMGear!
                                </p>
                            </div>

                            {/* Body */}
                            <div className="card-body p-4 p-md-5">
                                {successMsg && (
                                    <div className="alert alert-success d-flex align-items-center mb-4" style={{ borderRadius: '10px' }}>
                                        <i className="fas fa-check-circle mr-2"></i> {successMsg}
                                    </div>
                                )}
                                {serverError && (
                                    <div className="alert alert-danger d-flex align-items-center mb-4" style={{ borderRadius: '10px' }}>
                                        <i className="fas fa-exclamation-circle mr-2"></i> {serverError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Email */}
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-envelope mr-1 text-primary"></i> Email <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            id="login-email"
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

                                    {/* Mật khẩu */}
                                    <div className="mb-4">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-lock mr-1 text-primary"></i> Mật khẩu <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            id="login-password"
                                            type="password"
                                            name="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Nhập mật khẩu..."
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    {/* Nút submit */}
                                    <button
                                        id="btn-login-submit"
                                        type="submit"
                                        disabled={loading}
                                        className="btn w-100"
                                        style={{
                                            background: 'linear-gradient(135deg, #005088, #11CAA0)',
                                            color: '#fff',
                                            borderRadius: '12px',
                                            padding: '14px',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            border: 'none'
                                        }}
                                    >
                                        {loading
                                            ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang xác thực...</>
                                            : <><i className="fas fa-sign-in-alt mr-2"></i>Đăng nhập</>
                                        }
                                    </button>
                                </form>

                                {/* Link đăng ký */}
                                <div className="text-center mt-4" style={{ fontSize: '14px', color: '#666' }}>
                                    Chưa có tài khoản?{' '}
                                    <Link to="/register" style={{ color: '#005088', fontWeight: 600, textDecoration: 'none' }}>
                                        Đăng ký miễn phí
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

export default Login;
