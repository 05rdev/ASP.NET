/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
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

        // Hàm Index: Hiển thị danh sách bài viết mẫu
        public IActionResult Index()
        {
            var posts = _context.Posts.ToList(); // Lấy tất cả bài viết
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết (Bổ sung  khá giỏi)
        public IActionResult Details(int id)
        {
            // Giả lập tìm bài viết trong Database bằng Id
            // Trong thực tế tuần sau sẽ là: _context.Posts.Find(id);
            var post = new Post
            {
                Id = id,
                Title = "Nội dung chi tiết bài viết số " + id,
                Content = "Đây là nội dung đầy đủ của bài viết mà bạn vừa click vào. Ở đây  có thể viết dài hơn để thấy sự khác biệt với trang danh sách.",
                ImageUrl = "https://via.placeholder.com/600x300", // Ảnh to hơn
                CreatedDate = DateTime.Now
            };

            if (post == null) return NotFound();

            return View(post);
        }
    }
}
