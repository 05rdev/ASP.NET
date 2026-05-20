/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User
using Microsoft.AspNetCore.Mvc;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Hàm Index: Hiển thị danh sách thành viên quản trị
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Users trong SQL
            var data = _context.Users.ToList();
            return View(data);
        }
    }
}
