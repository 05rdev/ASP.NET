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
    /// API Quản lý Danh mục sản phẩm công nghệ
    /// Base URL: /api/CategoriesProducts
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Hàm khởi tạo: Nạp cơ sở dữ liệu SQL Server vào Controller thông qua DI
        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/CategoriesProducts
        /// Lấy toàn bộ danh mục sản phẩm công nghệ
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.CategoriesProducts
                    .OrderBy(c => c.DisplayOrder)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description,
                        c.DisplayOrder,
                        c.IsActive
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
        /// GET /api/CategoriesProducts/{id}
        /// Lấy chi tiết một danh mục sản phẩm theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var category = await _context.CategoriesProducts
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.DisplayOrder,
                    c.IsActive
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này" });

            return Ok(category);
        }

        /// <summary>
        /// POST /api/CategoriesProducts
        /// Thêm danh mục sản phẩm mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Tên danh mục sản phẩm không được để trống" });

            var checkExist = await _context.CategoriesProducts.AnyAsync(c => c.Name == model.Name);
            if (checkExist)
                return Conflict(new { message = "Tên danh mục sản phẩm này đã tồn tại!" });

            _context.CategoriesProducts.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Thêm danh mục sản phẩm thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/CategoriesProducts/{id}
        /// Cập nhật thông tin danh mục sản phẩm theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct model)
        {
            if (id != model.Id)
                return BadRequest(new { message = "ID không trùng khớp" });

            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm" });

            var nameExists = await _context.CategoriesProducts.AnyAsync(c => c.Name == model.Name && c.Id != id);
            if (nameExists)
                return Conflict(new { message = "Tên danh mục sản phẩm đã được sử dụng" });

            category.Name = model.Name;
            category.Description = model.Description;
            category.DisplayOrder = model.DisplayOrder;
            category.IsActive = model.IsActive;

            _context.CategoriesProducts.Update(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật danh mục sản phẩm thành công!" });
        }

        /// <summary>
        /// DELETE /api/CategoriesProducts/{id}
        /// Xóa danh mục sản phẩm theo ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm" });

            _context.CategoriesProducts.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục sản phẩm thành công!" });
        }
    }
}
