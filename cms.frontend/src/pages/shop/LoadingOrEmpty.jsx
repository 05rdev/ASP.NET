import React from 'react';

function LoadingOrEmpty({ loading, isEmpty, onClearFilters }) {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="mt-3 text-muted" style={{ fontSize: '15px' }}>Đang tải danh sách sản phẩm...</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="text-center py-5 bg-white shadow-sm rounded-lg" style={{ borderRadius: '15px', padding: '40px' }}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6108/6108520.png"
                    alt="No products"
                    className="mb-4"
                    style={{ width: '120px', opacity: 0.5 }}
                />
                <h4 className="fw-bold text-secondary mb-2">Không Tìm Thấy Sản Phẩm</h4>
                <p className="text-muted">Không có sản phẩm nào phù hợp với bộ lọc tìm kiếm hiện tại của bạn.</p>
                <button className="btn btn-primary btn-sm px-4 mt-3" onClick={onClearFilters} style={{ borderRadius: '20px', backgroundColor: '#005088', borderColor: '#005088' }}>
                    Xóa tất cả bộ lọc
                </button>
            </div>
        );
    }

    return null;
}

export default LoadingOrEmpty;
