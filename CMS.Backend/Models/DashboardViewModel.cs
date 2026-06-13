/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data.Entities;

namespace CMS.Backend.Models
{
    public class DashboardViewModel
    {
        // Thống kê tổng quan
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalPosts { get; set; }
        public int TotalCategories { get; set; }
        public int TotalCategoryProducts { get; set; }
        public int TotalUsers { get; set; }

        // Doanh thu
        public decimal TotalRevenue { get; set; }

        // Thống kê đơn hàng theo trạng thái
        public int OrdersPending { get; set; }   // Chờ duyệt
        public int OrdersShipping { get; set; }  // Đang giao
        public int OrdersCompleted { get; set; } // Đã xong

        // Bài viết mới nhất
        public List<Post> LatestPosts { get; set; } = new();

        // Đơn hàng mới nhất
        public List<Order> LatestOrders { get; set; } = new();

        // Sản phẩm bán chạy (top sản phẩm có nhiều đơn nhất)
        public List<TopProductInfo> TopProducts { get; set; } = new();

        // Doanh thu 7 ngày gần nhất (cho biểu đồ)
        public List<DailyRevenueInfo> DailyRevenues { get; set; } = new();
    }

    public class TopProductInfo
    {
        public string ProductName { get; set; } = "";
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class DailyRevenueInfo
    {
        public string Date { get; set; } = "";
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }
}
