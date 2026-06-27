import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

function LatestProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                setLoading(true);
                const data = await productService.getLatestProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang tải sản phẩm mới nhất...</p>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="latest-products-section py-5 bg-white border-bottom">
            <div className="container">
                <div className="section-heading mb-4 d-flex justify-content-between align-items-center">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088', letterSpacing: '0.5px' }}>
                        <i className="fas fa-plus-circle mr-2 text-info"></i>Sản phẩm mới nhất
                    </h4>
                    <span className="badge badge-info px-3 py-2" style={{ borderRadius: '10px' }}>NEW ARRIVALS</span>
                </div>
                
                <div className="row">
                    {products.map((product) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-4" key={product.id}>
                            <ProductCard item={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LatestProducts;
