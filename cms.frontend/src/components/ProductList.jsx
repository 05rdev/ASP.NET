import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ selectedCategoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (selectedCategoryId) {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                } else {
                    data = await productService.getAllProducts();
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5 my-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12 text-center py-5">
                    <i className="fa-solid fa-folder-open text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                    <p className="text-muted">Chưa có sản phẩm nào thuộc danh mục này.</p>
                </div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden product-card hover-lift transition-all">
                            {/* Product Image Section */}
                            <div className="position-relative overflow-hidden bg-light" style={{ height: '220px' }}>
                                <img
                                    src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://localhost:7125${item.imageUrl}`) : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80'}
                                    className="w-100 h-100"
                                    alt={item.name}
                                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80';
                                    }}
                                />
                                {item.stockQuantity <= 0 && (
                                    <div className="position-absolute top-0 left-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                                        <span className="badge badge-danger text-uppercase px-3 py-2 font-weight-bold" style={{ fontSize: '0.8rem' }}>Hết hàng</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-body d-flex flex-column justify-content-between p-4">
                                <div>
                                    <h5 className="card-title font-weight-bold text-dark mb-2 text-truncate-2" style={{ fontSize: '1rem', lineHeight: '1.4', height: '2.8rem' }}>
                                        {item.name}
                                    </h5>
                                    <p className="card-text text-danger font-weight-bold mb-2" style={{ fontSize: '1.15rem' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                                    <span className="small text-muted">Tồn kho: <strong>{item.stockQuantity}</strong> SP</span>
                                    <button className="btn btn-primary btn-sm px-3 rounded-pill transition-all" disabled={item.stockQuantity <= 0}>
                                        <i className="fa-solid fa-cart-plus mr-1"></i> Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;
