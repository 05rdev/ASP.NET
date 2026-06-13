import React from 'react';

function Footer() {
    return (
        <footer className="main-footer-wrapper bg-dark text-light pt-5 mt-5">
            {/* PHẦN 1: KHU VỰC THÔNG TIN CHÍNH (3 CỘT LƯỚI ĐƠN GIẢN) */}
            <div className="container pb-4">
                <div className="row">

                    {/* Cột 1: Giới thiệu ngắn gọn về thương hiệu */}
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h4 className="font-weight-bold mb-3" style={{ color: '#11CAA0', letterSpacing: '1px' }}>
                            VanDinhCMS<span className="text-white">.Fashion</span>
                        </h4>
                        <p className="text-muted text-justify" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            Hệ thống thời trang cao cấp dẫn đầu xu hướng. Chúng tôi cam kết mang đến những sản phẩm premium chất lượng cao, định hình phong cách thời thượng cho bạn.
                        </p>
                    </div>

                    {/* Cột 2: Các đường liên kết tĩnh hệ thống Chính sách */}
                    <div className="col-md-4 mb-4 mb-md-0 pl-md-5">
                        <h5 className="font-weight-bold mb-3 text-uppercase border-left pl-2" style={{ borderLeftColor: '#11CAA0', borderLeftWidth: '3px' }}>
                            Chính Sách
                        </h5>
                        <ul className="list-unstyled" style={{ fontSize: '14px' }}>
                            <li className="mb-2">
                                <a href="/policy/delivery" className="text-muted text-decoration-none" onMouseOver={(e) => e.target.style.color = '#11CAA0'} onMouseOut={(e) => e.target.style.color = '#6c757d'}>
                                    <i className="fas fa-chevron-right mr-2" style={{ fontSize: '10px' }}></i>Chính sách giao hàng
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/policy/exchange" className="text-muted text-decoration-none" onMouseOver={(e) => e.target.style.color = '#11CAA0'} onMouseOut={(e) => e.target.style.color = '#6c757d'}>
                                    <i className="fas fa-chevron-right mr-2" style={{ fontSize: '10px' }}></i>Chính sách đổi trả 1-1
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/policy/privacy" className="text-muted text-decoration-none" onMouseOver={(e) => e.target.style.color = '#11CAA0'} onMouseOut={(e) => e.target.style.color = '#6c757d'}>
                                    <i className="fas fa-chevron-right mr-2" style={{ fontSize: '10px' }}></i>Bảo mật thông tin
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Thông tin liên hệ cửa hàng */}
                    <div className="col-md-4">
                        <h5 className="font-weight-bold mb-3 text-uppercase border-left pl-2" style={{ borderLeftColor: '#11CAA0', borderLeftWidth: '3px' }}>
                            Liên Hệ
                        </h5>
                        <ul className="list-unstyled text-muted" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                            <li className="mb-2 d-flex align-items-start">
                                <i className="fas fa-map-marker-alt mr-2 mt-1 text-info"></i>
                                <span>Khu công nghệ cao, Võ Chí Công, Quận 9, Hồ Chí Minh</span>
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-phone-alt mr-2 text-info"></i> Hotline: 090x.xxx.xxx
                            </li>
                            <li className="mb-2">
                                <i className="fas fa-envelope mr-2 text-info"></i> support@vandinhcms.retail
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* PHẦN 2: THANH BẢN QUYỀN (COPYRIGHT BAR) */}
            <div className="copyright-bar py-3 mt-4" style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #2d2d2d' }}>
                <div className="container text-center">
                    <p className="m-0 text-muted" style={{ fontSize: '13px' }}>
                        &copy; {new Date().getFullYear()} <strong style={{ color: '#11CAA0' }}>VanDinhCMS Retail</strong>. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
