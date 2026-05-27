/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using CMS.Data.Entities;
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

        // 1. Hàm GET: Hiển thị giao diện Form thêm khách hàng
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Đón dữ liệu từ Form và lưu vào database
        [HttpPost]
        public IActionResult Create(Customer model)
        {
            // Kiểm tra trùng Email
            var checkExist = _context.Customers.Any(c => c.Email == model.Email);
            if (checkExist)
            {
                ModelState.AddModelError("Email", "Email này đã tồn tại trong hệ thống!");
                return View(model);
            }

            _context.Customers.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Lấy thông tin khách hàng cũ để sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            return View(customer);
        }

        // 2. Hàm POST: Cập nhật thông tin khách hàng mới
        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            _context.Customers.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Action xóa khách hàng
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
