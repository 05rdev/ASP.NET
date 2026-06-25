import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import authService from '../services/authService';

const IMAGE_BASE_URL = "https://localhost:7125"; // đường dẫn bên Backend

function ProductCard({ item }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Hàm bổ trợ: Định dạng số thô thành chuỗi tiền tệ VNĐ (450.000 ₫)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    /**
     * Xử lý thêm sản phẩm vào giỏ hàng thông qua CartContext
     * Kiểm tra đăng nhập trước khi cho phép thêm vào giỏ
     */
    const handleAddToCart = () => {
        if (!authService.isLoggedIn()) {
            alert("Vui lòng đăng nhập tài khoản khách hàng để thêm sản phẩm vào giỏ!");
            navigate('/login');
            return;
        }

        const cartProduct = {
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: IMAGE_BASE_URL + (item.imageUrl || ''),
        };
        addToCart(cartProduct);
        
        // Thông báo bằng hộp thoại rõ ràng thay vì overlay trên hình ảnh
        alert(`🎉 Đã thêm sản phẩm "${item.name}" vào giỏ hàng thành công!`);
    };

    return (
        <div className="card h-100 shadow-sm border-0 product-card-hover" style={{ borderRadius: '12px', overflow: 'hidden', transition: '0.3s' }}>
            
            {/* Khối 1: Hình ảnh trang phục + Nhãn tồn kho */}
            <div className="position-relative overflow-hidden" style={{ height: '320px', backgroundColor: '#f8fafc' }}>
                <img 
                    src={IMAGE_BASE_URL + item.imageUrl}
                    className="card-img-top w-100 h-100" 
                    alt={item.name}
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
                
                {/* Thuật toán: Nếu tồn kho thấp (<= 5) thì đóng dấu cảnh báo */}
                {item.stockQuantity <= 5 && (
                    <span className="badge badge-danger position-absolute px-2 py-1" style={{ top: '15px', left: '15px', borderRadius: '4px', fontSize: '11px' }}>
                        Bán chạy / Còn {item.stockQuantity} chiếc
                    </span>
                )}
            </div>

            {/* Khối 2: Nội dung thông tin chi tiết trang phục */}
            <div className="card-body d-flex flex-column p-3">
                {/* Tên sản phẩm */}
                <h6 className="card-title font-weight-bold text-dark text-truncate mb-1" title={item.name} style={{ fontSize: '16px' }}>
                    {item.name}
                </h6>
                
                {/* Giá tiền sản phẩm */}
                <p className="card-text font-weight-bold text-danger mb-3" style={{ fontSize: '17px' }}>
                    {formatCurrency(item.price)}
                </p>

                {/* Cụm nút bấm tương tác đẩy sát đáy thẻ (mt-auto) */}
                <div className="mt-auto pt-2 border-top d-flex justify-content-between">
                    <Link 
                        to={`/product/${item.id}`} 
                        className="btn btn-sm btn-outline-primary font-weight-bold px-3 d-flex align-items-center justify-content-center" 
                        style={{ borderRadius: '20px', flexGrow: 1 }}
                    >
                        <i className="fas fa-eye mr-1"></i> Chi tiết
                    </Link>
                    <button 
                        className="btn btn-sm text-white font-weight-bold px-3 ml-2" 
                        style={{ borderRadius: '20px', backgroundColor: '#11CAA0', borderColor: '#11CAA0', flexGrow: 1 }}
                        onClick={handleAddToCart}
                    >
                        <i className="fas fa-cart-plus mr-1"></i> Mua ngay
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ProductCard;
