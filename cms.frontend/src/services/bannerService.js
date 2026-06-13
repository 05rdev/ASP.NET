// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const bannerService = {
    /**
     * 1. Lấy danh sách toàn bộ banner đang kích hoạt từ Backend
     * API Endpoint: GET https://localhost:xxxx/api/Banners
     */
    getActiveBanners: async () => {
        try {
            const response = await axiosClient.get('/Banners');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getActiveBanners:", error);
            throw error;
        }
    }
};

export default bannerService;
