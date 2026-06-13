import React from 'react';

const IMAGE_BASE_URL = "https://localhost:7125"; // đường dẫn bên Backend
//  component con nhận dữ liệu 'post' từ  component cha truyền xuống
function PostCard({ post }) {
    return (
        <div className="card h-100 shadow-sm border-0 blog-card-hover" style={{ borderRadius: '12px', overflow: 'hidden', transition: '0.3s' }}>

            {/* 1. Hình ảnh đại diện của bài viết (Thumbnail) */}
            <div className="blog-image-wrapper" style={{ height: '220px', overflow: 'hidden' }}>
                <img
                    //src={post.imageUrl || 'https://via.placeholder.com/400x250'}
                    src={IMAGE_BASE_URL + post.imageUrl}
                    className="w-100 h-100"
                    alt={post.title}
                    style={{ objectFit: 'cover', transition: '0.5s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
            </div>


            {/* 2. Nội dung tóm tắt bài viết */}
            <div className="card-body p-4 d-flex flex-column">
                {/* Ngày đăng bài viết */}
                <small className="text-uppercase font-weight-bold text-muted mb-2 d-block" style={{ fontSize: '12px', color: '#11CAA0' }}>
                    <i className="far fa-calendar-alt mr-1"></i>
                    {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                </small>


                {/* Tiêu đề bài viết - Giới hạn tối đa 2 dòng để không bị lệch phom */}
                <h5 className="card-title font-weight-bold mb-2" style={{ color: '#005088', fontSize: '18px', lineHeight: '1.4', minHeight: '50px' }}>
                    <a href={`/blog/${post.id}`} className="text-decoration-none text-dark-hover" style={{ color: '#005088' }}>
                        {post.title}
                    </a>
                </h5>


                {/* Đoạn mô tả ngắn (Cắt chuỗi an toàn bảo vệ layout) */}
                <p className="card-text text-secondary text-justify mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {post.summary ? `${post.summary.substring(0, 100)}...` : 'Khám phá bí quyết lựa chọn trang phục phù hợp với vóc dáng để luôn tự tin tỏa sáng...'}
                </p>


                {/* Nút liên kết xem chi tiết đẩy xuống sát đáy Card */}
                <div className="mt-auto pt-2 border-top">
                    <a
                        href={`/blog/${post.id}`}
                        className="font-weight-bold text-decoration-none d-inline-flex align-items-center"
                        style={{ color: '#11CAA0', fontSize: '14px', transition: '0.3s' }}
                        onMouseOver={(e) => e.target.style.color = '#005088'}
                        onMouseOut={(e) => e.target.style.color = '#11CAA0'}
                    >
                        Đọc bài viết <i className="fas fa-long-arrow-alt-right ml-2"></i>
                    </a>
                </div>
            </div>


        </div>
    );
}


export default PostCard;
