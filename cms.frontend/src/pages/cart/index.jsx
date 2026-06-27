// src/pages/cart/index.jsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Hàm định dạng tiền tệ chuẩn Việt Nam
const formatVND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

function Cart() {
    const navigate = useNavigate();
    const { cartItems, increaseQty, decreaseQty, removeFromCart, totalItems } = useCart();

    // State quản lý danh sách sản phẩm được tích chọn thanh toán
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Toggle chọn/bỏ chọn 1 sản phẩm
    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Chọn tất cả / Bỏ chọn tất cả
    const toggleSelectAll = () => {
        if (selectedIds.size === cartItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(cartItems.map(item => item.id)));
        }
    };

    const isAllSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;

    // Tính toán chỉ các sản phẩm đã chọn
    const selectedItems = useMemo(() =>
        cartItems.filter(item => selectedIds.has(item.id)),
        [cartItems, selectedIds]
    );

    const selectedTotal = useMemo(() =>
        selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [selectedItems]
    );

    const selectedQty = useMemo(() =>
        selectedItems.reduce((sum, item) => sum + item.quantity, 0),
        [selectedItems]
    );

    // Chuyển sang trang checkout với danh sách sản phẩm đã chọn
    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
            return;
        }

        // Kiểm tra xem có sản phẩm nào vượt quá tồn kho không
        const invalidItems = selectedItems.filter(item => item.stockQuantity !== undefined && item.stockQuantity !== null && item.quantity > item.stockQuantity);
        if (invalidItems.length > 0) {
            alert(`Không thể thanh toán do sản phẩm sau vượt quá số lượng trong kho: ${invalidItems.map(i => i.name).join(', ')}. Vui lòng điều chỉnh lại số lượng.`);
            return;
        }

        // Truyền danh sách ID sản phẩm đã chọn qua navigation state
        navigate('/checkout', { state: { selectedIds: Array.from(selectedIds) } });
    };

    return (
        <div className="cart-page-wrapper" style={{ background: '#f0f4f8', minHeight: '100vh' }}>
            <Header />

            {/* Banner breadcrumb đồng bộ với các trang khác */}
            <div className="bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Giỏ Hàng</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>GIỎ HÀNG CỦA BẠN</h2>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                        {totalItems > 0 ? `Có ${totalItems} sản phẩm trong giỏ hàng` : 'Giỏ hàng đang trống'}
                    </p>
                </div>
            </div>

            <div className="container pb-5">
                {/* Nút tiếp tục mua sắm */}
                <div className="d-flex justify-content-end mb-3">
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
                                                {/* Checkbox chọn tất cả */}
                                                <th className="py-3 pl-3 text-center" style={{ width: '45px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllSelected}
                                                        onChange={toggleSelectAll}
                                                        title="Chọn tất cả"
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#005088' }}
                                                    />
                                                </th>
                                                <th className="py-3" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>SẢN PHẨM</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>ĐƠN GIÁ</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>SỐ LƯỢNG</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>THÀNH TIỀN</th>
                                                <th className="py-3 text-center" style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, index) => {
                                                const isSelected = selectedIds.has(item.id);
                                                return (
                                                    <tr key={item.id} style={{
                                                        borderTop: index === 0 ? 'none' : '1px solid #f0f0f0',
                                                        transition: 'background 0.2s',
                                                        background: isSelected ? '#f0f9ff' : 'transparent'
                                                    }}>
                                                        {/* Checkbox chọn sản phẩm */}
                                                        <td className="py-3 pl-3 text-center align-middle">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelect(item.id)}
                                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#005088' }}
                                                            />
                                                        </td>

                                                        {/* Hình + tên sản phẩm */}
                                                        <td className="py-3">
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
                                                                    disabled={item.stockQuantity !== undefined && item.stockQuantity !== null && item.quantity >= item.stockQuantity}
                                                                    style={{
                                                                        width: '34px',
                                                                        height: '34px',
                                                                        border: 'none',
                                                                        background: '#f8f9fa',
                                                                        fontWeight: 700,
                                                                        fontSize: '16px',
                                                                        color: (item.stockQuantity !== undefined && item.stockQuantity !== null && item.quantity >= item.stockQuantity) ? '#ccc' : '#005088',
                                                                        cursor: (item.stockQuantity !== undefined && item.stockQuantity !== null && item.quantity >= item.stockQuantity) ? 'not-allowed' : 'pointer'
                                                                    }}
                                                                    title="Tăng số lượng"
                                                                >+</button>
                                                            </div>
                                                            {item.stockQuantity !== undefined && item.stockQuantity !== null && item.quantity >= item.stockQuantity && (
                                                                <div className="text-danger mt-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                                                                    Tối đa: {item.stockQuantity} sp
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* Thành tiền */}
                                                        <td className="py-3 text-center align-middle fw-bold" style={{ fontSize: '15px', color: '#11CAA0' }}>
                                                            {formatVND(item.price * item.quantity)}
                                                        </td>

                                                        {/* Nút xóa */}
                                                        <td className="py-3 text-center align-middle pr-3">
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => {
                                                                    removeFromCart(item.id);
                                                                    // Xóa khỏi danh sách chọn nếu có
                                                                    setSelectedIds(prev => {
                                                                        const next = new Set(prev);
                                                                        next.delete(item.id);
                                                                        return next;
                                                                    });
                                                                }}
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
                                                );
                                            })}
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

                                    {/* Thông báo nếu chưa chọn sản phẩm */}
                                    {selectedItems.length === 0 ? (
                                        <div className="text-center py-3">
                                            <i className="fas fa-hand-pointer" style={{ fontSize: '28px', color: '#ccc' }}></i>
                                            <p className="text-muted mt-2 mb-0" style={{ fontSize: '13px' }}>
                                                Tích chọn sản phẩm muốn thanh toán
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Danh sách sản phẩm đã chọn */}
                                            {selectedItems.map(item => (
                                                <div key={item.id} className="d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
                                                    <span className="text-muted text-truncate mr-2" style={{ maxWidth: '150px' }}>
                                                        {item.name} × {item.quantity}
                                                    </span>
                                                    <span className="text-dark fw-bold">{formatVND(item.price * item.quantity)}</span>
                                                </div>
                                            ))}

                                            <hr />

                                            {/* Số lượng đã chọn */}
                                            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '13px' }}>
                                                <span className="text-muted">Sản phẩm đã chọn:</span>
                                                <span className="fw-bold" style={{ color: '#005088' }}>{selectedItems.length} sản phẩm ({selectedQty} chiếc)</span>
                                            </div>
                                        </>
                                    )}

                                    {/* Tổng cộng */}
                                    <div className="d-flex justify-content-between align-items-center mb-4 mt-2" style={{
                                        padding: '12px', background: '#f8f9fa', borderRadius: '10px'
                                    }}>
                                        <span className="fw-bold" style={{ fontSize: '16px' }}>Tổng cộng:</span>
                                        <span className="fw-bold" style={{ fontSize: '20px', color: '#11CAA0' }}>
                                            {formatVND(selectedTotal)}
                                        </span>
                                    </div>

                                    {/* Nút thanh toán */}
                                    <button
                                        className="btn w-100"
                                        onClick={handleCheckout}
                                        disabled={selectedItems.length === 0}
                                        style={{
                                            background: selectedItems.length > 0
                                                ? 'linear-gradient(135deg, #005088, #11CAA0)'
                                                : '#ccc',
                                            color: '#fff', borderRadius: '12px',
                                            padding: '14px', fontWeight: 700, fontSize: '16px', border: 'none',
                                            cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <i className="fas fa-credit-card mr-2"></i>
                                        {selectedItems.length > 0
                                            ? `Thanh toán ${selectedItems.length} sản phẩm`
                                            : 'Chọn sản phẩm để thanh toán'
                                        }
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
