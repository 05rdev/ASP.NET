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
    /// API Quản lý Bài viết tin tức
    /// Base URL: /api/Posts
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào để sử dụng
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/Posts
        /// Lấy toàn bộ bài viết tin tức, sắp xếp mới nhất lên đầu
        /// Hỗ trợ phân trang khi truyền page và pageSize
        /// </summary>
        /// <param name="page">Số trang (tùy chọn)</param>
        /// <param name="pageSize">Kích thước trang (tùy chọn)</param>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var query = _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                });

            if (page.HasValue || pageSize.HasValue)
            {
                int pageVal = page ?? 1;
                int pageSizeVal = pageSize ?? 6;
                if (pageVal < 1) pageVal = 1;
                if (pageSizeVal < 1) pageSizeVal = 6;

                int totalItems = await query.CountAsync();
                var data = await query
                    .Skip((pageVal - 1) * pageSizeVal)
                    .Take(pageSizeVal)
                    .ToListAsync();

                int totalPages = (int)System.Math.Ceiling((double)totalItems / pageSizeVal);

                return Ok(new
                {
                    data = data,
                    page = pageVal,
                    pageSize = pageSizeVal,
                    totalItems = totalItems,
                    totalPages = totalPages
                });
            }
            else
            {
                var posts = await query.ToListAsync();
                return Ok(posts);
            }
        }

        /// <summary>
        /// GET /api/Posts/category/{categoryId}
        /// Lấy danh sách bài viết theo mã danh mục
        /// Hỗ trợ phân trang khi truyền page và pageSize
        /// </summary>
        /// <param name="categoryId">Mã danh mục</param>
        /// <param name="page">Số trang (tùy chọn)</param>
        /// <param name="pageSize">Kích thước trang (tùy chọn)</param>
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            var query = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : ""
                });

            if (page.HasValue || pageSize.HasValue)
            {
                int pageVal = page ?? 1;
                int pageSizeVal = pageSize ?? 6;
                if (pageVal < 1) pageVal = 1;
                if (pageSizeVal < 1) pageSizeVal = 6;

                int totalItems = await query.CountAsync();
                var data = await query
                    .Skip((pageVal - 1) * pageSizeVal)
                    .Take(pageSizeVal)
                    .ToListAsync();

                int totalPages = (int)System.Math.Ceiling((double)totalItems / pageSizeVal);

                return Ok(new
                {
                    data = data,
                    page = pageVal,
                    pageSize = pageSizeVal,
                    totalItems = totalItems,
                    totalPages = totalPages
                });
            }
            else
            {
                var posts = await query.ToListAsync();
                return Ok(posts);
            }
        }

        /// <summary>
        /// GET /api/Posts/{id}
        /// Lấy chi tiết một bài viết theo ID (bao gồm nội dung HTML)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post);
        }

        /// <summary>
        /// POST /api/Posts
        /// Thêm bài viết tin tức mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Title))
                return BadRequest(new { message = "Tiêu đề bài viết không được để trống" });

            // Kiểm tra danh mục tồn tại
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == model.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = "Danh mục bài viết không tồn tại" });

            model.CreatedDate = System.DateTime.Now;
            _context.Posts.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Thêm bài viết thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/Posts/{id}
        /// Cập nhật bài viết tin tức theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Post model)
        {
            if (id != model.Id)
                return BadRequest(new { message = "ID không trùng khớp" });

            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = "Không tìm thấy bài viết" });

            post.Title = model.Title;
            post.Content = model.Content;
            post.ImageUrl = model.ImageUrl;
            post.CategoryId = model.CategoryId;

            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật bài viết thành công!" });
        }

        /// <summary>
        /// DELETE /api/Posts/{id}
        /// Xóa bài viết tin tức theo ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = "Không tìm thấy bài viết" });

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa bài viết thành công!" });
        }
    }
}
