import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

function HotProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHot = async () => {
            try {
                setLoading(true);
                const data = await productService.getHotProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm bán chạy:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHot();
    }, []);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="mt-2 text-muted">Đang tải sản phẩm bán chạy...</p>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="hot-products-section py-5" style={{ background: '#f8fafc' }}>
            <div className="container">
                <div className="section-heading mb-4 d-flex justify-content-between align-items-center">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#d9534f', letterSpacing: '0.5px' }}>
                        <i className="fas fa-fire mr-2 text-danger"></i>Sản phẩm Hot / Bán chạy
                    </h4>
                    <span className="badge badge-danger px-3 py-2" style={{ borderRadius: '10px' }}>BEST SELLERS</span>
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

export default HotProducts;
