// src/pages/cart/index.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Hàm định dạng tiền tệ chuẩn Việt Nam
const formatVND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

function Cart() {
    const navigate = useNavigate();
    const { cartItems, increaseQty, decreaseQty, removeFromCart, totalItems, totalAmount } = useCart();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f0f4f8', minHeight: '100vh' }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <Header />

            <div className="container py-5">
                {/* Tiêu đề trang */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#005088', fontSize: '28px' }}>
                            <i className="fas fa-shopping-bag mr-2"></i> Giỏ hàng của bạn
                        </h2>
                        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                            {totalItems > 0 ? `Có ${totalItems} sản phẩm trong giỏ hàng` : 'Giỏ hàng đang trống'}
                        </p>
                    </div>
                    <Link to="/shop" className="btn btn-outline-secondary btn-sm" style={{ borderRadius: '10px' }}>
                        <i className="fas fa-arrow-left mr-1"></i> Tiếp tục mua sắm
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    /* Trạng thái giỏ hàng rỗng */
                    <div className="text-center py-5">
                        <div style={{ fontSize: '80px', opacity: 0.2 }}>🛍️</div>
                        <h4 className="text-muted mt-3">Giỏ hàng của bạn đang trống</h4>
                        <p className="text-muted" style={{ fontSize: '14px' }}>Hãy khám phá cửa hàng và thêm sản phẩm bạn yêu thích!</p>
                        <Link to="/shop" className="btn mt-3" style={{
                            background: 'linear-gradient(135deg, #005088, #11CAA0)',
                            color: '#fff', borderRadius: '12px', padding: '12px 32px', fontWeight: 700
                        }}>
                            <i className="fas fa-store mr-2"></i> Đến Cửa Hàng
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        {/* Bảng giỏ hàng - cột trái */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-0">
                                    <table className="table table-borderless mb-0">
                                        <thead style={{ background: '#f8f9fa', borderRadius: '16px 16px 0 0' }}>
                                            <tr>
                                                <th className="py-3 pl-4" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>SẢN PHẨM</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>ĐƠN GIÁ</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>SỐ LƯỢNG</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>THÀNH TIỀN</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, index) => (
                                                <tr key={item.id} style={{
                                                    borderTop: index === 0 ? 'none' : '1px solid #f0f0f0',
                                                    transition: 'background 0.2s'
                                                }}>
                                                    {/* Hình + tên sản phẩm */}
                                                    <td className="py-3 pl-4">
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={item.imageUrl || 'https://via.placeholder.com/70'}
                                                                alt={item.name}
                                                                style={{
                                                                    width: '70px', height: '70px',
                                                                    objectFit: 'cover', borderRadius: '10px',
                                                                    marginRight: '14px', flexShrink: 0
                                                                }}
                                                            />
                                                            <div>
                                                                <p className="mb-0 fw-bold" style={{ fontSize: '14px', color: '#333' }}>{item.name}</p>
                                                                <small className="text-muted">ID: #{item.id}</small>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Đơn giá */}
                                                    <td className="py-3 text-center align-middle" style={{ fontSize: '14px', color: '#005088', fontWeight: 600 }}>
                                                        {formatVND(item.price)}
                                                    </td>

                                                    {/* Nút điều chỉnh số lượng */}
                                                    <td className="py-3 text-center align-middle">
                                                        <div className="d-inline-flex align-items-center" style={{
                                                            border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden'
                                                        }}>
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => decreaseQty(item.id)}
                                                                style={{ width: '34px', height: '34px', border: 'none', background: '#f8f9fa', fontWeight: 700, fontSize: '16px' }}
                                                                title="Giảm số lượng"
                                                            >−</button>
                                                            <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700, fontSize: '15px' }}>
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => increaseQty(item.id)}
                                                                style={{ width: '34px', height: '34px', border: 'none', background: '#f8f9fa', fontWeight: 700, fontSize: '16px', color: '#005088' }}
                                                                title="Tăng số lượng"
                                                            >+</button>
                                                        </div>
                                                    </td>

                                                    {/* Thành tiền */}
                                                    <td className="py-3 text-center align-middle fw-bold" style={{ fontSize: '15px', color: '#11CAA0' }}>
                                                        {formatVND(item.price * item.quantity)}
                                                    </td>

                                                    {/* Nút xóa */}
                                                    <td className="py-3 text-center align-middle pr-3">
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => removeFromCart(item.id)}
                                                            title="Xóa sản phẩm"
                                                            style={{
                                                                width: '34px', height: '34px', border: 'none',
                                                                background: '#fff0f0', color: '#dc3545',
                                                                borderRadius: '8px', fontSize: '14px'
                                                            }}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Tóm tắt đơn hàng - cột phải */}
                        <div className="col-lg-4 mt-4 mt-lg-0">
                            <div className="card border-0 shadow-sm sticky-top" style={{ borderRadius: '16px', top: '100px' }}>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4" style={{ color: '#005088' }}>
                                        <i className="fas fa-receipt mr-2"></i> Tóm tắt đơn hàng
                                    </h5>

                                    {/* Danh sách mini */}
                                    {cartItems.map(item => (
                                        <div key={item.id} className="d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
                                            <span className="text-muted text-truncate mr-2" style={{ maxWidth: '150px' }}>
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="text-dark fw-bold">{formatVND(item.price * item.quantity)}</span>
                                        </div>
                                    ))}

                                    <hr />

                                    {/* Tổng cộng */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="fw-bold" style={{ fontSize: '16px' }}>Tổng cộng:</span>
                                        <span className="fw-bold" style={{ fontSize: '20px', color: '#11CAA0' }}>
                                            {formatVND(totalAmount)}
                                        </span>
                                    </div>

                                    {/* Nút thanh toán */}
                                    <button
                                        className="btn w-100"
                                        onClick={() => navigate('/checkout')}
                                        style={{
                                            background: 'linear-gradient(135deg, #005088, #11CAA0)',
                                            color: '#fff', borderRadius: '12px',
                                            padding: '14px', fontWeight: 700, fontSize: '16px', border: 'none'
                                        }}
                                    >
                                        <i className="fas fa-credit-card mr-2"></i> Tiến hành thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
