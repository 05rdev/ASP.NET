/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoriesProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Kết nối vào Controller
        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu từ bảng CategoryProducts trong SQL
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }
    }
}
