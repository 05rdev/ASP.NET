import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogSidebar from './BlogSidebar';
import PostCard from '../../components/PostCard';
import blogService from '../../services/blogService';
import Pagination from '../../components/Pagination';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // State Phân Trang
    const [page, setPage] = useState(1);
    const [pageSize] = useState(4); // Hiển thị 4 bài viết mỗi trang theo yêu cầu của bạn
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Reset trang về 1 khi đổi danh mục bài viết
    useEffect(() => {
        setPage(1);
    }, [selectedCategoryId]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const params = {
                    page: page,
                    pageSize: pageSize
                };
                const data = selectedCategoryId
                    ? await blogService.getPostsByCategory(selectedCategoryId, params)
                    : await blogService.getAllPosts(params);
                
                if (data && data.data !== undefined) {
                    setPosts(data.data || []);
                    setTotalPages(data.totalPages || 1);
                    setTotalItems(data.totalItems || 0);
                } else {
                    setPosts(data || []);
                    setTotalPages(1);
                    setTotalItems(data ? data.length : 0);
                }
            } catch (error) {
                console.error("Lỗi khi tải bài viết trang blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCategoryId, page, pageSize]);

    return (
        <div className="blog-page-wrapper">
            <Header />

            {/* Banner đầu trang Tin tức */}
            <div className="blog-banner bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Tin Tức / Blog</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>TIN TỨC & XU HƯỚNG CÔNG NGHỆ</h2>
                </div>
            </div>

            {/* Bố cục chính */}
            <div className="container py-3">
                <div className="row">
                    {/* Cột trái: Danh sách bài viết */}
                    <div className="col-lg-9 col-md-8">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Đang tải danh sách bài viết...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-5 bg-white shadow-sm rounded-lg" style={{ borderRadius: '15px' }}>
                                <i className="far fa-newspaper fa-3x text-muted mb-3"></i>
                                <h4 className="text-secondary font-weight-bold">Không Có Bài Viết Nào</h4>
                                <p className="text-muted">Chưa có bài viết nào được đăng tải trong chuyên mục này.</p>
                            </div>
                        ) : (
                            <>
                                <div className="row">
                                    {posts.map((post) => (
                                        <div className="col-md-6 mb-4" key={post.id}>
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>

                                {/* Điều khiển phân trang bài viết */}
                                <Pagination 
                                    currentPage={page} 
                                    totalPages={totalPages} 
                                    onPageChange={setPage} 
                                    totalItems={totalItems} 
                                />
                            </>
                        )}
                    </div>

                    {/* Cột phải: Sidebar lọc chuyên mục */}
                    <div className="col-lg-3 col-md-4">
                        <BlogSidebar
                            activeCategoryId={selectedCategoryId}
                            onCategoryClick={setSelectedCategoryId}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Blog;
