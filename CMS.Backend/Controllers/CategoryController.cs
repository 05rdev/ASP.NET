/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
public class CategoryController : Controller
{
    private readonly ApplicationDbContext _context;

    // Kết nối vào Controller
    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Lấy dữ liệu từ bảng Categories trong SQL
        var data = _context.Categories.ToList();
        return View(data);
    }
}

