import React, { useState, useEffect } from 'react';
import blogService from '../../services/postService';
// IMPORT  component CON VÀO ĐỂ SỬ DỤNG
import PostCard from '../../components/PostCard';


function LatestBlog() { // chỉ lấy 3 tin
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                const topThreePosts = data.sort((a, b) => b.id - a.id).slice(0, 3);
                setPosts(topThreePosts);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải tin tức công nghệ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);


    if (loading) {
        return (
            <div className="container my-4 text-center">
                <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp tin tức xu hướng...</span>
            </div>
        );
    }


    return (
        <section className="latest-blog-section py-5" style={{ backgroundColor: '#fdfbf7' }}>
            <div className="container">

                <div className="section-heading mb-4 text-center">
                    <h3 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>
                        Xu Hướng Công nghệ
                    </h3>
                    <p className="text-muted lead" style={{ fontSize: '15px' }}>
                        Cập nhật những mẹo phối đồ và tin tức phong cách mới nhất cùng VanDinhCMS
                    </p>
                    <div className="mx-auto" style={{ width: '60px', height: '3px', backgroundColor: '#11CAA0' }}></div>
                </div>


                {/* KHUNG LƯỚI ĐỒNG BỘ  component CON */}
                <div className="row mt-5">
                    {posts.map((item) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-4" key={item.id}>
                            {/* CHÈN COMPONENT CON VÀ TRUYỀN DỮ LIỆU QUA PROP post */}
                            <PostCard post={item} />
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
}


export default LatestBlog;
