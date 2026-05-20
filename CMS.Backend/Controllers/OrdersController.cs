/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.1
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // <--- Bắt buộc phải thêm dòng này để dùng được .Include
using CMS.Data.Entities;
namespace CMS.Backend.Controllers
{
    public class OrdersController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Kết nối vào Controller
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu từ bảng Orders đồng thời JOIN sang bảng Customers để lấy thông tin khách hàng
            var data = _context.Orders
                               .Include(o => o.Customer)
                               .ToList();

            return View(data);
        }
        public IActionResult Details(int id)
        {

            // Tìm đơn hàng theo ID, đồng thời nạp kèm Khách hàng (Customer) 
            // và danh sách chi tiết (OrderDetails) chứa thông tin Sản phẩm (Product)
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }
    }
}