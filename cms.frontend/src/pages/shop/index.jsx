import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';
import productService from '../../services/productService';

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // States cho bộ lọc
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000000);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');

    // Gọi API nạp sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = activeCategoryId
                    ? await productService.getProductsByCategory(activeCategoryId)
                    : await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm tại trang shop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategoryId]);

    // Xử lý lọc client-side (Search và Giá)
    const filteredProducts = products
        .filter((prod) => {
            const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = prod.price >= minPrice && prod.price <= maxPrice;
            return matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            if (sortBy === 'priceAsc') return a.price - b.price;
            if (sortBy === 'priceDesc') return b.price - a.price;
            if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
            return b.id - a.id; // mặc định/mới nhất
        });

    // Hàm xóa bộ lọc
    const handleClearFilters = () => {
        setActiveCategoryId(null);
        setMinPrice(0);
        setMaxPrice(1000000000);
        setSearchTerm('');
        setSortBy('default');
    };

    const handlePriceChange = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
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

            {/* Bố cục chính Grid */}
            <div className="container py-3">
                <div className="row">
                    {/* Cột trái: Sidebar lọc */}
                    <div className="col-lg-3 col-md-4">
                        <ShopSidebar
                            activeCategoryId={activeCategoryId}
                            onCategoryClick={setActiveCategoryId}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onPriceChange={handlePriceChange}
                        />
                    </div>

                    {/* Cột phải: Danh sách sản phẩm & Header */}
                    <div className="col-lg-9 col-md-8">
                        <ShopHeader
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            productCount={filteredProducts.length}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />

                        {/* Loading or Empty state handler */}
                        <LoadingOrEmpty
                            loading={loading}
                            isEmpty={filteredProducts.length === 0}
                            onClearFilters={handleClearFilters}
                        />

                        {/* Grid danh sách thực tế */}
                        {!loading && filteredProducts.length > 0 && (
                            <ProductList products={filteredProducts} />
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Shop;
