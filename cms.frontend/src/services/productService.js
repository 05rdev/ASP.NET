// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';


const productService = {
    /**
         * 1. Lấy danh sách toàn bộ sản phẩm công nghệ (hoặc theo bộ lọc)
         * API Endpoint: GET https://localhost:xxxx/api/Products
    */


    getAllProducts: async (filters = {}) => { // Nhận thêm tham số filters
        try {
            // Truyền filters vào mục params để Axios tự băm thành Query String (?categoryId=1...)
            const response = await axiosClient.get('/Products', { params: filters });
            return response;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            throw error;
        }
    },


    /**
     * 2. Lấy thông tin chi tiết của một sản phẩm theo ID
     * API Endpoint: GET https://localhost:xxxx/api/Products/{id}
     */
    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            throw error;
        }
    },

    getLatestProducts: async () => {
        try {
            const response = await axiosClient.get('/Products/latest');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getLatestProducts:", error);
            throw error;
        }
    },

    getHotProducts: async () => {
        try {
            const response = await axiosClient.get('/Products/hot');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getHotProducts:", error);
            throw error;
        }
    }
};


// CRITICAL: Xuất mặc định đối tượng này để file ProductGrid.jsx import vào không bị lỗi 'default was not found'
export default productService;
