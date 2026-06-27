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
using System.Linq;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý Danh mục bài viết tin tức
    /// Base URL: /api/Categories
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Hàm khởi tạo: Nạp cơ sở dữ liệu SQL Server vào Controller thông qua DI
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/Categories
        /// Lấy toàn bộ danh mục bài viết tin tức
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.Categories
                    .OrderBy(c => c.Id)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message 
                });
            }
        }

        /// <summary>
        /// GET /api/Categories/{id}
        /// Lấy thông tin chi tiết của một danh mục bài viết theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục bài viết này trong hệ thống" });
                }

                return Ok(category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message 
                });
            }
        }

        /// <summary>
        /// POST /api/Categories
        /// Thêm danh mục bài viết mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Tên danh mục không được để trống" });

            var checkExist = await _context.Categories.AnyAsync(c => c.Name == model.Name);
            if (checkExist)
                return Conflict(new { message = "Tên danh mục này đã tồn tại!" });

            _context.Categories.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Thêm danh mục thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/Categories/{id}
        /// Cập nhật thông tin danh mục bài viết theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category model)
        {
            if (id != model.Id)
                return BadRequest(new { message = "ID không trùng khớp" });

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            var nameExists = await _context.Categories.AnyAsync(c => c.Name == model.Name && c.Id != id);
            if (nameExists)
                return Conflict(new { message = "Tên danh mục đã được sử dụng" });

            category.Name = model.Name;
            category.Description = model.Description;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật danh mục thành công!" });
        }

        /// <summary>
        /// DELETE /api/Categories/{id}
        /// Xóa danh mục bài viết theo ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục thành công!" });
        }
    }
}
