// src/pages/checkout/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useCart } from '../../context/CartContext';
import axiosClient from '../../api/axiosClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Hàm định dạng tiền tệ chuẩn Việt Nam
const formatVND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Danh sách phương thức thanh toán có sẵn
const PAYMENT_METHODS = [
    {
        id: 'cod',
        name: 'Thanh toán khi nhận hàng (COD)',
        icon: 'fas fa-money-bill-wave',
        color: '#28a745',
        desc: 'Trả tiền mặt cho shipper khi nhận hàng'
    },
    {
        id: 'bank',
        name: 'Chuyển khoản ngân hàng',
        icon: 'fas fa-university',
        color: '#005088',
        desc: 'Chuyển khoản qua tài khoản ngân hàng nội địa'
    },
    {
        id: 'momo',
        name: 'Ví MoMo',
        icon: 'fas fa-wallet',
        color: '#a50064',
        desc: 'Thanh toán qua ví điện tử MoMo'
    },
    {
        id: 'zalopay',
        name: 'ZaloPay',
        icon: 'fas fa-mobile-alt',
        color: '#0068ff',
        desc: 'Thanh toán qua ví điện tử ZaloPay'
    }
];

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart, removeFromCart } = useCart();

    const [customer, setCustomer] = useState(null);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Lấy danh sách ID sản phẩm đã chọn từ Cart page (qua navigation state)
    const selectedIds = useMemo(() => {
        const ids = location.state?.selectedIds;
        return ids ? new Set(ids) : null;
    }, [location.state]);

    // Lọc chỉ lấy sản phẩm đã được tích chọn
    const checkoutItems = useMemo(() => {
        if (!selectedIds) return cartItems; // Fallback: nếu vào thẳng URL thì lấy tất cả
        return cartItems.filter(item => selectedIds.has(item.id));
    }, [cartItems, selectedIds]);

    const checkoutTotal = useMemo(() =>
        checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [checkoutItems]
    );

    // Bước bảo mật: Khi vào trang, kiểm tra đã đăng nhập chưa
    useEffect(() => {
        const savedCustomer = authService.getCustomer();
        if (!savedCustomer) {
            // Chưa đăng nhập → đá về trang login
            navigate('/login');
            return;
        }
        setCustomer(savedCustomer);
        // Auto-fill từ tài khoản customer
        setAddress(savedCustomer.address || '');
        setPhone(savedCustomer.phone || '');
    }, [navigate]);

    // Nếu không có sản phẩm nào để thanh toán, chuyển về giỏ hàng
    useEffect(() => {
        if (checkoutItems.length === 0 && customer) {
            navigate('/cart');
        }
    }, [checkoutItems, navigate, customer]);

    // Validate số điện thoại Việt Nam (chấp nhận cả số phụ/số test bắt đầu bằng 01)
    const isValidPhone = (p) => /^(0|\+84)[0-9]{9,10}$/.test(p.replace(/\s/g, ''));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate bắt buộc
        if (!phone.trim()) {
            setError('Vui lòng nhập số điện thoại liên hệ');
            return;
        }
        if (!isValidPhone(phone)) {
            setError('Số điện thoại không hợp lệ (VD: 0901234567)');
            return;
        }
        if (!address.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Tìm tên phương thức thanh toán
            const methodName = PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || 'COD';

            // Đóng gói payload gửi lên Backend C#
            const payload = {
                customerId: customer.id,
                notes: `SĐT: ${phone} | Địa chỉ: ${address} | Thanh toán: ${methodName}${notes ? ' | Ghi chú: ' + notes : ''}`,
                items: checkoutItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            await axiosClient.post('/Orders', payload);

            // Chỉ xóa những sản phẩm đã thanh toán khỏi giỏ hàng (giữ lại sản phẩm chưa chọn)
            if (selectedIds && selectedIds.size < cartItems.length) {
                checkoutItems.forEach(item => removeFromCart(item.id));
            } else {
                clearCart();
            }

            // Thông báo và chuyển trang
            alert('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại V.DinhCMS.GMGear.');
            navigate('/');
        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            const msg = err?.response?.data?.message || err?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
            setError(msg);
            alert(`❌ Đặt hàng thất bại: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return null; // Đang redirect, không render gì

    return (
        <div className="checkout-page-wrapper" style={{ background: '#f0f4f8', minHeight: '100vh' }}>
            <Header />

            {/* Banner breadcrumb đồng bộ với các trang khác */}
            <div className="bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item"><Link to="/cart" className="text-decoration-none text-secondary">Giỏ Hàng</Link></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Thanh Toán</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>XÁC NHẬN THANH TOÁN</h2>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                        Thanh toán {checkoutItems.length} sản phẩm đã chọn
                    </p>
                </div>
            </div>

            <div className="container pb-5">

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
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Số điện thoại - có thể thay đổi */}
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-phone-alt mr-1" style={{ color: '#005088' }}></i>
                                            Số điện thoại liên hệ <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="VD: 0901234567"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            style={{ borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }}
                                        />
                                        <small className="text-muted">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            Số điện thoại để shipper liên hệ giao hàng (có thể thay đổi khác với tài khoản)
                                        </small>
                                    </div>

                                    {/* Địa chỉ giao hàng */}
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-map-marker-alt mr-1" style={{ color: '#005088' }}></i>
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
                                            <i className="fas fa-sticky-note mr-1" style={{ color: '#005088' }}></i>
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

                                    {/* ══════════════ PHƯƠNG THỨC THANH TOÁN ══════════════ */}
                                    <div className="mb-4">
                                        <label className="form-label" style={{ fontSize: '14px', fontWeight: 600 }}>
                                            <i className="fas fa-credit-card mr-1" style={{ color: '#005088' }}></i>
                                            Phương thức thanh toán <span className="text-danger">*</span>
                                        </label>
                                        <div className="row g-2">
                                            {PAYMENT_METHODS.map(method => (
                                                <div className="col-12" key={method.id}>
                                                    <div
                                                        onClick={() => setPaymentMethod(method.id)}
                                                        className="d-flex align-items-center p-3"
                                                        style={{
                                                            borderRadius: '12px',
                                                            border: paymentMethod === method.id
                                                                ? `2px solid ${method.color}`
                                                                : '2px solid #e9ecef',
                                                            background: paymentMethod === method.id
                                                                ? `${method.color}08`
                                                                : '#fff',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            marginBottom: '8px'
                                                        }}
                                                    >
                                                        {/* Radio indicator */}
                                                        <div style={{
                                                            width: '22px', height: '22px', borderRadius: '50%',
                                                            border: paymentMethod === method.id
                                                                ? `6px solid ${method.color}`
                                                                : '2px solid #ccc',
                                                            marginRight: '14px', flexShrink: 0,
                                                            transition: 'all 0.2s'
                                                        }} />

                                                        {/* Icon */}
                                                        <div className="d-flex align-items-center justify-content-center" style={{
                                                            width: '40px', height: '40px', borderRadius: '10px',
                                                            background: `${method.color}15`, marginRight: '14px', flexShrink: 0
                                                        }}>
                                                            <i className={method.icon} style={{ color: method.color, fontSize: '16px' }}></i>
                                                        </div>

                                                        {/* Nội dung */}
                                                        <div>
                                                            <p className="mb-0 fw-bold" style={{
                                                                fontSize: '14px',
                                                                color: paymentMethod === method.id ? method.color : '#333'
                                                            }}>
                                                                {method.name}
                                                            </p>
                                                            <small className="text-muted" style={{ fontSize: '12px' }}>{method.desc}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                    <i className="fas fa-shopping-cart mr-2"></i> Đơn hàng của bạn ({checkoutItems.length} sản phẩm)
                                </h5>

                                {checkoutItems.map(item => (
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

                                {/* Thông tin tóm tắt thanh toán */}
                                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
                                    <span className="text-muted">Tạm tính:</span>
                                    <span className="fw-bold">{formatVND(checkoutTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="fw-bold text-success">Miễn phí</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
                                    <span className="text-muted">Thanh toán:</span>
                                    <span className="fw-bold" style={{ color: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.color }}>
                                        {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}
                                    </span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>Tổng thanh toán:</span>
                                    <span className="fw-bold" style={{ fontSize: '22px', color: '#11CAA0' }}>
                                        {formatVND(checkoutTotal)}
                                    </span>
                                </div>

                                {/* Badge phương thức thanh toán */}
                                <div className="mt-3 p-3" style={{
                                    background: `${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.color}10`,
                                    borderRadius: '10px',
                                    border: `1px solid ${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.color}30`
                                }}>
                                    <small style={{ color: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.color }}>
                                        <i className={`${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon} mr-1`}></i>
                                        {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.desc}
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
