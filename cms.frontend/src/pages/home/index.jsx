import React, { useState } from 'react';

// IMPORT ĐỦ CÁC TẦNG THEO ĐÚNG THỨ TỰ HƯỚNG DẪN + CÁC TẦNG MỚI
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestProducts from './LatestProducts';
import HotProducts from './HotProducts';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';

function Home() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div className="homepage-container">
            {/* TẦNG 1: Thanh tiện ích, logo, ô tìm kiếm và giỏ hàng nhanh */}
            <Header />

            {/* TẦNG 2: Banner quảng cáo lớn, hình khối trang trí và nút kêu gọi mua hàng */}
            <HeroBanner />

            {/* TẦNG 3: Menu hiển thị danh mục sản phẩm theo khối tròn chứa ảnh */}
            <CategoryMenu
                activeCategoryId={selectedCategoryId}
                onCategoryClick={setSelectedCategoryId}
            />

            {/* TẦNG 4: Lưới hiển thị danh sách sản phẩm công nghệ theo danh mục */}
            <ProductGrid
                selectedCategoryId={selectedCategoryId}
            />

            {/* PHÂN HỆ MỚI: Sản phẩm mới nhất (Gọi API /api/Products/latest) */}
            <LatestProducts />

            {/* PHÂN HỆ MỚI: Sản phẩm Hot / Bán chạy (Gọi API /api/Products/hot) */}
            <HotProducts />

            {/* TẦNG 5: Khối hiển thị các bài viết tin tức xu hướng mặc đẹp */}
            <LatestBlog />

            {/* TẦNG 6: Chân trang quản trị thông tin liên hệ, hotline và chính sách cửa hàng */}
            <Footer />
        </div>
    );
}

export default Home;
