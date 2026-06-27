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
    /// API Quản lý Banner quảng cáo trang chủ
    /// Base URL: /api/Banners
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/Banners
        /// Lấy danh sách tất cả banner đang kích hoạt (IsActive = true), sắp xếp theo thứ tự hiển thị
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetActiveBanners()
        {
            var banners = await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.Order)
                .ToListAsync();

            return Ok(banners);
        }

        /// <summary>
        /// GET /api/Banners/all
        /// Lấy toàn bộ banner (bao gồm cả đã ẩn), phục vụ trang quản trị
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _context.Banners
                .OrderBy(b => b.Order)
                .ToListAsync();

            return Ok(banners);
        }

        /// <summary>
        /// GET /api/Banners/{id}
        /// Lấy chi tiết một banner theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
                return NotFound(new { message = "Không tìm thấy banner này trong hệ thống" });

            return Ok(banner);
        }

        /// <summary>
        /// POST /api/Banners
        /// Thêm banner mới vào hệ thống
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Banner model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Title))
                return BadRequest(new { message = "Tiêu đề banner không được để trống" });

            model.CreatedDate = System.DateTime.Now;
            _context.Banners.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Thêm banner thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/Banners/{id}
        /// Cập nhật thông tin banner theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Banner model)
        {
            if (id != model.Id)
                return BadRequest(new { message = "ID không trùng khớp" });

            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
                return NotFound(new { message = "Không tìm thấy banner" });

            banner.Title = model.Title;
            banner.Description = model.Description;
            banner.ImageUrl = model.ImageUrl;
            banner.LinkUrl = model.LinkUrl;
            banner.Order = model.Order;
            banner.IsActive = model.IsActive;

            _context.Banners.Update(banner);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật banner thành công!" });
        }

        /// <summary>
        /// DELETE /api/Banners/{id}
        /// Xóa banner theo ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
                return NotFound(new { message = "Không tìm thấy banner" });

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa banner thành công!" });
        }
    }
}
