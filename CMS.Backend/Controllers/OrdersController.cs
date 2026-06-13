/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:2.0
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API: POST /api/Orders
        /// Tiếp nhận đơn đặt hàng từ FrontEnd, lưu Order + OrderDetails, trừ StockQuantity
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
                }

                await _context.SaveChangesAsync();

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
}
