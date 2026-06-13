import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function ShopSidebar({ activeCategoryId, onCategoryClick, minPrice, maxPrice, onPriceChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục ở sidebar:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const priceRanges = [
        { label: 'Tất cả giá', min: 0, max: 1000000000 },
        { label: 'Dưới 500.000 ₫', min: 0, max: 500000 },
        { label: '500.000 ₫ - 1.000.000 ₫', min: 500000, max: 1000000 },
        { label: 'Trên 1.000.000 ₫', min: 1000000, max: 1000000000 },
    ];

    return (
        <aside className="shop-sidebar bg-white p-4 shadow-sm rounded mb-4" style={{ borderRadius: '12px' }}>
            {/* Lọc theo danh mục */}
            <div className="filter-group mb-4">
                <h5 className="font-weight-bold mb-3 border-left pl-2 text-uppercase" style={{ borderLeftColor: '#005088', borderLeftWidth: '3px', color: '#005088', fontSize: '16px' }}>
                    Danh mục sản phẩm
                </h5>
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                    </div>
                ) : (
                    <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                            <button
                                className={`btn btn-link text-decoration-none p-0 w-100 text-left d-flex justify-content-between align-items-center ${activeCategoryId === null ? 'text-primary font-weight-bold' : 'text-secondary'}`}
                                onClick={() => onCategoryClick(null)}
                            >
                                <span><i className="fas fa-angle-right mr-2"></i>Tất cả sản phẩm</span>
                            </button>
                        </li>
                        {categories.map((cat) => (
                            <li className="mb-2" key={cat.id}>
                                <button
                                    className={`btn btn-link text-decoration-none p-0 w-100 text-left d-flex justify-content-between align-items-center ${activeCategoryId === cat.id ? 'text-primary font-weight-bold' : 'text-secondary'}`}
                                    onClick={() => onCategoryClick(cat.id)}
                                >
                                    <span><i className="fas fa-angle-right mr-2"></i>{cat.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Lọc theo khoảng giá */}
            <div className="filter-group pt-3 border-top">
                <h5 className="font-weight-bold mb-3 border-left pl-2 text-uppercase" style={{ borderLeftColor: '#005088', borderLeftWidth: '3px', color: '#005088', fontSize: '16px' }}>
                    Khoảng giá
                </h5>
                <ul className="list-unstyled mb-0">
                    {priceRanges.map((range, index) => (
                        <li className="mb-2" key={index}>
                            <button
                                className={`btn btn-link text-decoration-none p-0 w-100 text-left ${minPrice === range.min && maxPrice === range.max ? 'text-primary font-weight-bold' : 'text-secondary'}`}
                                onClick={() => onPriceChange(range.min, range.max)}
                                style={{ fontSize: '14px' }}
                            >
                                <i className={`far ${minPrice === range.min && maxPrice === range.max ? 'fa-dot-circle' : 'fa-circle'} mr-2`}></i>
                                {range.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export default ShopSidebar;
