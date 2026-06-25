import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import authService from '../services/authService';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const customer = authService.getCustomer();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert("Chức năng tìm kiếm nhanh trên Header sẽ kết nối API Search ở các buổi sau!");
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
        window.location.reload(); // Reload để cập nhật trạng thái header
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active font-weight-bold text-primary' : 'text-dark';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">

            {/* TẦNG 1: TOP BAR */}
            <div className="top-bar bg-dark py-2 text-white" style={{ fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Bên trái: Hotline & Email */}
                    <div className="top-bar-left">
                        <span className="mr-3">
                            <i className="fas fa-phone-alt mr-1"></i> Hotline: 090x.xxx.xxx
                        </span>
                        <span>
                            <i className="fas fa-envelope mr-1"></i> Email: support@vandinhcms.retail
                        </span>
                    </div>

                    {/* Bên phải: Trạng thái đăng nhập */}
                    <div className="top-bar-right d-flex align-items-center">
                        {customer ? (
                            // Đã đăng nhập → Hiển thị tên + nút đăng xuất
                            <>
                                <span className="text-white mr-3" style={{ fontSize: '13px' }}>
                                    <i className="fas fa-user-check mr-1" style={{ color: '#11CAA0' }}></i>
                                    Xin chào, <strong>{customer.fullName.split(' ').pop()}</strong>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-sm text-white"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '6px', fontSize: '12px', padding: '3px 10px'
                                    }}
                                >
                                    <i className="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                                </button>
                            </>
                        ) : (
                            // Chưa đăng nhập → Hiển thị link Đăng nhập / Đăng ký
                            <>
                                <Link to="/login" className="text-white mr-3 text-decoration-none transition-link">
                                    <i className="fas fa-user mr-1"></i> Đăng nhập
                                </Link>
                                <Link to="/register" className="text-white text-decoration-none transition-link">
                                    <i className="fas fa-user-plus mr-1"></i> Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* TẦNG 2: MAIN HEADER (Logo, Search, Giỏ hàng) */}
            <div className="main-header py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">

                        {/* Logo */}
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                                    V.DinhCMS<span style={{ color: '#11CAA0' }}>.GMGear</span>
                                </h3>
                            </Link>
                        </div>

                        {/* Ô tìm kiếm */}
                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm kiếm mẫu đầm dạ hội, sơ mi công sở..."
                                    style={{ borderRadius: '20px 0 0 20px', fontSize: '14px' }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary border-left-0 px-4"
                                        type="submit"
                                        style={{
                                            borderRadius: '0 20px 20px 0',
                                            backgroundColor: '#005088',
                                            borderColor: '#005088'
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Giỏ hàng với badge live từ CartContext */}
                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2" style={{ color: '#005088', fontSize: '22px' }}>
                                <i className="fas fa-shopping-bag"></i>
                                {/* Badge số lượng giỏ hàng - cập nhật tự động qua CartContext */}
                                <span
                                    id="cart-badge"
                                    className="badge badge-pill position-absolute"
                                    style={{
                                        top: '0', right: '0',
                                        backgroundColor: totalItems > 0 ? '#e74c3c' : '#11CAA0',
                                        color: '#fff', fontSize: '11px', padding: '4px 6px',
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    {totalItems}
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* TẦNG 3: NAVIGATION MENU */}
            <div className="main-navigation bg-white py-2">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <ul className="navbar-nav w-100">

                            <li className="nav-item mr-4">
                                <Link to="/" className={`nav-link p-0 text-decoration-none ${isActive('/')}`} style={{ transition: 'all 0.2s' }}>
                                    Trang Chủ
                                </Link>
                            </li>

                            <li className="nav-item mr-4">
                                <Link to="/shop" className={`nav-link p-0 text-decoration-none ${isActive('/shop')}`} style={{ transition: 'all 0.2s' }}>
                                    Cửa Hàng
                                </Link>
                            </li>

                            <li className="nav-item mr-4">
                                <Link to="/blog" className={`nav-link p-0 text-decoration-none ${isActive('/blog')}`} style={{ transition: 'all 0.2s' }}>
                                    Tin Tức / Blog
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/about" className={`nav-link p-0 text-decoration-none ${isActive('/about')}`} style={{ transition: 'all 0.2s' }}>
                                    Về Chúng Tôi
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>

        </header>
    );
}

export default Header;
