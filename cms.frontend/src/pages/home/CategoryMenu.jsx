import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const getCategoryImage = (name) => {
    const lowercaseName = (name || '').toLowerCase();
    if (lowercaseName.includes('laptop')) {
        return 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (lowercaseName.includes('link kiện điện thoại') || lowercaseName.includes('linh kiện')) {
        return 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (lowercaseName.includes('phụ kiện')) {
        return 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (lowercaseName.includes('điện thoại')) {
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&h=150&q=80';
    }
    // Default image
    return 'https://images.unsplash.com/photo-1468495244122-44a1aba3dac1?auto=format&fit=crop&w=150&h=150&q=80';
};

function CategoryMenu({ activeCategoryId, onCategoryClick }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    const handleCategoryClick = (id) => {
        if (onCategoryClick) {
            onCategoryClick(id);
        }
    };

    if (loading) {
        return (
            <div className="container my-4 text-center">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp menu phân loại...</span>
            </div>
        );
    }

    return (
        <section id="category-menu-section" className="category-menu-wrapper my-5">
            <div className="container">
                <div className="text-center mb-4">
                    <h5 className="font-weight-bold text-secondary text-uppercase tracking-wider" style={{ fontSize: '13px', letterSpacing: '2px' }}>
                        Khám phá sản phẩm theo danh mục
                    </h5>
                    <div style={{ width: '50px', height: '3px', background: '#005088', margin: '8px auto 0', borderRadius: '2px' }}></div>
                </div>

                {/* Grid contain Categories as beautiful circles/squares */}
                <div className="d-flex flex-wrap justify-content-center align-items-center" style={{ gap: '24px' }}>
                    {/* All Products button */}
                    <div
                        onClick={() => handleCategoryClick(null)}
                        className={`category-item-card text-center cursor-pointer`}
                        style={{
                            width: '110px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: activeCategoryId === null ? 'scale(1.05)' : 'none'
                        }}
                    >
                        <div
                            style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 10px',
                                border: activeCategoryId === null ? '3px solid #005088' : '3px solid #e2e8f0',
                                boxShadow: activeCategoryId === null ? '0 10px 20px rgba(0, 80, 136, 0.2)' : 'none',
                                background: activeCategoryId === null ? '#005088' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <i className={`fas fa-th-large fa-2x ${activeCategoryId === null ? 'text-white' : 'text-secondary'}`}></i>
                        </div>
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: activeCategoryId === null ? '#005088' : '#4a5568',
                                display: 'block',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Tất cả
                        </span>
                    </div>

                    {/* Category loops */}
                    {categories.map((cat) => {
                        const isActive = activeCategoryId === cat.id;
                        const catImage = getCategoryImage(cat.name);
                        return (
                            <div
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className="category-item-card text-center"
                                style={{
                                    width: '110px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: isActive ? 'scale(1.05)' : 'none'
                                }}
                            >
                                <div
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        margin: '0 auto 10px',
                                        border: isActive ? '3px solid #11CAA0' : '3px solid #e2e8f0',
                                        boxShadow: isActive ? '0 10px 20px rgba(17, 202, 160, 0.2)' : 'none',
                                        transition: 'all 0.3s ease',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={catImage}
                                        alt={cat.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: isActive ? 'brightness(1)' : 'brightness(0.95) grayscale(0.2)'
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        color: isActive ? '#11CAA0' : '#4a5568',
                                        display: 'block',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {cat.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Micro-animations CSS */}
            <style>{`
                .category-item-card:hover {
                    transform: translateY(-5px) scale(1.05) !important;
                }
                .category-item-card:hover div {
                    border-color: #005088 !important;
                    box-shadow: 0 10px 25px rgba(0, 80, 136, 0.25) !important;
                }
                .category-item-card:hover span {
                    color: #005088 !important;
                }
            `}</style>
        </section>
    );
}

export default CategoryMenu;
