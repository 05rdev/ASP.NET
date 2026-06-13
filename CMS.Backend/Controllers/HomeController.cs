/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thư mục chứa DbContext
using CMS.Backend.Models;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var now = DateTime.Now;

        // Thống kê tổng quan
        var vm = new DashboardViewModel
        {
            TotalProducts = _context.Products.Count(),
            TotalOrders = _context.Orders.Count(),
            TotalCustomers = _context.Customers.Count(),
            TotalPosts = _context.Posts.Count(),
            TotalCategories = _context.Categories.Count(),
            TotalCategoryProducts = _context.CategoriesProducts.Count(),
            TotalUsers = _context.Users.Count(),
        };

        // Doanh thu tổng (tính từ đơn đã hoàn thành - Status = 2)
        vm.TotalRevenue = _context.OrderDetails
            .Include(od => od.Order)
            .Where(od => od.Order != null && od.Order.Status == 2)
            .Sum(od => od.Quantity * od.UnitPrice);

        // Thống kê đơn hàng theo trạng thái
        vm.OrdersPending = _context.Orders.Count(o => o.Status == 0);
        vm.OrdersShipping = _context.Orders.Count(o => o.Status == 1);
        vm.OrdersCompleted = _context.Orders.Count(o => o.Status == 2);

        // LINQ: Lấy 5 bài viết mới nhất
        vm.LatestPosts = _context.Posts
            .Include(p => p.Category) // Lấy kèm tên danh mục để hiển thị 
            .OrderByDescending(p => p.CreatedDate) // Sắp xếp ngày mới nhất lên đầu 
            .Take(5)
            .ToList();

        // LINQ: Lấy 5 đơn hàng mới nhất
        vm.LatestOrders = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails)
            .OrderByDescending(o => o.OrderDate)
            .Take(5)
            .ToList();

        // LINQ: Top 5 sản phẩm bán chạy
        vm.TopProducts = _context.OrderDetails
            .Include(od => od.Product)
            .Where(od => od.Product != null)
            .GroupBy(od => new { od.ProductId, od.Product!.Name, od.Product.ImageUrl, od.Product.Price })
            .Select(g => new TopProductInfo
            {
                ProductName = g.Key.Name,
                ImageUrl = g.Key.ImageUrl,
                Price = g.Key.Price,
                TotalSold = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.Quantity * x.UnitPrice)
            })
            .OrderByDescending(x => x.TotalSold)
            .Take(5)
            .ToList();

        // LINQ: Doanh thu 7 ngày gần nhất
        var sevenDaysAgo = now.Date.AddDays(-6);
        var revenueData = _context.OrderDetails
            .Include(od => od.Order)
            .Where(od => od.Order != null && od.Order.OrderDate >= sevenDaysAgo)
            .ToList() // Chuyển sang client-side để xử lý GroupBy
            .GroupBy(od => od.Order!.OrderDate.Date)
            .Select(g => new DailyRevenueInfo
            {
                Date = g.Key.ToString("dd/MM"),
                Revenue = g.Sum(x => x.Quantity * x.UnitPrice),
                OrderCount = g.Select(x => x.OrderId).Distinct().Count()
            })
            .OrderBy(x => x.Date)
            .ToList();

        // Đảm bảo đủ 7 ngày (điền 0 cho ngày không có doanh thu)
        for (int i = 0; i < 7; i++)
        {
            var date = sevenDaysAgo.AddDays(i).ToString("dd/MM");
            if (!revenueData.Any(r => r.Date == date))
            {
                revenueData.Add(new DailyRevenueInfo { Date = date, Revenue = 0, OrderCount = 0 });
            }
        }
        vm.DailyRevenues = revenueData.OrderBy(r => r.Date).ToList();

        return View(vm);
    }
}
