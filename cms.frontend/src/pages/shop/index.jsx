import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';
import Footer from '../../components/Footer';
import Header from '../../components/Header';




function Shop() {
    // State 1: Lưu trữ mảng danh sách sản phẩm đổ ra giao diện
    const [products, setProducts] = useState([]);


    // State 2: Quản lý trạng thái chờ mạng (UX hiệu ứng xoay)
    const [isLoading, setIsLoading] = useState(true);




    // State 3: Khối quản lý tập trung toàn bộ tiêu chí lọc từ database
    const [filters, setFilters] = useState({
        categoryProductId: null,   // Mặc định null là lấy tất cả danh mục
        minPrice: '',       // Để trống nghĩa là không giới hạn sàn giá
        maxPrice: '',       // Để trống nghĩa là không giới hạn trần giá
        keyword: ''         // Từ khóa tìm kiếm rỗng
    });




    // useEffect theo dõi biến [filters]. Cứ khi nào 1 trong các ô lọc thay đổi -> API tự gọi ngầm
    useEffect(() => {
        const fetchFilterProducts = async () => {
            try {
                setIsLoading(true); // Bật hiệu ứng chờ mạng

                // Tạo bản sao sạch: loại bỏ các key có giá trị null/rỗng trước khi gửi API
                const cleanFilters = {};
                if (filters.categoryProductId) cleanFilters.categoryProductId = filters.categoryProductId;
                if (filters.minPrice !== '') cleanFilters.minPrice = filters.minPrice;
                if (filters.maxPrice !== '') cleanFilters.maxPrice = filters.maxPrice;
                if (filters.keyword !== '') cleanFilters.keyword = filters.keyword;

                // Gửi cụm đối tượng filters xuống API Backend C#
                const response = await productService.getAllProducts(cleanFilters);
                setProducts(response.data || response); // Cập nhật mảng sản phẩm mới
            } catch (error) {
                console.error("Lỗi gọi API lọc sản phẩm:", error);
            } finally {
                setIsLoading(false); // Tắt hiệu ứng chờ mạng
            }
        };
        fetchFilterProducts();
    }, [filters]);




    // Hàm CallBack truyền xuống cho các con kích hoạt khi người dùng thao tác
    const handleFilterUpdate = (newFields) => {
        setFilters(prev => ({
            ...prev,
            ...newFields // Gộp đè các trường lọc mới vào trạng thái cũ
        }));
    };




    return (
        <div className="shop-page-wrapper">
            <Header />

            {/* Banner đầu trang Cửa hàng */}
            <div className="shop-banner bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Cửa Hàng</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>DANH MỤC CỬA HÀNG</h2>
                </div>
            </div>

            <div className="container py-4">
                <div className="row">
                    {/* CỘT TRÁI (3/12): Khu vực chứa bộ lọc dọc */}
                    <aside className="col-md-3 mb-4">
                        <ShopSidebar
                            activeCategory={filters.categoryProductId}
                            minPrice={filters.minPrice}
                            maxPrice={filters.maxPrice}
                            onFilterChange={handleFilterUpdate}
                        />
                    </aside>




                    {/* CỘT PHẢI (9/12): Khu vực chứa thanh Search và Lưới hàng hóa */}
                    <main className="col-md-9">
                        <ShopHeader
                            total={products.length}
                            keyword={filters.keyword}
                            onSearchChange={handleFilterUpdate}
                        />




                        {/* Kiểm soát UX qua LoadingOrEmpty trước khi render danh sách */}
                        <LoadingOrEmpty isLoading={isLoading} totalItems={products.length}>
                             <ProductList products={products} /> 
                        </LoadingOrEmpty>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
}




export default Shop;
