/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:2.0
 */
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý Đơn hàng thương mại điện tử
    /// Base URL: /api/Orders
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public OrdersController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// GET /api/Orders
        /// Lấy danh sách tất cả đơn hàng (phục vụ trang quản trị)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.OrderDetails)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.Notes,
                        CustomerName = o.Customer != null ? o.Customer.FullName : "N/A",
                        CustomerEmail = o.Customer != null ? o.Customer.Email : "N/A",
                        TotalAmount = o.OrderDetails != null ? o.OrderDetails.Sum(od => od.UnitPrice * od.Quantity) : 0,
                        ItemCount = o.OrderDetails != null ? o.OrderDetails.Count : 0
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi lấy danh sách đơn hàng", detail = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/Orders/{id}
        /// Lấy chi tiết một đơn hàng theo ID (bao gồm danh sách sản phẩm)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .Where(o => o.Id == id)
                    .Select(o => new {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.Notes,
                        Customer = o.Customer != null ? new {
                            o.Customer.Id,
                            o.Customer.FullName,
                            o.Customer.Email,
                            o.Customer.Phone,
                            o.Customer.Address
                        } : null,
                        TotalAmount = o.OrderDetails != null ? o.OrderDetails.Sum(od => od.UnitPrice * od.Quantity) : 0,
                        Items = o.OrderDetails != null ? o.OrderDetails.Select(od => new {
                            od.Id,
                            od.ProductId,
                            ProductName = od.Product != null ? od.Product.Name : "Sản phẩm đã bị xóa",
                            ProductImage = od.Product != null ? od.Product.ImageUrl : "",
                            od.Quantity,
                            od.UnitPrice
                        }) : null
                    })
                    .FirstOrDefaultAsync();

                if (order == null)
                    return NotFound(new { message = "Không tìm thấy đơn hàng này" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi lấy chi tiết đơn hàng", detail = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/Orders
        /// Tiếp nhận đơn đặt hàng từ FrontEnd, lưu Order + OrderDetails, trừ StockQuantity
        /// Sau khi đặt hàng thành công, tự động gửi Email xác nhận cho khách hàng
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null || input.Items == null || input.Items.Count == 0)
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });

            try
            {
                // Bước A: Tạo đơn hàng mới
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0, // 0 = Chờ xử lý
                    Notes = input.Notes
                };
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Sinh Id đơn hàng tự động tăng

                // Bước B: Lưu từng dòng OrderDetail + trừ tồn kho sản phẩm
                var emailItems = new List<OrderEmailItem>(); // Danh sách sản phẩm gửi Email
                decimal totalAmount = 0;

                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                        return BadRequest(new { message = $"Sản phẩm ID {item.ProductId} không tồn tại" });

                    _context.OrderDetails.Add(new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    });

                    // Tự động trừ số lượng tồn kho, không âm dưới 0
                    product.StockQuantity = Math.Max(0, product.StockQuantity - item.Quantity);

                    // Thu thập thông tin sản phẩm để gửi Email
                    emailItems.Add(new OrderEmailItem
                    {
                        ProductName = product.Name,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    });
                    totalAmount += item.UnitPrice * item.Quantity;
                }

                await _context.SaveChangesAsync();

                // Bước C: Gửi Email xác nhận đơn hàng cho khách hàng
                try
                {
                    var customer = await _context.Customers.FindAsync(input.CustomerId);
                    if (customer != null && !string.IsNullOrEmpty(customer.Email))
                    {
                        await _emailService.SendOrderConfirmationEmail(
                            toEmail: customer.Email,
                            customerName: customer.FullName,
                            orderId: newOrder.Id,
                            orderItems: emailItems,
                            totalAmount: totalAmount,
                            notes: input.Notes
                        );
                    }
                }
                catch (Exception emailEx)
                {
                    // Ghi log lỗi gửi Email nhưng KHÔNG làm thất bại đơn hàng
                    Console.WriteLine($"[EMAIL ERROR] Không thể gửi Email xác nhận: {emailEx.Message}");
                }

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý đơn hàng", detail = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/Orders/customer/{customerId}
        /// Lấy lịch sử mua hàng của một khách hàng
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            try
            {
                var orders = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(
                    _context.Orders
                        .Where(o => o.CustomerId == customerId)
                        .Include(o => o.OrderDetails)
                            .ThenInclude(od => od.Product)
                        .OrderByDescending(o => o.OrderDate)
                        .Select(o => new {
                            o.Id,
                            o.OrderDate,
                            o.Status,
                            o.Notes,
                            TotalAmount = o.OrderDetails.Sum(od => od.UnitPrice * od.Quantity),
                            Items = o.OrderDetails.Select(od => new {
                                od.ProductId,
                                ProductName = od.Product != null ? od.Product.Name : "Sản phẩm đã bị xóa",
                                ProductImage = od.Product != null ? od.Product.ImageUrl : "",
                                od.Quantity,
                                od.UnitPrice
                            })
                        })
                );

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi lấy lịch sử mua hàng", detail = ex.Message });
            }
        }

        /// <summary>
        /// PUT /api/Orders/{id}/status
        /// Cập nhật trạng thái đơn hàng (0: Chờ duyệt, 1: Đang giao, 2: Đã xong)
        /// </summary>
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatusDTO dto)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            order.Status = dto.Status;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            // Gửi email thông báo cho khách hàng
            try
            {
                if (order.Customer != null && !string.IsNullOrEmpty(order.Customer.Email))
                {
                    decimal totalAmount = order.OrderDetails != null ? order.OrderDetails.Sum(od => od.UnitPrice * od.Quantity) : 0;
                    await _emailService.SendOrderStatusUpdateEmail(
                        toEmail: order.Customer.Email,
                        customerName: order.Customer.FullName,
                        orderId: order.Id,
                        status: order.Status,
                        totalAmount: totalAmount
                    );
                }
            }
            catch (Exception emailEx)
            {
                // Ghi log lỗi gửi Email nhưng không làm thất bại yêu cầu cập nhật trạng thái
                Console.WriteLine($"[EMAIL ERROR] Không thể gửi Email thông báo cập nhật trạng thái: {emailEx.Message}");
            }

            return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công và đã gửi email thông báo!" });
        }

        /// <summary>
        /// DELETE /api/Orders/{id}
        /// Xóa đơn hàng theo ID (bao gồm chi tiết đơn hàng)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            // Xóa chi tiết đơn hàng trước
            if (order.OrderDetails != null)
                _context.OrderDetails.RemoveRange(order.OrderDetails);

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa đơn hàng thành công!" });
        }
    }

    // DTO hứng dữ liệu từ FrontEnd
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new();
    }

    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    /// <summary>
    /// DTO cập nhật trạng thái đơn hàng
    /// </summary>
    public class OrderStatusDTO
    {
        /// <summary>
        /// Trạng thái mới: 0 = Chờ duyệt, 1 = Đang giao, 2 = Đã hoàn thành
        /// </summary>
        public int Status { get; set; }
    }
}
