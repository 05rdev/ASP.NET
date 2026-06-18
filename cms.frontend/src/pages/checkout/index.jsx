// src/pages/checkout/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useCart } from '../../context/CartContext';
import axiosClient from '../../api/axiosClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Hàm định dạng tiền tệ chuẩn Việt Nam
const formatVND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

function Checkout() {
    const navigate = useNavigate();
    const { cartItems, totalAmount, clearCart } = useCart();

    const [customer, setCustomer] = useState(null);
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Bước bảo mật: Khi vào trang, kiểm tra đã đăng nhập chưa
    useEffect(() => {
        const savedCustomer = authService.getCustomer();
        if (!savedCustomer) {
            // Chưa đăng nhập → đá về trang login
            navigate('/login');
            return;
        }
        setCustomer(savedCustomer);
        // Auto-fill địa chỉ từ tài khoản customer
        setAddress(savedCustomer.address || '');
    }, [navigate]);

    // Nếu giỏ hàng rỗng, chuyển về shop
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/shop');
        }
    }, [cartItems, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng');
            return;
        }
        setError('');
        setLoading(true);

        try {
            // Đóng gói payload gửi lên Backend C#
            const payload = {
                customerId: customer.id,
                notes: `Giao hàng đến: ${address}${notes ? ' | Ghi chú: ' + notes : ''}`,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            await axiosClient.post('/Orders', payload);

            // Dọn sạch giỏ hàng về 0
            clearCart();
            // Thông báo và chuyển trang
            alert('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại V.DinhCMS.Fashion.');
            navigate('/');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return null; // Đang redirect, không render gì

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f0f4f8', minHeight: '100vh' }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <Header />

            <div className="container py-5">
                <h2 className="fw-bold mb-4" style={{ color: '#005088', fontSize: '28px' }}>
                    <i className="fas fa-clipboard-check mr-2"></i> Xác nhận thanh toán
                </h2>

                <div className="row">
                    {/* Form thông tin giao hàng */}
                    <div className="col-lg-7 mb-4">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#005088' }}>
                                    <i className="fas fa-map-marker-alt mr-2"></i> Thông tin giao hàng
                                </h5>

                                {error && (
                                    <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
                                        <i className="fas fa-exclamation-circle mr-2"></i> {error}
                                    </div>
                                )}

                                {/* Thông tin khách hàng - auto-fill */}
                                <div className="p-3 mb-4" style={{ background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bde0fc' }}>
                                    <div className="d-flex align-items-center mb-1">
                                        <i className="fas fa-user-circle mr-2" style={{ color: '#005088', fontSize: '18px' }}></i>
                                        <span className="fw-bold" style={{ fontSize: '15px', color: '#005088' }}>{customer.fullName}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#555', paddingLeft: '26px' }}>
                                        <span className="mr-3"><i className="fas fa-envelope mr-1"></i>{customer.email}</span>
                                        {customer.phone && <span><i className="fas fa-phone mr-1"></i>{customer.phone}</span>}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Địa chỉ giao hàng */}
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            Địa chỉ giao hàng <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        <small className="text-muted">Đã tự động điền từ tài khoản của bạn (có thể thay đổi)</small>
                                    </div>

                                    {/* Ghi chú thêm */}
                                    <div className="mb-4">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            Ghi chú thêm (tuỳ chọn)
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Giao giờ hành chính, để trước cửa, gọi trước khi giao..."
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px', resize: 'none' }}
                                        />
                                    </div>

                                    {/* Nút đặt hàng */}
                                    <button
                                        id="btn-place-order"
                                        type="submit"
                                        disabled={loading}
                                        className="btn w-100"
                                        style={{
                                            background: 'linear-gradient(135deg, #005088, #11CAA0)',
                                            color: '#fff', borderRadius: '12px',
                                            padding: '14px', fontWeight: 700, fontSize: '16px', border: 'none'
                                        }}
                                    >
                                        {loading
                                            ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang xử lý đơn hàng...</>
                                            : <><i className="fas fa-check-circle mr-2"></i>Xác nhận đặt hàng</>
                                        }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#005088' }}>
                                    <i className="fas fa-shopping-cart mr-2"></i> Đơn hàng của bạn ({cartItems.length} sản phẩm)
                                </h5>

                                {cartItems.map(item => (
                                    <div key={item.id} className="d-flex align-items-center mb-3">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/56'}
                                            alt={item.name}
                                            style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', marginRight: '12px', flexShrink: 0 }}
                                        />
                                        <div className="flex-grow-1">
                                            <p className="mb-0 fw-bold" style={{ fontSize: '13px', color: '#333' }}>{item.name}</p>
                                            <small className="text-muted">SL: {item.quantity} × {formatVND(item.price)}</small>
                                        </div>
                                        <span className="fw-bold" style={{ fontSize: '14px', color: '#11CAA0' }}>
                                            {formatVND(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}

                                <hr />

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>Tổng thanh toán:</span>
                                    <span className="fw-bold" style={{ fontSize: '22px', color: '#11CAA0' }}>
                                        {formatVND(totalAmount)}
                                    </span>
                                </div>

                                <div className="mt-3 p-3" style={{ background: '#f8fff8', borderRadius: '10px', border: '1px solid #d4edda' }}>
                                    <small className="text-success">
                                        <i className="fas fa-shield-alt mr-1"></i>
                                        Thanh toán khi nhận hàng (COD) - An toàn & tiện lợi
                                    </small>
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

export default Checkout;
