/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 1. Cấu hình đường dẫn API: api/Categories
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra lỗi dữ liệu (Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase để tối ưu bộ nhớ cho API thuần dữ liệu JSON
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo: Nạp cơ sở dữ liệu SQL Server vào Controller thông qua DI
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API lấy toàn bộ danh mục bài viết tin tức (Giao thức GET)
        /// Đường dẫn gọi dữ liệu: GET https://localhost:xxxx/api/Categories
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Bước A: Quét bảng dữ liệu Categories từ SQL Server lên
                var categories = await _context.Categories
                    .OrderBy(c => c.Id) // Sắp xếp theo mã ID tăng dần
                    .Select(c => new {
                        // Bước B: Kỹ thuật gọt tỉa (Projection) - chỉ lấy các trường cần thiết ra FrontEnd
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync(); // Chuyển đổi bất đồng bộ sang danh sách

                // Bước C: Trả về mã thành công HTTP 200 OK đính kèm chuỗi JSON sạch
                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                // Bảo vệ hệ thống: Trả về lỗi 500 kèm thông tin chi tiết
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message 
                });
            }
        }

        /// <summary>
        /// API lấy thông tin chi tiết của một danh mục bài viết theo ID
        /// Đường dẫn gọi dữ liệu: GET https://localhost:xxxx/api/Categories/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                // Tìm kiếm danh mục trong Database theo ID
                var category = await _context.Categories
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .FirstOrDefaultAsync(c => c.Id == id);

                // Xử lý kịch bản không tìm thấy ID
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
    }
}
