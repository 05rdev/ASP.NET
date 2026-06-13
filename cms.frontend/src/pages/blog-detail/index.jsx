import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import postService from '../../services/postService';

const IMAGE_BASE_URL = "https://localhost:7125"; // backend URL

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
                setError("Không tìm thấy bài viết hoặc đã có lỗi hệ thống xảy ra.");
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetail();
    }, [id]);

    return (
        <div className="blog-detail-page bg-light">
            <Header />

            {/* Breadcrumb điều hướng */}
            <div className="bg-white border-bottom py-3 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none text-secondary">Tin Tức / Blog</Link></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Chi tiết bài viết</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Khung nội dung */}
            <div className="container py-3">
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-info" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải nội dung bài viết...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center py-5" role="alert" style={{ borderRadius: '15px' }}>
                        <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                        <h4 className="font-weight-bold">{error}</h4>
                        <Link to="/blog" className="btn btn-outline-danger btn-sm mt-3 px-4" style={{ borderRadius: '20px' }}>Quay lại Blog</Link>
                    </div>
                )}

                {!loading && !error && post && (
                    <article className="card shadow-sm border-0 p-4 p-md-5 bg-white" style={{ borderRadius: '16px' }}>
                        {/* Tiêu đề chính */}
                        <h1 className="font-weight-bold mb-3" style={{ color: '#005088', fontSize: '32px', lineHeight: '1.3' }}>
                            {post.title}
                        </h1>

                        {/* Thông tin metadata */}
                        <div className="d-flex align-items-center text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '14px' }}>
                            <span className="mr-3">
                                <i className="far fa-calendar-alt mr-2 text-info"></i>
                                Ngày đăng: {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                            </span>
                            <span>
                                <i className="far fa-user mr-2 text-info"></i>
                                Tác giả: Ban Biên Tập
                            </span>
                        </div>

                        {/* Mô tả tóm tắt (Lead summary) */}
                        {post.summary && (
                            <p className="lead text-secondary text-justify mb-4 font-italic" style={{ borderLeft: '4px solid #11CAA0', paddingLeft: '15px', fontSize: '17px' }}>
                                {post.summary}
                            </p>
                        )}

                        {/* Ảnh đại diện bài viết */}
                        {post.imageUrl && (
                            <div className="mb-4 text-center rounded overflow-hidden" style={{ maxHeight: '500px' }}>
                                <img
                                    src={IMAGE_BASE_URL + post.imageUrl}
                                    alt={post.title}
                                    className="w-100 h-100 img-fluid"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {/* Nội dung chi tiết Render Raw HTML */}
                        <div
                            className="blog-content-body text-justify mt-4"
                            style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155' }}
                            dangerouslySetInnerHTML={{ __html: post.content || post.description || "<p>Nội dung chi tiết bài viết đang được cập nhật...</p>" }}
                        />

                        {/* Chân bài viết */}
                        <div className="mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                            <Link to="/blog" className="btn btn-outline-primary px-4" style={{ borderRadius: '20px', borderColor: '#005088', color: '#005088' }}>
                                <i className="fas fa-chevron-left mr-2"></i> Quay lại Blog
                            </Link>
                            <div className="share-buttons">
                                <span className="text-secondary mr-2" style={{ fontSize: '14px' }}>Chia sẻ:</span>
                                <button className="btn btn-link text-primary p-1"><i className="fab fa-facebook fa-lg"></i></button>
                                <button className="btn btn-link text-info p-1 ml-2"><i className="fab fa-twitter fa-lg"></i></button>
                            </div>
                        </div>
                    </article>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default BlogDetail;
