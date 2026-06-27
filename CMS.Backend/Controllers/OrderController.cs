/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version: 1.2
 */
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public OrderController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // 1. Index: Hiển thị danh sách toàn bộ đơn hàng
        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            var query = _context.Orders
                               .Include(o => o.Customer)
                               .OrderByDescending(o => o.OrderDate);
            int totalItems = query.Count();
            var data = query
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)System.Math.Ceiling((double)totalItems / pageSize);
            ViewBag.TotalItems = totalItems;

            return View(data);
        }

        // 2. Details: Xem chi tiết một đơn hàng cùng với danh sách sản phẩm đã đặt
        public IActionResult Details(int id)
        {
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

        // 3. Create (GET): Hiển thị form tạo đơn hàng thủ công (nếu cần)
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        // 4. Create (POST): Xử lý lưu đơn hàng mới thủ công
        [HttpPost]
        public IActionResult Create(Order model)
        {
            if (ModelState.IsValid)
            {
                model.OrderDate = DateTime.Now;
                _context.Orders.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CustomerId = new SelectList(_context.Customers, "Id", "FullName", model.CustomerId);
            return View(model);
        }

        // 5. Edit (GET): Lấy đơn hàng để sửa trạng thái hoặc ghi chú
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders
                                .Include(o => o.Customer)
                                .FirstOrDefault(o => o.Id == id);
            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // 6. Edit (POST): Cập nhật thông tin trạng thái & ghi chú đơn hàng
        [HttpPost]
        public async Task<IActionResult> Edit(Order model)
        {
            var existingOrder = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == model.Id);

            if (existingOrder == null)
            {
                return NotFound();
            }

            int oldStatus = existingOrder.Status;

            // Chỉ cho phép sửa đổi trạng thái và ghi chú từ màn hình quản lý đơn hàng
            existingOrder.Status = model.Status;
            existingOrder.Notes = model.Notes;

            _context.Orders.Update(existingOrder);
            await _context.SaveChangesAsync();

            // Nếu trạng thái thay đổi, gửi email thông báo cho khách hàng
            if (oldStatus != model.Status)
            {
                try
                {
                    if (existingOrder.Customer != null && !string.IsNullOrEmpty(existingOrder.Customer.Email))
                    {
                        decimal totalAmount = existingOrder.OrderDetails != null ? existingOrder.OrderDetails.Sum(od => od.UnitPrice * od.Quantity) : 0;
                        await _emailService.SendOrderStatusUpdateEmail(
                            toEmail: existingOrder.Customer.Email,
                            customerName: existingOrder.Customer.FullName,
                            orderId: existingOrder.Id,
                            status: existingOrder.Status,
                            totalAmount: totalAmount
                        );
                    }
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"[EMAIL ERROR] Không thể gửi Email thông báo cập nhật trạng thái: {emailEx.Message}");
                }
            }

            return RedirectToAction("Index");
        }

        // 7. Delete: Xóa một đơn hàng (và các chi tiết đơn hàng tương ứng)
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                // Xóa chi tiết đơn hàng trước để tránh lỗi ràng buộc khóa ngoại (Cascading Delete)
                var details = _context.OrderDetails.Where(od => od.OrderId == id).ToList();
                if (details.Any())
                {
                    _context.OrderDetails.RemoveRange(details);
                }

                _context.Orders.Remove(order);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
