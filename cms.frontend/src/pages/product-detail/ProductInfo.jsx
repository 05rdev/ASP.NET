import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;

function ProductInfo({ product }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [addedMsg, setAddedMsg] = useState('');

    const handleAddToCart = () => {
        if (quantity > product.stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            setAddedMsg("Số lượng sản phẩm trong kho không đủ!");
            return;
        }
        // Chuẩn hóa object đưa vào giỏ hàng
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: IMAGE_BASE_URL + (product.imageUrl || ''),
            stockQuantity: product.stockQuantity,
        };
        addToCart(cartProduct, quantity);
        setAddedMsg(`✔ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
        setTimeout(() => setAddedMsg(''), 3000);
    };

    const handleBuyNow = () => {
        if (quantity > product.stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            setAddedMsg("Số lượng sản phẩm trong kho không đủ!");
            return;
        }
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: IMAGE_BASE_URL + (product.imageUrl || ''),
            stockQuantity: product.stockQuantity,
        };
        addToCart(cartProduct, quantity);
        navigate('/checkout');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const handleQuantityChange = (val) => {
        if (val < 1) return;
        if (val > product.stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            setAddedMsg("Số lượng sản phẩm trong kho không đủ!");
            setQuantity(product.stockQuantity);
            return;
        }
        setQuantity(val);
        setAddedMsg('');
    };

    return (
        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
            <div className="row">
                {/* Ảnh sản phẩm bên trái */}
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="product-image-container border rounded overflow-hidden" style={{ height: '450px', backgroundColor: '#f8fafc' }}>
                        <img
                            src={IMAGE_BASE_URL + product.imageUrl}
                            alt={product.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* Thông tin chi tiết sản phẩm bên phải */}
                <div className="col-md-6 d-flex flex-column justify-content-between pl-md-4">
                    <div>
                        {/* Nhãn tồn kho */}
                        <div className="mb-2">
                            {product.stockQuantity > 0 ? (
                                <span className="badge badge-success px-3 py-1 font-weight-bold" style={{ borderRadius: '4px' }}>
                                    Còn hàng ({product.stockQuantity} sản phẩm)
                                </span>
                            ) : (
                                <span className="badge badge-secondary px-3 py-1 font-weight-bold" style={{ borderRadius: '4px' }}>
                                    Hết hàng
                                </span>
                            )}
                        </div>

                        {/* Tên sản phẩm */}
                        <h2 className="font-weight-bold text-dark mb-3" style={{ fontSize: '28px' }}>{product.name}</h2>

                        {/* Giá tiền */}
                        <h3 className="font-weight-bold text-danger mb-4" style={{ fontSize: '26px' }}>{formatCurrency(product.price)}</h3>

                        <hr />

                        {/* Mô tả ngắn */}
                        <div className="product-description my-4">
                            <h6 className="font-weight-bold text-uppercase text-secondary mb-2" style={{ fontSize: '13px', letterSpacing: '1px' }}>Mô tả sản phẩm</h6>
                            <div
                                className="text-muted text-justify"
                                style={{ fontSize: '15px', lineHeight: '1.6' }}
                                dangerouslySetInnerHTML={{ __html: product.description || "Sản phẩm công nghệ cao cấp với chất liệu tự nhiên, mềm mại, bền màu, mang đến cảm giác thoải mái khi mặc và định hình phong cách lịch lãm, hiện đại cho người dùng." }}
                            />
                        </div>
                    </div>

                    {/* Bộ tăng giảm số lượng & Nút thao tác */}
                    <div className="action-section pt-3 border-top mt-auto">
                        <div className="d-flex align-items-center mb-3">
                            <span className="text-secondary mr-3 font-weight-bold" style={{ fontSize: '14px' }}>Số lượng:</span>
                            <div className="input-group" style={{ width: '120px' }}>
                                <div className="input-group-prepend">
                                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => handleQuantityChange(quantity - 1)}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="form-control text-center p-0"
                                    value={quantity}
                                    readOnly
                                    style={{ height: '31px', fontSize: '14px' }}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => handleQuantityChange(quantity + 1)}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {addedMsg && (
                            <div className="alert alert-success py-2 mb-3" style={{ borderRadius: '10px', fontSize: '14px' }}>
                                {addedMsg}
                            </div>
                        )}
                        <div className="d-flex gap-3">
                            <button
                                className="btn btn-primary btn-lg font-weight-bold px-4 flex-grow-1"
                                style={{ backgroundColor: '#005088', borderColor: '#005088', borderRadius: '30px', fontSize: '16px' }}
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity === 0}
                            >
                                <i className="fas fa-shopping-cart mr-2"></i> Thêm Vào Giỏ
                            </button>
                            <button
                                className="btn btn-success btn-lg font-weight-bold px-4 ml-2 flex-grow-1"
                                style={{ backgroundColor: '#11CAA0', borderColor: '#11CAA0', borderRadius: '30px', fontSize: '16px' }}
                                onClick={handleBuyNow}
                                disabled={product.stockQuantity === 0}
                            >
                                Mua Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;
