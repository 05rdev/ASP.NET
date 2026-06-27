import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import authService from '../../services/authService';

const IMAGE_BASE_URL = "https://localhost:7125";

function Profile() {
    const navigate = useNavigate();
    const customer = authService.getCustomer();

    // States
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'orders'
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [orders, setOrders] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });
    const [updating, setUpdating] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!customer) {
            navigate('/login');
        } else {
            fetchProfile();
            fetchOrderHistory();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            setLoadingProfile(true);
            const data = await authService.getProfile(customer.id);
            setProfileData({
                fullName: data.fullName || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                password: '' // Keep password empty for security
            });
        } catch (error) {
            console.error('Lỗi tải thông tin cá nhân:', error);
            setAlertMessage({ type: 'danger', text: 'Không thể tải thông tin cá nhân từ máy chủ.' });
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchOrderHistory = async () => {
        try {
            setLoadingOrders(true);
            const data = await authService.getCustomerOrders(customer.id);
            setOrders(data || []);
        } catch (error) {
            console.error('Lỗi tải lịch sử mua hàng:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profileData.fullName.trim() || !profileData.email.trim()) {
            setAlertMessage({ type: 'warning', text: 'Họ tên và Email không được để trống.' });
            return;
        }

        try {
            setUpdating(true);
            setAlertMessage({ type: '', text: '' });
            const response = await authService.updateProfile(customer.id, {
                fullName: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
                address: profileData.address,
                password: profileData.password || null
            });

            // Update localStorage
            authService.saveCustomer({
                id: response.id,
                fullName: response.fullName,
                email: response.email,
                phone: response.phone,
                address: response.address
            });

            setAlertMessage({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
            setProfileData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            const errMsg = error.response?.data?.message || 'Có lỗi xảy ra trong quá trình cập nhật.';
            setAlertMessage({ type: 'danger', text: errMsg });
        } finally {
            setUpdating(false);
        }
    };

    // Helper for Status Badge
    const renderStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="badge badge-warning text-white px-3 py-2 rounded-pill bg-warning"><i className="fas fa-clock mr-1"></i> Chờ duyệt</span>;
            case 1:
                return <span className="badge badge-primary px-3 py-2 rounded-pill bg-primary"><i className="fas fa-truck mr-1"></i> Đang giao</span>;
            case 2:
                return <span className="badge badge-success px-3 py-2 rounded-pill bg-success"><i className="fas fa-check-circle mr-1"></i> Hoàn thành</span>;
            default:
                return <span className="badge badge-secondary px-3 py-2 rounded-pill bg-secondary">Không rõ</span>;
        }
    };

    if (!customer) return null;

    return (
        <div className="profile-page-wrapper min-vh-100 bg-light">
            <Header />

            <div className="container py-5">
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm rounded-lg overflow-hidden">
                            {/* Card Header with User Summary */}
                            <div className="card-header border-0 bg-dark py-4 text-center text-white position-relative">
                                <div className="avatar-wrapper mb-3 d-inline-block position-relative">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white font-weight-bold shadow"
                                         style={{ width: '80px', height: '80px', fontSize: '32px', margin: '0 auto' }}>
                                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </div>
                                <h5 className="font-weight-bold mb-1">{profileData.fullName || 'Khách hàng'}</h5>
                                <span className="badge bg-success text-white px-2 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                                    Thành viên VIP
                                </span>
                            </div>

                            {/* Sidebar Menu */}
                            <div className="card-body p-0">
                                <div className="list-group list-group-flush" id="profile-tabs" role="tablist">
                                    <button
                                        onClick={() => { setActiveTab('info'); setAlertMessage({ type: '', text: '' }); }}
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center ${activeTab === 'info' ? 'active text-white' : 'text-dark bg-white'}`}
                                        style={activeTab === 'info' ? { backgroundColor: '#005088' } : {}}
                                    >
                                        <i className="fas fa-user-edit mr-3" style={{ fontSize: '18px' }}></i>
                                        <span>Thông tin cá nhân</span>
                                        <i className="fas fa-chevron-right ml-auto" style={{ fontSize: '12px', opacity: 0.5 }}></i>
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('orders'); setAlertMessage({ type: '', text: '' }); }}
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center ${activeTab === 'orders' ? 'active text-white' : 'text-dark bg-white'}`}
                                        style={activeTab === 'orders' ? { backgroundColor: '#005088' } : {}}
                                    >
                                        <i className="fas fa-history mr-3" style={{ fontSize: '18px' }}></i>
                                        <span>Lịch sử mua hàng</span>
                                        <span className="badge badge-pill badge-info bg-info text-white ml-2 px-2 py-1">{orders.length}</span>
                                        <i className="fas fa-chevron-right ml-auto" style={{ fontSize: '12px', opacity: 0.5 }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-lg p-4 bg-white min-vh-50">
                            {/* Alerts */}
                            {alertMessage.text && (
                                <div className={`alert alert-${alertMessage.type} alert-dismissible fade show rounded-lg shadow-sm border-0`} role="alert">
                                    <i className={`fas ${alertMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                                    {alertMessage.text}
                                    <button type="button" className="close" onClick={() => setAlertMessage({ type: '', text: '' })} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            )}

                            {/* Tab 1: Profile Info */}
                            {activeTab === 'info' && (
                                <div>
                                    <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
                                        <h4 className="font-weight-bold text-dark mb-0">
                                            <i className="fas fa-user-circle mr-2 text-primary"></i>Thông Tin Cá Nhân
                                        </h4>
                                        <button onClick={fetchProfile} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                            <i className="fas fa-sync mr-1"></i> Làm mới
                                        </button>
                                    </div>

                                    {loadingProfile ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Đang tải...</span>
                                            </div>
                                            <p className="text-muted mt-2">Đang tải thông tin cá nhân...</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="row">
                                                <div className="col-md-6 form-group mb-3">
                                                    <label className="font-weight-bold text-secondary small">Họ và Tên <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={profileData.fullName}
                                                        onChange={handleInputChange}
                                                        className="form-control rounded-lg shadow-sm-hover border-secondary-light py-2"
                                                        placeholder="Nhập họ và tên"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 form-group mb-3">
                                                    <label className="font-weight-bold text-secondary small">Email <span className="text-danger">*</span></label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={profileData.email}
                                                        onChange={handleInputChange}
                                                        className="form-control rounded-lg border-secondary-light py-2"
                                                        placeholder="example@mail.com"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 form-group mb-3">
                                                    <label className="font-weight-bold text-secondary small">Số Điện Thoại</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={profileData.phone}
                                                        onChange={handleInputChange}
                                                        className="form-control rounded-lg border-secondary-light py-2"
                                                        placeholder="Nhập số điện thoại"
                                                    />
                                                </div>

                                                <div className="col-md-6 form-group mb-3">
                                                    <label className="font-weight-bold text-secondary small">Mật Khẩu Mới (để trống nếu giữ nguyên)</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={profileData.password}
                                                        onChange={handleInputChange}
                                                        className="form-control rounded-lg border-secondary-light py-2"
                                                        placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                                                    />
                                                </div>

                                                <div className="col-12 form-group mb-4">
                                                    <label className="font-weight-bold text-secondary small">Địa Chỉ Giao Hàng</label>
                                                    <textarea
                                                        name="address"
                                                        value={profileData.address}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className="form-control rounded-lg border-secondary-light py-2"
                                                        placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={updating}
                                                className="btn btn-primary px-5 py-2.5 rounded-pill shadow-sm"
                                                style={{ backgroundColor: '#005088', borderColor: '#005088' }}
                                            >
                                                {updating ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                        Đang cập nhật...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save mr-2"></i> Lưu Thay Đổi
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Tab 2: Order History */}
                            {activeTab === 'orders' && (
                                <div>
                                    <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
                                        <h4 className="font-weight-bold text-dark mb-0">
                                            <i className="fas fa-receipt mr-2 text-primary"></i>Lịch Sử Mua Hàng
                                        </h4>
                                        <button onClick={fetchOrderHistory} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                            <i className="fas fa-sync mr-1"></i> Làm mới
                                        </button>
                                    </div>

                                    {loadingOrders ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Đang tải...</span>
                                            </div>
                                            <p className="text-muted mt-2">Đang tải lịch sử mua hàng...</p>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-5 bg-light rounded-lg border">
                                            <i className="fas fa-box-open text-muted display-4 mb-3" style={{ opacity: 0.5 }}></i>
                                            <h5 className="font-weight-bold text-secondary">Bạn chưa có đơn đặt hàng nào</h5>
                                            <p className="text-muted">Hãy ghé thăm cửa hàng của chúng tôi để chọn những sản phẩm ưng ý nhất!</p>
                                            <a href="/shop" className="btn btn-primary btn-sm rounded-pill px-4 mt-2" style={{ backgroundColor: '#005088' }}>
                                                Mua Sắm Ngay
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="orders-timeline">
                                            {orders.map((order) => (
                                                <div key={order.id} className="card border-secondary-light shadow-sm rounded-lg mb-4 overflow-hidden">
                                                    {/* Order Header */}
                                                    <div className="card-header bg-light py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom">
                                                        <div>
                                                            <span className="font-weight-bold text-dark d-block">Mã đơn hàng: #{order.id}</span>
                                                            <span className="text-muted small">
                                                                <i className="far fa-calendar-alt mr-1"></i> 
                                                                {new Date(order.orderDate).toLocaleString('vi-VN')}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 mt-md-0 d-flex align-items-center justify-content-between">
                                                            {renderStatusBadge(order.status)}
                                                        </div>
                                                    </div>

                                                    {/* Order Body (Items List) */}
                                                    <div className="card-body p-0">
                                                        <div className="table-responsive">
                                                            <table className="table table-hover align-middle mb-0" style={{ minWidth: '500px' }}>
                                                                <thead className="bg-white" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                    <tr>
                                                                        <th className="pl-4 py-2 border-0" style={{ width: '80px' }}>Ảnh</th>
                                                                        <th className="py-2 border-0">Sản phẩm</th>
                                                                        <th className="py-2 border-0 text-center" style={{ width: '80px' }}>SL</th>
                                                                        <th className="py-2 border-0 text-right" style={{ width: '120px' }}>Giá</th>
                                                                        <th className="pr-4 py-2 border-0 text-right" style={{ width: '130px' }}>Thành tiền</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order.items.map((item, idx) => (
                                                                        <tr key={idx}>
                                                                            <td className="pl-4 py-3 align-middle">
                                                                                <div className="border rounded bg-white d-flex align-items-center justify-content-center" 
                                                                                     style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
                                                                                    {item.productImage ? (
                                                                                        <img src={item.productImage.startsWith('http') ? item.productImage : IMAGE_BASE_URL + item.productImage} alt={item.productName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                                                    ) : (
                                                                                        <i className="fas fa-box text-muted" style={{ fontSize: '18px' }}></i>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-3 align-middle">
                                                                                <span className="font-weight-bold text-dark d-block text-truncate" style={{ maxWidth: '240px' }} title={item.productName}>
                                                                                    {item.productName}
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-3 text-center align-middle font-weight-medium text-dark">{item.quantity}</td>
                                                                            <td className="py-3 text-right align-middle text-secondary">{item.unitPrice.toLocaleString('vi-VN')} đ</td>
                                                                            <td className="pr-4 py-3 text-right align-middle font-weight-bold text-dark">
                                                                                {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    {/* Order Footer */}
                                                    <div className="card-footer bg-white py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center border-top">
                                                        <div className="order-notes mb-2 mb-md-0">
                                                            {order.notes && (
                                                                <small className="text-muted italic d-block">
                                                                    <strong>Ghi chú:</strong> "{order.notes}"
                                                                </small>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-muted mr-2" style={{ fontSize: '14px' }}>Tổng cộng:</span>
                                                            <span className="font-weight-bold text-danger" style={{ fontSize: '20px' }}>
                                                                {order.totalAmount.toLocaleString('vi-VN')} đ
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
