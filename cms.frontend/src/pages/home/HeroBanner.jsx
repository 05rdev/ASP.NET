import React, { useState, useEffect } from 'react';
import bannerService from '../../services/bannerService';

const IMAGE_BASE_URL = "https://localhost:7125"; // backend URL

function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const data = await bannerService.getActiveBanners();
                setBanners(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách banner từ API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Tự động chuyển slide sau mỗi 5 giây
    useEffect(() => {
        if (banners.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    if (loading) {
        return (
            <div className="container my-4">
                <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ height: '350px' }}>
                    <div className="spinner-border text-info" role="status"></div>
                </div>
            </div>
        );
    }

    // Nếu không có banner nào trong DB, hiển thị banner mặc định đẹp mắt
    if (banners.length === 0) {
        return (
            <section className="hero-banner-wrapper my-4">
                <div className="container">
                    <div 
                        className="position-relative overflow-hidden rounded shadow-lg d-flex align-items-center"
                        style={{
                            height: '400px',
                            backgroundImage: 'linear-gradient(to right, rgba(0, 80, 136, 0.9), rgba(17, 202, 160, 0.4)), url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '16px'
                        }}
                    >
                        <div className="text-white p-5 col-lg-6">
                            <span className="badge badge-warning text-uppercase px-3 py-2 mb-3" style={{ fontSize: '12px', borderRadius: '4px' }}>BỘ SƯU TẬP MỚI HÈ 2026</span>
                            <h1 className="display-4 font-weight-bold mb-3" style={{ lineHeight: '1.2' }}>Thời Trang <br/>Thời Thượng</h1>
                            <p className="lead mb-4 text-light-50" style={{ fontSize: '16px' }}>Khám phá các thiết kế mới nhất mang phong cách thanh lịch, sang trọng giúp bạn luôn tự tin tỏa sáng mỗi ngày.</p>
                            <a href="/shop" className="btn btn-light btn-lg px-4 font-weight-bold" style={{ borderRadius: '30px', color: '#005088', transition: '0.3s' }}>Mua Ngay</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="hero-banner-wrapper my-4">
            <div className="container">
                <div 
                    className="position-relative overflow-hidden shadow-lg"
                    style={{
                        height: '400px',
                        borderRadius: '16px',
                        backgroundColor: '#000'
                    }}
                >
                    {/* Render slide hiện tại */}
                    {banners.map((banner, index) => {
                        const isCurrent = index === currentIndex;
                        return (
                            <div
                                key={banner.id}
                                className="w-100 h-100 position-absolute top-0 left-0 d-flex align-items-center"
                                style={{
                                    opacity: isCurrent ? 1 : 0,
                                    visibility: isCurrent ? 'visible' : 'hidden',
                                    transition: 'opacity 0.8s ease-in-out, visibility 0.8s',
                                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.1) 100%), url("${IMAGE_BASE_URL}${banner.imageUrl}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="text-white p-5 col-lg-6">
                                    <h1 className="display-4 font-weight-bold mb-3" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                                        {banner.title}
                                    </h1>
                                    <p className="lead mb-4 text-white-50" style={{ fontSize: '16px' }}>
                                        {banner.description}
                                    </p>
                                    <a 
                                        href={banner.linkUrl} 
                                        className="btn btn-primary btn-lg px-4 font-weight-bold" 
                                        style={{ 
                                            borderRadius: '30px', 
                                            backgroundColor: '#11CAA0', 
                                            borderColor: '#11CAA0', 
                                            transition: '0.3s' 
                                        }}
                                    >
                                        Khám Phá Ngay
                                    </a>
                                </div>
                            </div>
                        );
                    })}

                    {/* Nút chuyển slide (chỉ hiện khi có nhiều hơn 1 slide) */}
                    {banners.length > 1 && (
                        <>
                            <button 
                                className="btn position-absolute text-white border-0" 
                                style={{ top: '50%', left: '20px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', width: '45px', height: '45px' }}
                                onClick={handlePrev}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button 
                                className="btn position-absolute text-white border-0" 
                                style={{ top: '50%', right: '20px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', width: '45px', height: '45px' }}
                                onClick={handleNext}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>

                            {/* Dấu chấm chỉ số slide */}
                            <div className="position-absolute d-flex justify-content-center w-100" style={{ bottom: '20px', zIndex: 10 }}>
                                {banners.map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className="mx-1"
                                        style={{
                                            width: currentIndex === index ? '24px' : '8px',
                                            height: '8px',
                                            backgroundColor: '#fff',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            opacity: currentIndex === index ? 1 : 0.5,
                                            transition: '0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;
