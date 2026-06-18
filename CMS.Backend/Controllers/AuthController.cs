/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API xác thực tài khoản khách hàng mua sắm (không phải Admin)
    /// Base URL: /api/Auth
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// POST /api/Auth/register
        /// Đăng ký tài khoản khách hàng mới
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Thiếu thông tin đăng ký" });

            // Kiểm tra Email đã tồn tại chưa
            var existing = await System.Threading.Tasks.Task.Run(() =>
                System.Linq.Enumerable.Any(_context.Customers, c => c.Email == dto.Email));

            if (existing)
                return Conflict(new { message = "Email này đã được đăng ký trong hệ thống" });

            var customer = new Customer
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Password = dto.Password // Lưu mật khẩu thô theo yêu cầu tối giản
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đăng ký thành công!",
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        /// <summary>
        /// POST /api/Auth/login
        /// Đăng nhập tài khoản khách hàng
        /// </summary>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Thiếu thông tin đăng nhập" });

            var customer = System.Linq.Enumerable.FirstOrDefault(
                _context.Customers,
                c => c.Email == dto.Email && c.Password == dto.Password);

            if (customer == null)
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }
    }

    // DTO đăng ký
    public class RegisterDTO
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    // DTO đăng nhập
    public class LoginDTO
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
