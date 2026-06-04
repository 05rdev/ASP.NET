import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import './App.css'; // File chứa các style tùy biến riêng của dự án

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <div className="container mt-5">
      {/* Phần Header của Website */}
      <header className="pb-3 mb-4 border-bottom">
        <span className="fs-4 font-weight-bold text-dark text-uppercase">
          🛒 HỆ THỐNG CỬA HÀNG TRỰC TUYẾN - VanDinhCMS RETAIL
        </span>
      </header>

      <div className="row">
        {/* Cột bên trái (Chức năng Sidebar): Hiển thị bộ lọc danh mục sản phẩm */}
        <div className="col-md-3 mb-4">
          <CategoryProductList
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {/* Cột bên phải: Danh sách sản phẩm thời trang tự làm */}
        <div className="col-md-9 mb-4">
          <h4 className="mb-4 text-uppercase text-secondary font-weight-bold" style={{ letterSpacing: '0.5px' }}>
            {selectedCategoryId ? 'Sản phẩm theo danh mục' : 'Bộ sưu tập mới nhất'}
          </h4>
          <ProductList selectedCategoryId={selectedCategoryId} />
        </div>
      </div>

      {/* KHU VỰC 2: BLOG & BLOG CATEGORIES (Tin tức thời trang công sở, dạ hội) */}
      <div className="row mt-5 pt-4 border-top">
        <div className="col-12">
          <PostList />
        </div>
      </div>
    </div>
  );
}

export default App;
