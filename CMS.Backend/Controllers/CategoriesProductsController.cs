/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoriesProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Kết nối vào Controller
        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Sử dụng .Include(c => c.Products) để nạp kèm danh sách sản phẩm
            var data = _context.CategoriesProducts
                               .Include(c => c.Products)
                               .ToList();

            return View(data);
        }

        // 1. Hàm GET: Hiển thị giao diện Form thêm danh mục sản phẩm
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Thêm danh mục sản phẩm mới vào SQL
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            // Kiểm tra trùng tên danh mục
            var checkExist = _context.CategoriesProducts.Any(c => c.Name == model.Name);
            if (checkExist)
            {
                ModelState.AddModelError("Name", "Tên danh mục này đã tồn tại!");
                return View(model);
            }

            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm và hiển thị thông tin danh mục cũ cần sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct == null) return NotFound();

            return View(categoryProduct);
        }

        // 2. Hàm POST: Nhận thông tin danh mục sửa đổi và lưu lại
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            _context.CategoriesProducts.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Action xóa danh mục sản phẩm
        public IActionResult Delete(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct != null)
            {
                _context.CategoriesProducts.Remove(categoryProduct);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
