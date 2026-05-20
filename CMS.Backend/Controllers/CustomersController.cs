/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomersController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Kết nối vào Controller
        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu từ bảng Customers trong SQL
            var data = _context.Customers.ToList();
            return View(data);
        }
    }
}
