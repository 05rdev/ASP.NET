import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductInfo from './ProductInfo';
import productService from '../../services/productService';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", err);
                setError("Không tìm thấy sản phẩm hoặc xảy ra lỗi kết nối hệ thống.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

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

            {/* Khối hiển thị thông tin */}
            <div className="container py-3">
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center py-5" role="alert" style={{ borderRadius: '15px' }}>
                        <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                        <h4 className="font-weight-bold">{error}</h4>
                        <Link to="/shop" className="btn btn-outline-danger btn-sm mt-3 px-4" style={{ borderRadius: '20px' }}>Quay lại Cửa hàng</Link>
                    </div>
                )}

                {!loading && !error && product && (
                    <ProductInfo product={product} />
                )}
            </div>

            <Footer />
        </div>
    );
}

export default ProductDetail;
