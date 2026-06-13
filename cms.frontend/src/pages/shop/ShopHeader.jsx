import React from 'react';

function ShopHeader({ searchTerm, onSearchChange, productCount, sortBy, onSortChange }) {
    return (
        <div className="shop-header bg-white p-3 shadow-sm rounded mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3" style={{ borderRadius: '12px' }}>
            {/* Bộ đếm sản phẩm */}
            <div className="d-flex align-items-center">
                <span className="text-secondary font-weight-bold" style={{ fontSize: '15px' }}>
                    Tìm thấy <strong className="text-primary">{productCount}</strong> sản phẩm
                </span>
            </div>

            {/* Cụm công cụ tìm kiếm và lọc */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                {/* Ô tìm kiếm nhanh */}
                <div className="search-box position-relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm sản phẩm nhanh..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ borderRadius: '20px', paddingRight: '35px', width: '240px', fontSize: '14px' }}
                    />
                    <i className="fas fa-search position-absolute text-muted" style={{ right: '15px', top: '11px' }}></i>
                </div>

                {/* Sắp xếp */}
                <div className="sort-box d-flex align-items-center ml-sm-3 mt-2 mt-sm-0">
                    <label className="text-secondary mb-0 mr-2 text-nowrap" style={{ fontSize: '14px' }}>Sắp xếp:</label>
                    <select
                        className="form-control"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        style={{ borderRadius: '20px', fontSize: '14px', width: '180px' }}
                    >
                        <option value="default">Mới nhất</option>
                        <option value="priceAsc">Giá: Thấp đến Cao</option>
                        <option value="priceDesc">Giá: Cao đến Thấp</option>
                        <option value="nameAsc">Tên: A đến Z</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default ShopHeader;
