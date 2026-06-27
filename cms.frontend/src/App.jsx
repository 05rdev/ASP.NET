import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT CART CONTEXT PROVIDER (bao toàn bộ app)
import { CartProvider } from './context/CartContext';

// 2. IMPORT CÁC TRANG CHỨC NĂNG
import Home from './pages/home/index';
import Shop from './pages/shop/index';
import ProductDetail from './pages/product-detail';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog-detail/index';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';

// 3. IMPORT PHÂN HỆ TÀI KHOẢN KHÁCH HÀNG
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import About from './pages/about/index';
import Profile from './pages/profile/index';


function App() {
    return (
        // CartProvider bao bọc toàn bộ Router → mọi trang đều dùng được useCart()
        <CartProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100 bg-light">
                    <main className="flex-grow-1">
                        <Routes>
                            {/* Trang chủ */}
                            <Route path="/" element={<Home />} />

                            {/* Cửa hàng & Chi tiết sản phẩm */}
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetail />} />

                            {/* Blog & Chi tiết bài viết */}
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:id" element={<BlogDetail />} />

                            {/* Giỏ hàng & Thanh toán */}
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />

                            {/* Phân hệ tài khoản khách hàng */}
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />

                            {/* Giới thiệu */}
                            <Route path="/about" element={<About />} />


                            {/* 404 Not Found */}
                            <Route path="*" element={
                                <div className="container text-center py-5 my-5">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/580/580185.png"
                                        alt="404"
                                        className="mb-4"
                                        style={{ width: '100px', opacity: 0.6 }}
                                    />
                                    <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
                                    <p className="text-muted">Đường dẫn bạn truy cập không tồn tại trên hệ thống VanDinhCMS.</p>
                                    <a href="/" className="btn btn-dark btn-sm mt-2">Quay lại Trang Chủ</a>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
