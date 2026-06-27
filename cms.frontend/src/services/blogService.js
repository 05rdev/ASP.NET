import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết
    getAllPosts: (params = {}) => {
        const url = '/Posts'; 
        return axiosClient.get(url, { params });
    },

    // 2. BÀI TẬP TỰ LÀM: Thêm hàm lấy danh sách Chuyên mục tin tức (Category)
    getBlogCategories: () => {
        const url = '/Categories'; // Cần khớp chính xác với [Route("api/Categories")] trong CategoriesController ở Backend
        return axiosClient.get(url);
    },

    // 3. Lấy danh sách bài viết theo chuyên mục (Category)
    // Gọi đến endpoint: GET /api/Posts/category/{categoryId} trong PostsController
    getPostsByCategory: (categoryId, params = {}) => {
        const url = `/Posts/category/${categoryId}`;
        return axiosClient.get(url, { params });
    }
};

export default blogService;
