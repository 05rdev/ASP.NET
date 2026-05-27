/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.1
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // <--- Bắt buộc phải thêm dòng này để dùng được .Include
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc.Rendering;

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

        // 1. Hàm GET: Hiển thị giao diện Form thêm đơn hàng mới
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        // 2. Hàm POST: Thêm đơn hàng mới vào cơ sở dữ liệu
        [HttpPost]
        public IActionResult Create(Order model)
        {
            // Thêm vào bộ nhớ tạm
            _context.Orders.Add(model);
            
            // Lưu thật sự vào SQL
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Hiển thị Form kèm dữ liệu cũ của Đơn hàng để sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        // 2. Hàm POST: Lưu thay đổi thông tin đơn hàng
        [HttpPost]
        public IActionResult Edit(Order model)
        {
            _context.Orders.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Action xóa đơn hàng
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}