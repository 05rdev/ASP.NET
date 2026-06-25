import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = ({ selectedBlogCategoryId }) => {
    // 1. Khai báo State chứa mảng bài viết lấy từ SQL Server
    const [posts, setPosts] = useState([]);

    // Khai báo State quản lý trạng thái chờ (Loading) nhằm tối ưu trải nghiệm người dùng
    const [loading, setLoading] = useState(true);

    // 2. Sử dụng useEffect để kiểm soát vòng đời gọi dữ liệu
    useEffect(() => {
        // Viết hàm bất đồng bộ để đợi dữ liệu từ Server truyền về
        const fetchPosts = async () => {
            try {
                setLoading(true); // Bắt đầu tải

                // Nếu có chọn chuyên mục thì lọc theo category, ngược lại lấy tất cả
                const data = selectedBlogCategoryId
                    ? await blogService.getPostsByCategory(selectedBlogCategoryId)
                    : await blogService.getAllPosts();

                // Nạp cục dữ liệu JSON vừa lấy vào State 'posts'
                setPosts(data);
            } catch (error) {
                console.error("Quá trình kết nối API bài viết thất bại:", error);
            } finally {
                setLoading(false); // Kết thúc tải dữ liệu (Dù thành công hay thất bại)
            }
        };

        // Kích hoạt hàm thực thi
        fetchPosts();
    }, [selectedBlogCategoryId]); // Mỗi khi người dùng chọn chuyên mục khác, useEffect sẽ tự động gọi lại API

    // 3. Xử lý trạng thái hiển thị giao diện tạm thời
    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang kết nối Database lấy tin tức công nghệ...</p>
            </div>
        );
    }

    // 4. Render giao diện HTML/Bootstrap khi đã có dữ liệu thành công
    return (
        <div className="card shadow-sm p-4 bg-white rounded">
            <h4 className="card-title text-uppercase font-weight-bold text-dark border-bottom pb-3 mb-4">
                <i className="fa-solid fa-newspaper mr-2 text-info"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {posts.length === 0 ? (
                <div className="alert alert-light text-center border">
                    <p className="text-muted m-0">Hiện tại chưa có bài viết xu hướng nào trong hệ thống.</p>
                </div>
            ) : (
                <div className="row">
                    {posts.map((item) => (
                        <div className="col-12 mb-4" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm bg-light">
                                <div className="card-body">
                                    <h5 className="font-weight-bold">
                                        <a href={`/post/${item.id}`} className="text-dark text-decoration-none text-hover-primary">
                                            {item.title}
                                        </a>
                                    </h5>

                                    {/* Hiển thị đoạn mô tả ngắn trích dẫn */}
                                    <p className="text-secondary small mt-2 card-text-truncate">
                                        {item.shortDescription || 'Nhấn để xem chi tiết bài viết chia sẻ về xu hướng phối đồ công sở...'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light text-muted small">
                                        <span>
                                            <i className="fa-regular fa-calendar-days mr-1 text-secondary"></i>
                                            {/* Định dạng lại chuỗi DateTime thô của SQL thành ngày thuần Việt */}
                                            {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="badge badge-pill badge-info px-3 py-2 cursor-pointer">
                                            Đọc tiếp <i className="fa-solid fa-angle-right ml-1"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
