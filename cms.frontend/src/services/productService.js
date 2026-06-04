import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách quần áo, váy dạ hội
    getAllProducts: () => {
        const url = '/Products'; // Phải khớp chính xác với Router trong ProductsController phía Backend
        return axiosClient.get(url);
    },
    getProductsByCategory: (categoryId) => {
        const url = `/Products/categoryproduct/${categoryId}`;
        return axiosClient.get(url);
    }
};

export default productService;
