import React from 'react';




function LoadingOrEmpty({ isLoading, totalItems, children }) {
    // 1. Kịch bản đang tải dữ liệu qua mạng
    if (isLoading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="text-muted mt-3 font-italic">V.DinhCMS đang thanh lọc kho hàng, vui lòng chờ...</p>
            </div>
        );
    }




    // 2. Kịch bản bộ lọc không tìm thấy kết quả nào trong SQL Server
    if (totalItems === 0) {
        return (
            <div className="text-center py-5 my-4 bg-white rounded shadow-sm">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                    alt="Empty"
                    style={{ width: '120px', opacity: 0.5 }}
                    className="mb-3"
                />
                <h5 className="font-weight-bold text-secondary">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h5>
                <p className="text-muted small">Vui lòng nới rộng khoảng giá hoặc kiểm tra lại từ khóa tìm kiếm của bạn.</p>
            </div>
        );
    }




    // 3. Nếu dữ liệu hợp lệ và có sản phẩm, trả lại ruột lưới ProductList ban đầu
    return children;
}




export default LoadingOrEmpty;
