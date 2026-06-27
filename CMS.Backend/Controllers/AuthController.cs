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
using System.Security.Cryptography;
using System.Text;
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
        private readonly EmailService _emailService;

        public AuthController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// Hàm tiện ích: Băm mật khẩu bằng SHA256 kèm Salt cố định
        /// Đảm bảo mật khẩu không lưu dạng thô trong Database
        /// </summary>
        private static string HashPassword(string password)
        {
            var salt = "VanDinhCMS_Salt_2026"; // Salt cố định cho hệ thống
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// POST /api/Auth/register
        /// Đăng ký tài khoản khách hàng mới
        /// Kiểm tra trùng lặp Email trước khi lưu bản ghi
        /// Mật khẩu được mã hóa SHA256 kèm Salt trước khi lưu vào SQL Server
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Thiếu thông tin đăng ký" });

            // Kiểm tra Email đã tồn tại chưa
            var existing = await _context.Customers.AnyAsync(c => c.Email == dto.Email);

            if (existing)
                return Conflict(new { message = "Email này đã được đăng ký trong hệ thống" });

            var customer = new Customer
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Password = HashPassword(dto.Password) // Mã hóa SHA256 + Salt trước khi lưu DB
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
        /// So sánh mật khẩu đã mã hóa SHA256 + Salt
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Thiếu thông tin đăng nhập" });

            var hashedPassword = HashPassword(dto.Password);

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == dto.Email && c.Password == hashedPassword);

            // Fallback: Nếu không tìm thấy bằng mật khẩu mã hóa, thử so với mật khẩu thô
            // (hỗ trợ tương thích ngược với tài khoản cũ chưa mã hóa)
            if (customer == null)
            {
                customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email == dto.Email && c.Password == dto.Password);
                
                // Nếu tìm thấy bằng mật khẩu thô, tự động nâng cấp sang mã hóa
                if (customer != null)
                {
                    customer.Password = hashedPassword;
                    _context.Customers.Update(customer);
                    await _context.SaveChangesAsync();
                }
            }

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

        /// <summary>
        /// GET /api/Auth/profile/{id}
        /// Lấy thông tin cá nhân của khách hàng
        /// </summary>
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy thông tin khách hàng" });

            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        /// <summary>
        /// PUT /api/Auth/profile/{id}
        /// Cập nhật thông tin cá nhân khách hàng
        /// </summary>
        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { message = "Thiếu thông tin cập nhật bắt buộc" });

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng" });

            // Kiểm tra trùng Email với người khác
            var emailExists = await _context.Customers.AnyAsync(c => c.Email == dto.Email && c.Id != id);
            if (emailExists)
                return Conflict(new { message = "Email này đã được sử dụng bởi tài khoản khác" });

            customer.FullName = dto.FullName;
            customer.Email = dto.Email;
            customer.Phone = dto.Phone;
            customer.Address = dto.Address;
            
            if (!string.IsNullOrEmpty(dto.Password))
            {
                customer.Password = HashPassword(dto.Password); // Mã hóa mật khẩu mới
            }

            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công!",
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        /// <summary>
        /// POST /api/Auth/forgot-password
        /// Chức năng quên mật khẩu: Tạo mật khẩu mới ngẫu nhiên và gửi qua Email
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { message = "Vui lòng nhập Email đã đăng ký" });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
            if (customer == null)
                return NotFound(new { message = "Email này chưa được đăng ký trong hệ thống" });

            // Tạo mật khẩu ngẫu nhiên 8 ký tự
            var newPassword = GenerateRandomPassword(8);

            // Cập nhật mật khẩu mới (đã mã hóa) vào Database
            customer.Password = HashPassword(newPassword);
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            // Gửi Email chứa mật khẩu mới cho khách hàng
            try
            {
                await _emailService.SendForgotPasswordEmail(
                    toEmail: customer.Email,
                    customerName: customer.FullName,
                    newPassword: newPassword
                );

                return Ok(new { message = "Mật khẩu mới đã được gửi về Email của bạn. Vui lòng kiểm tra hộp thư!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Không thể gửi Email. Vui lòng thử lại sau.", detail = ex.Message });
            }
        }

        /// <summary>
        /// Tạo mật khẩu ngẫu nhiên gồm chữ và số
        /// </summary>
        private static string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
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

    // DTO cập nhật thông tin cá nhân
    public class UpdateProfileDTO
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Password { get; set; }
    }

    // DTO quên mật khẩu
    public class ForgotPasswordDTO
    {
        public string Email { get; set; } = "";
    }
}
