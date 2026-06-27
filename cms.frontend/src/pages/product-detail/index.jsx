import React, { useState, useEffect } from 'react';
// Thư viện useParams hỗ trợ bóc tách biến số trên URL đường dẫn
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import authService from '../../services/authService';




const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL;




function ProductDetail() {
    const { id } = useParams(); // Lấy biến ID động (Ví dụ: /product/12 -> lấy được con số 12)
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);


    // State cục bộ quản lý ô số lượng khách muốn chọn mua (Mặc định bằng 1)
    const [quantity, setQuantity] = useState(1);

    // State hiển thị thông báo lỗi/thành công inline (thay vì dùng alert)
    const [cartMessage, setCartMessage] = useState({ type: '', text: '' });




    useEffect(() => {
        const fetchProductById = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data.data || data); // Nạp đối tượng sản phẩm độc bản vào state
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductById();
    }, [id]);




    // Hàm tiện ích ép định dạng hiển thị tiền tệ chuẩn Việt Nam (đ)
    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };


    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value > product.stockQuantity) {
            //alert("Số lượng sản phẩm trong kho không đủ!");
            setCartMessage({
                type: 'warning',
                text: 'Số lượng sản phẩm trong kho không đủ!'
            });
            setQuantity(product.stockQuantity);
            return;
        }
        // Cho phép nhập số lượng tùy ý để kích hoạt cảnh báo khi vượt kho
        const safeValue = Math.max(1, value);
        setQuantity(safeValue);
    };


    // LOGIC CỐT LÕI: Kiểm thử hành động thêm sản phẩm vào giỏ hàng toàn cục
    const handleAddToCartSubmit = (isBuyNow = false) => {
        if (!authService.isLoggedIn()) {
            alert("Vui lòng đăng nhập tài khoản khách hàng để thêm sản phẩm vào giỏ!");
            navigate('/login');
            return;
        }

        // Kiểm tra sản phẩm đã hết hàng
        if (product.stockQuantity <= 0) {
            setCartMessage({
                type: 'danger',
                text: 'Rất tiếc, sản phẩm này hiện đã hết hàng. Vui lòng quay lại sau!'
            });
            return;
        }

        // Thực hiện so sánh toán học trực tiếp giữa ô chọn mua với cột tồn kho thực tế
        if (quantity > product.stockQuantity) {
            // Nếu vượt kho -> Chặn lại lập tức, hiển thị cảnh báo inline và alert
            alert("Số lượng sản phẩm trong kho không đủ!");
            setCartMessage({
                type: 'warning',
                text: 'Số lượng sản phẩm trong kho không đủ!'
            });
            return; // Ngắt hàm, không cho chạy xuống lệnh nạp giỏ hàng bên dưới
        }

        // Kịch bản hợp lệ -> Đủ điều kiện đẩy vào mảng giỏ hàng toàn cục
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : 'https://via.placeholder.com/200',
            stockQuantity: product.stockQuantity
        };

        addToCart(cartProduct, quantity);

        if (isBuyNow) {
            alert(`🎉 Đã thêm sản phẩm "${product.name}" vào giỏ hàng thành công! Đang chuyển hướng đến trang thanh toán...`);
            // Chuyển hướng ngay tới trang thanh toán cho sản phẩm này
            navigate('/checkout', { state: { selectedIds: [product.id] } });
        } else {
            alert(`🎉 Đã thêm thành công ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
            setCartMessage({
                type: 'success',
                text: `Đã thêm ${quantity} chiếc "${product.name}" vào giỏ hàng thành công!`
            });
        }
    };




    if (loading) return (
        <div className="product-detail-page">
            <Header />
            <div className="text-center py-5 font-italic text-muted">Đang truy vấn kho dữ liệu mẫu công nghệ...</div>
            <Footer />
        </div>
    );
    if (!product) return (
        <div className="product-detail-page">
            <Header />
            <div className="text-center py-5 text-danger font-weight-bold">Sản phẩm này không tồn tại trên hệ thống V.DinhCMS.</div>
            <Footer />
        </div>
    );


    // Kiểm tra trạng thái hết hàng
    const isOutOfStock = product.stockQuantity <= 0;


    return (
        <div className="product-detail-page">
            <Header />

            {/* Breadcrumb điều hướng */}
            <div className="bg-white border-bottom py-3 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none text-secondary">Cửa Hàng</Link></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Chi tiết sản phẩm</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-3">
                <div className="row mt-3 bg-white p-4 rounded shadow-sm">
                    {/* KHỐI BÊN TRÁI: HIỂN THỊ 1 ẢNH ĐẠI DIỆN DUY NHẤT (ÉP CHUẨN CỐ ĐỊNH TỈ LỆ) */}
                    <div className="col-md-6 mb-4">
                        <div className="product-image-container border rounded" style={{ overflow: 'hidden', height: '450px', position: 'relative' }}>
                            <img
                                src={product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : 'https://via.placeholder.com/500x500'}
                                alt={product.name}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }} // Giúp ảnh tự co giãn bọc khung, không bao giờ bị bóp méo
                            />
                            {/* Badge hết hàng phủ lên ảnh */}
                            {isOutOfStock && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <span className="badge badge-danger px-4 py-3" style={{ fontSize: '18px', borderRadius: '10px' }}>
                                        <i className="fas fa-ban mr-2"></i>HẾT HÀNG
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>




                    {/* KHỐI BÊN PHẢI: CHI TIẾT THÔNG TIN VÀ NÚT HÀNH ĐỘNG MUA SẮM */}
                    <div className="col-md-6">
                        <h2 className="font-weight-bold text-dark mb-2">{product.name}</h2>


                        {/* Hiển thị giá bán lớn màu đỏ, nổi bật */}
                        <h3 className="text-danger font-weight-bold mb-4" style={{ letterSpacing: '0.5px' }}>
                            {formatVND(product.price)}
                        </h3>


                        <div className="mb-4">
                            <span className={`badge py-2 px-3 border ${isOutOfStock ? 'badge-danger text-white' : 'badge-light text-secondary'}`}>
                                <i className={`fas ${isOutOfStock ? 'fa-times-circle' : 'fa-warehouse'} mr-2`}></i>
                                {isOutOfStock
                                    ? 'Tạm hết hàng'
                                    : <>Còn lại: <strong className="text-dark">{product.stockQuantity} chiếc</strong></>
                                }
                            </span>
                        </div>


                        <div
                            className="text-secondary mb-4 text-justify"
                            style={{ fontSize: '15px', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: product.description || "Mô tả sản phẩm cao cấp đang được cập nhật chi tiết từ hệ thống quản trị nội dung V.DinhCMS.GMGear..." }}
                        />


                        <hr className="my-4" />


                        {/* THÔNG BÁO INLINE (thay cho alert) */}
                        {cartMessage.text && (
                            <div className={`alert alert-${cartMessage.type} d-flex align-items-center mb-3`} role="alert" style={{ borderRadius: '10px', fontSize: '14px' }}>
                                <i className={`fas ${cartMessage.type === 'success' ? 'fa-check-circle' : cartMessage.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'} mr-2`}></i>
                                {cartMessage.text}
                            </div>
                        )}


                        {/* KHU VỰC ĐIỀU CHỈNH SỐ LƯỢNG MUA VÀ ACTION BUTTON */}
                        <div className="d-flex align-items-center flex-wrap" style={{ gap: '15px' }}>
                            <div className="quantity-select-wrapper" style={{ width: '120px' }}>
                                <label className="small text-muted font-weight-bold mb-1 d-block">SỐ LƯỢNG MUA:</label>
                                <input
                                    type="number"
                                    className="form-control text-center font-weight-bold"
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    disabled={isOutOfStock}
                                />
                            </div>


                            <div className="btn-action-wrapper flex-grow-1 pt-4 d-flex" style={{ gap: '10px' }}>
                                <button
                                    className={`btn font-weight-bold py-2 flex-grow-1 ${isOutOfStock ? 'btn-secondary disabled' : 'btn-primary'}`}
                                    style={{
                                        backgroundColor: isOutOfStock ? '#999' : '#005088',
                                        borderColor: isOutOfStock ? '#999' : '#005088',
                                        borderRadius: '8px',
                                        cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={() => handleAddToCartSubmit(false)}
                                    disabled={isOutOfStock}
                                >
                                    <i className={`fas ${isOutOfStock ? 'fa-ban' : 'fa-shopping-cart'} mr-2`}></i>
                                    {isOutOfStock ? 'TẠM HẾT HÀNG' : 'THÊM VÀO GIỎ'}
                                </button>

                                {!isOutOfStock && (
                                    <button
                                        className="btn font-weight-bold py-2 flex-grow-1 text-white"
                                        style={{
                                            backgroundColor: '#11CAA0',
                                            borderColor: '#11CAA0',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleAddToCartSubmit(true)}
                                    >
                                        <i className="fas fa-credit-card mr-2"></i>
                                        MUA NGAY
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}




export default ProductDetail;
