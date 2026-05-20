/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Kết nối vào Controller
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu từ bảng Products trong SQL
            var data = _context.Products.ToList();
            return View(data);
        }
    }
}
