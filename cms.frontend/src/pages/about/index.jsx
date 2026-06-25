// src/pages/about/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Dữ liệu thành viên đội ngũ
const TEAM = [
    {
        name: 'Huỳnh Văn Định',
        role: 'Founder & Full-Stack Developer',
        mssv: 'MSSV: 2123110052',
        avatar: 'https://ui-avatars.com/api/?name=Huynh+Van+Dinh&size=120&background=005088&color=fff&bold=true&rounded=true',
        desc: 'Xây dựng toàn bộ hệ thống CMS từ Backend ASP.NET Core đến Frontend React, tích hợp AI và quản lý cơ sở dữ liệu SQL Server.'
    }
];

// Thống kê
const STATS = [
    { icon: 'fas fa-tshirt', value: '500+', label: 'Sản phẩm công nghệ' },
    { icon: 'fas fa-users', value: '1.200+', label: 'Khách hàng tin tưởng' },
    { icon: 'fas fa-shopping-bag', value: '3.500+', label: 'Đơn hàng đã giao' },
    { icon: 'fas fa-star', value: '4.8/5', label: 'Điểm đánh giá trung bình' },
];

// Giá trị cốt lõi
const VALUES = [
    {
        icon: 'fas fa-gem',
        color: '#005088',
        title: 'Chất lượng cao cấp',
        desc: 'Mọi sản phẩm đều được tuyển chọn kỹ lưỡng từ các nhà sản xuất uy tín trong và ngoài nước, đảm bảo tiêu chuẩn chất lượng cao nhất.'
    },
    {
        icon: 'fas fa-leaf',
        color: '#11CAA0',
        title: 'Bền vững & Thân thiện',
        desc: 'Chúng tôi ưu tiên các chất liệu thân thiện với môi trường, đóng gói tái chế và quy trình sản xuất có trách nhiệm xã hội.'
    },
    {
        icon: 'fas fa-heart',
        color: '#e74c3c',
        title: 'Tận tâm khách hàng',
        desc: 'Đội ngũ hỗ trợ 24/7, chính sách đổi trả 30 ngày, giao hàng nhanh toàn quốc và tư vấn phong cách miễn phí.'
    },
    {
        icon: 'fas fa-bolt',
        color: '#f39c12',
        title: 'Đổi mới liên tục',
        desc: 'Luôn cập nhật xu hướng công nghệ quốc tế, ứng dụng công nghệ AI gợi ý phong cách và trải nghiệm mua sắm thông minh.'
    },
];

function About() {
    return (
        <div className="about-page-wrapper">
            <Header />

            {/* Banner đầu trang Giới thiệu - Đồng bộ với các trang khác */}
            <div className="about-banner bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Về Chúng Tôi</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>GIỚI THIỆU VỀ CHÚNG TÔI</h2>
                </div>
            </div>

            {/* ── THỐNG KÊ ── */}
            <section style={{ background: '#fff', padding: '0', marginTop: '-1px' }}>
                <div className="container">
                    <div className="row" style={{ margin: '0' }}>
                        {STATS.map((s, i) => (
                            <div key={i} className="col-6 col-md-3" style={{
                                padding: '32px 24px',
                                borderRight: i < 3 ? '1px solid #f0f0f0' : 'none',
                                textAlign: 'center'
                            }}>
                                <i className={s.icon} style={{ fontSize: '28px', color: '#11CAA0', marginBottom: '12px', display: 'block' }}></i>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#005088', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CÂU CHUYỆN ── */}
            <section id="our-story" style={{ background: '#f8f9fa', padding: '80px 0' }}>
                <div className="container">
                    <div className="row align-items-center">
                        {/* Hình ảnh */}
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
                                    alt="VanDinhCMS GMGear Store"
                                    style={{
                                        width: '100%', borderRadius: '20px',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                                    }}
                                />
                                {/* Badge overlay */}
                                <div style={{
                                    position: 'absolute', bottom: '-20px', right: '-20px',
                                    background: '#11CAA0', color: '#fff',
                                    borderRadius: '16px', padding: '16px 24px',
                                    boxShadow: '0 8px 24px rgba(17,202,160,0.4)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: 800 }}>2024</div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Năm thành lập</div>
                                </div>
                            </div>
                        </div>

                        {/* Nội dung */}
                        <div className="col-lg-7 pl-lg-5">
                            <span style={{
                                color: '#11CAA0', fontWeight: 700, fontSize: '13px',
                                textTransform: 'uppercase', letterSpacing: '2px'
                            }}>
                                ── Câu chuyện của chúng tôi
                            </span>
                            <h2 style={{
                                fontSize: '36px', fontWeight: 800, color: '#1a1a2e',
                                margin: '16px 0 24px', lineHeight: 1.3
                            }}>
                                Từ đam mê công nghệ<br />đến hệ thống CMS hiện đại
                            </h2>
                            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '16px', marginBottom: '20px' }}>
                                <strong>V.DinhCMS.GMGear</strong> được ra đời từ dự án thực tập sinh viên với mục tiêu xây dựng
                                một nền tảng thương mại điện tử công nghệ hoàn chỉnh — từ hệ thống quản trị nội dung
                                (CMS) đến giao diện mua sắm dành cho khách hàng cuối.
                            </p>
                            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '16px', marginBottom: '20px' }}>
                                Hệ thống được xây dựng trên nền tảng <strong>ASP.NET Core + Entity Framework Core</strong>
                                cho Backend, <strong>React.js</strong> cho Frontend và <strong>SQL Server</strong> làm cơ sở dữ liệu.
                                Tích hợp thêm công nghệ <strong>AI (Ollama)</strong> để hỗ trợ tìm kiếm sản phẩm thông minh.
                            </p>
                            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '16px' }}>
                                Sứ mệnh của chúng tôi: Mang đến trải nghiệm mua sắm công nghệ cao cấp,
                                tiện lợi và cá nhân hóa cho mọi khách hàng Việt Nam.
                            </p>
                            <div className="mt-4 d-flex flex-wrap" style={{ gap: '12px' }}>
                                {['ASP.NET Core', 'React.js', 'SQL Server', 'AI / Ollama', 'Entity Framework'].map(tag => (
                                    <span key={tag} style={{
                                        background: '#e8f4fd', color: '#005088',
                                        padding: '6px 14px', borderRadius: '20px',
                                        fontSize: '13px', fontWeight: 600
                                    }}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GIÁ TRỊ CỐT LÕI ── */}
            <section style={{ background: '#fff', padding: '80px 0' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span style={{ color: '#11CAA0', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            ── Triết lý kinh doanh
                        </span>
                        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a2e', marginTop: '12px' }}>
                            Giá trị cốt lõi của chúng tôi
                        </h2>
                    </div>
                    <div className="row">
                        {VALUES.map((v, i) => (
                            <div key={i} className="col-md-6 col-lg-3 mb-4">
                                <div style={{
                                    background: '#f8f9fa', borderRadius: '20px',
                                    padding: '32px 24px', height: '100%',
                                    border: '1px solid #eee',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: v.color + '15', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <i className={v.icon} style={{ fontSize: '24px', color: v.color }}></i>
                                    </div>
                                    <h5 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>{v.title}</h5>
                                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ĐỘI NGŨ ── */}
            <section style={{ background: '#f8f9fa', padding: '80px 0' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span style={{ color: '#11CAA0', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            ── Con người
                        </span>
                        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a2e', marginTop: '12px' }}>
                            Đội ngũ phát triển
                        </h2>
                    </div>
                    <div className="row justify-content-center">
                        {TEAM.map((member, i) => (
                            <div key={i} className="col-md-6 col-lg-4 mb-4">
                                <div style={{
                                    background: '#fff', borderRadius: '20px',
                                    padding: '36px 28px', textAlign: 'center',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                    border: '1px solid #f0f0f0'
                                }}>
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        style={{
                                            width: '90px', height: '90px',
                                            borderRadius: '50%', marginBottom: '20px',
                                            border: '3px solid #11CAA0'
                                        }}
                                    />
                                    <h5 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: '4px' }}>{member.name}</h5>
                                    <p style={{ color: '#11CAA0', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{member.role}</p>
                                    <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '16px' }}>{member.mssv}</p>
                                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>{member.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
}

export default About;
