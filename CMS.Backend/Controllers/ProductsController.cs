/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version:1.0
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;


namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý Sản phẩm thương mại điện tử
    /// Base URL: /api/Products
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào để sử dụng
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
       
        /// <summary>
        /// GET /api/Products
        /// Lấy danh sách sản phẩm với bộ lọc động (danh mục, giá, từ khóa)
        /// </summary>
        /// <param name="categoryProductId">Mã danh mục sản phẩm (tùy chọn)</param>
        /// <param name="minPrice">Giá tối thiểu (tùy chọn)</param>
        /// <param name="maxPrice">Giá tối đa (tùy chọn)</param>
        /// <param name="keyword">Từ khóa tìm kiếm theo tên (tùy chọn)</param>
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? keyword)
        {
            try
            {
                // Bước 1: Khởi tạo câu truy vấn dạng IQueryable để tối ưu hiệu năng (Chưa thực thi xuống Database)
                var query = _context.Products.AsQueryable();


                // Bước 2: Kiểm tra và cộng dồn các điều kiện lọc bằng LINQ (Cơ chế Deferred Execution)


                // Lọc theo Danh mục sản phẩm nếu FrontEnd có truyền categoryProductId khác null
                if (categoryProductId.HasValue)
                {
                    query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
                }


                // Lọc theo Sàn giá tối thiểu
                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }


                // Lọc theo Trần giá tối đa
                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }


                // Tìm kiếm gần đúng theo từ khóa tên sản phẩm (Không phân biệt hoa thường trong SQL)
                if (!string.IsNullOrEmpty(keyword))
                {
                    // Sử dụng hàm Contains để sinh ra câu lệnh LIKE '%keyword%' trong T-SQL
                    query = query.Where(p => p.Name.Contains(keyword.Trim()));
                }


                // Bước 3: Đẩy câu lệnh SQL hoàn chỉnh xuống SQL Server và lấy mảng kết quả sạch trả về
                var result = await query.ToListAsync();


                return Ok(result); // Trả về mã HTTP 200 kèm mảng dữ liệu JSON đã thanh lọc
            }
            catch (System.Exception ex)
            {
                // Tránh sập ứng dụng Backend, ghi nhận nhật ký lỗi hệ thống
                return StatusCode(500, $"Lỗi hệ thống SQL Server: {ex.Message}");
            }
        }
        

        /// <summary>
        /// GET /api/Products/categoryproduct/{categoryProductId}
        /// Lấy danh sách sản phẩm theo mã danh mục sản phẩm
        /// </summary>
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();

            return Ok(products);
        }

        /// <summary>
        /// GET /api/Products/{id}
        /// Lấy chi tiết một sản phẩm theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(product);
        }

        /// <summary>
        /// GET /api/Products/latest
        /// Lấy 3 sản phẩm mới nhất dựa trên Id giảm dần
        /// </summary>
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            try
            {
                var products = await _context.Products
                    .OrderByDescending(p => p.Id)
                    .Take(3)
                    .ToListAsync();
                return Ok(products);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Lỗi lấy sản phẩm mới nhất: {ex.Message}");
            }
        }

        /// <summary>
        /// GET /api/Products/hot
        /// Lấy 3 sản phẩm hot/bán chạy nhất (theo giá tiền cao nhất)
        /// </summary>
        [HttpGet("hot")]
        public async Task<IActionResult> GetHot()
        {
            try
            {
                var products = await _context.Products
                    .OrderByDescending(p => p.Price)
                    .Take(3)
                    .ToListAsync();
                return Ok(products);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Lỗi lấy sản phẩm bán chạy: {ex.Message}");
            }
        }

        /// <summary>
        /// POST /api/Products
        /// Thêm sản phẩm mới vào hệ thống
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Tên sản phẩm không được để trống" });

            // Kiểm tra danh mục sản phẩm tồn tại
            var categoryExists = await _context.CategoriesProducts.AnyAsync(c => c.Id == model.CategoryProductId);
            if (!categoryExists)
                return BadRequest(new { message = "Danh mục sản phẩm không tồn tại" });

            _context.Products.Add(model);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Thêm sản phẩm thành công!", id = model.Id });
        }

        /// <summary>
        /// PUT /api/Products/{id}
        /// Cập nhật thông tin sản phẩm theo ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product model)
        {
            if (id != model.Id)
                return BadRequest(new { message = "ID không trùng khớp" });

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.ImageUrl = model.ImageUrl;
            product.CategoryProductId = model.CategoryProductId;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật sản phẩm thành công!" });
        }

        /// <summary>
        /// DELETE /api/Products/{id}
        /// Xóa sản phẩm theo ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa sản phẩm thành công!" });
        }
    }
}
