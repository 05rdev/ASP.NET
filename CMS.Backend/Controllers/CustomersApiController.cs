/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý thông tin khách hàng mua sắm
    /// Base URL: /api/Customers
    /// </summary>
    [Route("api/customers")]
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/Customers
        /// Lấy danh sách toàn bộ khách hàng
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAll()
        {
            var customers = await _context.Customers
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address,
                    OrderCount = c.Orders != null ? c.Orders.Count : 0
                })
                .ToListAsync();

            return Ok(customers);
        }

        /// <summary>
        /// GET /api/Customers/{id}
        /// Lấy chi tiết thông tin một khách hàng theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var customer = await _context.Customers
                .Select(c => new {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng này trong hệ thống" });
            }

            return Ok(customer);
        }

        /// <summary>
        /// POST /api/Customers
        /// Thêm khách hàng mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Customer model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var checkExist = await _context.Customers.AnyAsync(c => c.Email == model.Email);
            if (checkExist)
            {
                return Conflict(new { message = "Email này đã tồn tại trong hệ thống!" });
            }

            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Thêm khách hàng thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/Customers/{id}
        /// Cập nhật thông tin khách hàng theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer model)
        {
            if (id != model.Id) return BadRequest(new { message = "ID không trùng khớp" });

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng" });

            // Kiểm tra trùng Email
            var emailExists = await _context.Customers.AnyAsync(c => c.Email == model.Email && c.Id != id);
            if (emailExists) return Conflict(new { message = "Email đã được sử dụng" });

            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.Address = model.Address;

            if (!string.IsNullOrEmpty(model.Password))
            {
                customer.Password = model.Password;
            }

            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật khách hàng thành công!" });
        }

        /// <summary>
        /// DELETE /api/Customers/{id}
        /// Xóa khách hàng theo ID
        /// </summary>
        [HttpGet("delete/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng" });

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa khách hàng thành công!" });
        }
    }
}
