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
    /// API Quản lý thông tin tài khoản người dùng quản trị (Admin/Editor)
    /// Base URL: /api/Users
    /// </summary>
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/Users
        /// Lấy danh sách tài khoản người quản trị
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// GET /api/Users/{id}
        /// Lấy chi tiết thông tin một người dùng quản trị theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var user = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người quản trị này trong hệ thống" });
            }

            return Ok(user);
        }

        /// <summary>
        /// POST /api/Users
        /// Tạo mới tài khoản người dùng quản trị
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.PasswordHash))
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var checkExist = await _context.Users.AnyAsync(u => u.Username == model.Username);
            if (checkExist)
            {
                return Conflict(new { message = "Tài khoản (Username) này đã tồn tại!" });
            }

            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Tạo người dùng thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/Users/{id}
        /// Cập nhật thông tin người quản trị theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User model)
        {
            if (id != model.Id) return BadRequest(new { message = "ID không trùng khớp" });

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người quản trị" });

            // Kiểm tra trùng Username
            var usernameExists = await _context.Users.AnyAsync(u => u.Username == model.Username && u.Id != id);
            if (usernameExists) return Conflict(new { message = "Tên tài khoản (Username) đã được sử dụng" });

            user.Username = model.Username;
            user.FullName = model.FullName;
            user.Role = model.Role;

            if (!string.IsNullOrEmpty(model.PasswordHash))
            {
                user.PasswordHash = model.PasswordHash;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật người dùng thành công!" });
        }

        /// <summary>
        /// DELETE /api/Users/{id}
        /// Xóa tài khoản người quản trị theo ID
        /// </summary>
        [HttpGet("delete/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người quản trị" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa người dùng thành công!" });
        }
    }
}
