import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';

function BlogSidebar({ activeCategoryId, onCategoryClick }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục blog ở sidebar:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogCategories();
    }, []);

    return (
        <aside className="blog-sidebar bg-white p-4 shadow-sm rounded mb-4" style={{ borderRadius: '12px' }}>
            <h5 className="font-weight-bold mb-3 border-left pl-2 text-uppercase" style={{ borderLeftColor: '#11CAA0', borderLeftWidth: '3px', color: '#005088', fontSize: '16px' }}>
                Chuyên mục tin tức
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
                            style={{ fontSize: '15px' }}
                        >
                            <span><i className="fas fa-folder-open mr-2"></i>Tất cả tin tức</span>
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li className="mb-2" key={cat.id}>
                            <button
                                className={`btn btn-link text-decoration-none p-0 w-100 text-left d-flex justify-content-between align-items-center ${activeCategoryId === cat.id ? 'text-primary font-weight-bold' : 'text-secondary'}`}
                                onClick={() => onCategoryClick(cat.id)}
                                style={{ fontSize: '15px' }}
                            >
                                <span><i className="fas fa-folder mr-2"></i>{cat.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}

export default BlogSidebar;
