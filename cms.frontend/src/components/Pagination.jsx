import React from 'react';

/**
 * Component phân trang dùng chung cho toàn bộ trang Frontend
 * Props:
 *   - currentPage: Trang hiện tại (bắt đầu từ 1)
 *   - totalPages: Tổng số trang
 *   - onPageChange: Hàm callback khi người dùng chuyển trang
 *   - totalItems: (Tùy chọn) Tổng số mục để hiển thị thông tin
 */
function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
    // Không hiển thị phân trang nếu không có dữ liệu hoặc số trang nhỏ hơn 1
    if (totalPages < 1 || totalItems === 0) return null;

    // Tạo mảng số trang hiển thị (tối đa 5 trang gần trang hiện tại)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        // Điều chỉnh lại startPage nếu endPage đã chạm cuối
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination-wrapper d-flex flex-column align-items-center mt-4 mb-2">
            {/* Thông tin tổng số mục */}
            {totalItems !== undefined && (
                <p className="text-muted mb-2" style={{ fontSize: '13px' }}>
                    Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
                    {' '}&mdash;{' '}Tổng cộng <strong>{totalItems}</strong> mục
                </p>
            )}

            {/* Thanh phân trang Bootstrap */}
            <nav aria-label="Phân trang">
                <ul className="pagination pagination-sm mb-0" style={{ gap: '4px' }}>
                    {/* Nút Trang đầu */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            title="Trang đầu"
                            style={btnStyle}
                        >
                            <i className="fas fa-angle-double-left"></i>
                        </button>
                    </li>

                    {/* Nút Trang trước */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            title="Trang trước"
                            style={btnStyle}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    </li>

                    {/* Dấu ... nếu cần ở đầu */}
                    {pageNumbers[0] > 1 && (
                        <li className="page-item disabled">
                            <span className="page-link" style={btnStyle}>...</span>
                        </li>
                    )}

                    {/* Các nút số trang */}
                    {pageNumbers.map((pageNum) => (
                        <li
                            key={pageNum}
                            className={`page-item ${pageNum === currentPage ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageChange(pageNum)}
                                style={{
                                    ...btnStyle,
                                    ...(pageNum === currentPage ? activeBtnStyle : {})
                                }}
                            >
                                {pageNum}
                            </button>
                        </li>
                    ))}

                    {/* Dấu ... nếu cần ở cuối */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <li className="page-item disabled">
                            <span className="page-link" style={btnStyle}>...</span>
                        </li>
                    )}

                    {/* Nút Trang sau */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            title="Trang sau"
                            style={btnStyle}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </li>

                    {/* Nút Trang cuối */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            title="Trang cuối"
                            style={btnStyle}
                        >
                            <i className="fas fa-angle-double-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

// Inline styles cho nút phân trang
const btnStyle = {
    borderRadius: '8px',
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #dee2e6',
    color: '#495057',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
};

const activeBtnStyle = {
    backgroundColor: '#005088',
    borderColor: '#005088',
    color: '#fff',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0, 80, 136, 0.25)'
};

export default Pagination;
