/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // Hàm Index: Hiển thị danh sách bài viết mẫu
        // 1. Khai báo biến _context lưu trữ kết nối database
        private readonly ApplicationDbContext _context;

        // 2. Tạo hàm khởi tạo (Constructor) để nhận DbContext được hệ thống tiêm vào
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Tham số 'id' được truyền vào từ URL (ví dụ: /Post/Index/5)
        public IActionResult Index(int? id)
        {
            // 1. Kiểm tra nếu không có id truyền vào thì trả về lỗi hoặc toàn bộ bài viết
            //if (id == null)
            //{
            //    return BadRequest("Vui lòng cung cấp mã danh mục.");
            //}

            // 2. Sử dụng LINQ với tham số 'id' linh hoạt
            var posts = _context.Posts
                        .Where(p => p.CategoryId == id)
                        .OrderByDescending(p => p.CreatedDate)
                        .Include(p => p.Category)
                        .ToList();


            // 3. Truyền dữ liệu ra View
            return View(posts);
        }


        // Hàm Details: Hiển thị chi tiết một bài viết
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }


    }
}
