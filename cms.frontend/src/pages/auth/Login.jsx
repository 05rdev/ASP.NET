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

    // States for Forgot Password Modal
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

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

    // Xử lý gửi yêu cầu quên mật khẩu
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');

        if (!forgotEmail.trim()) {
            setForgotError('Vui lòng nhập email');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
            setForgotError('Định dạng Email không hợp lệ');
            return;
        }

        setForgotLoading(true);
        try {
            const res = await authService.forgotPassword(forgotEmail.trim());
            setForgotSuccess(res.message || 'Mật khẩu mới đã được gửi về Email của bạn!');
            setForgotEmail('');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Không tìm thấy Email này trong hệ thống.';
            setForgotError(msg);
        } finally {
            setForgotLoading(false);
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
                                        <div className="d-flex justify-content-between mb-1">
                                            <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                                <i className="fas fa-lock mr-1 text-primary"></i> Mật khẩu <span className="text-danger">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowForgot(true);
                                                    setForgotError('');
                                                    setForgotSuccess('');
                                                    setForgotEmail('');
                                                }}
                                                className="btn btn-link p-0 text-decoration-none"
                                                style={{ fontSize: '13px', color: '#005088', fontWeight: 600, border: 'none', background: 'none' }}
                                            >
                                                Quên mật khẩu?
                                            </button>
                                        </div>
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

            {/* Custom Modal for Forgot Password with Glassmorphism / Sleek Backdrop */}
            {showForgot && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #005088 0%, #11CAA0 100%)',
                            padding: '24px',
                            color: '#fff',
                            position: 'relative'
                        }}>
                            <h5 className="modal-title font-weight-bold m-0" style={{ fontSize: '18px' }}>
                                <i className="fas fa-key mr-2"></i> Khôi phục mật khẩu
                            </h5>
                            <button
                                type="button"
                                onClick={() => setShowForgot(false)}
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '20px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    opacity: 0.8
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '24px' }}>
                            <p className="text-secondary mb-4" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                                Nhập Email đã đăng ký của bạn. Hệ thống sẽ tạo một mật khẩu mới ngẫu nhiên và gửi tới hộp thư của bạn.
                            </p>

                            {forgotSuccess && (
                                <div className="alert alert-success d-flex align-items-center mb-3" style={{ borderRadius: '10px', fontSize: '14px' }}>
                                    <i className="fas fa-check-circle mr-2"></i> {forgotSuccess}
                                </div>
                            )}

                            {forgotError && (
                                <div className="alert alert-danger d-flex align-items-center mb-3" style={{ borderRadius: '10px', fontSize: '14px' }}>
                                    <i className="fas fa-exclamation-circle mr-2"></i> {forgotError}
                                </div>
                            )}

                            <form onSubmit={handleForgotSubmit}>
                                <div className="mb-4">
                                    <label className="form-label font-weight-bold text-secondary small">EMAIL TÀI KHOẢN</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Nhập email của bạn..."
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        disabled={forgotLoading}
                                        style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        required
                                    />
                                </div>

                                <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgot(false)}
                                        className="btn btn-light"
                                        style={{ borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '14px' }}
                                        disabled={forgotLoading}
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={forgotLoading}
                                        style={{
                                            background: '#005088',
                                            borderColor: '#005088',
                                            borderRadius: '10px',
                                            padding: '10px 24px',
                                            fontWeight: 600,
                                            fontSize: '14px'
                                        }}
                                    >
                                        {forgotLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi mật khẩu mới'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            <Footer />
        </div>
    );
}

export default Login;
