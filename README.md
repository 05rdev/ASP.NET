# 🌐 VanDinhCMS - Hệ Thống Quản Lý Nội Dung & Thương Mại Điện Tử

> **Tác giả:** Huỳnh Văn Định  
> **MSSV:** 2123110052  
> **Phiên bản:** 1.0  

---

## 📋 Giới Thiệu

**VanDinhCMS** là một hệ thống quản lý nội dung (Content Management System) kết hợp chức năng thương mại điện tử, được xây dựng trên nền tảng **ASP.NET Core 8.0 MVC** với giao diện quản trị hiện đại. Hệ thống cho phép quản lý bài viết tin tức, danh mục, sản phẩm, khách hàng và đơn hàng thông qua trang Admin Dashboard. Đồng thời cung cấp RESTful API để phục vụ Frontend (React.js) hiển thị nội dung ra trang công khai.

---

## 🏗️ Kiến Trúc Hệ Thống

Dự án được tổ chức theo mô hình **Solution nhiều Project** trong Visual Studio, tách biệt rõ ràng các tầng (layer):

```
HuynhVanDinhCMS_Solution/
│
├── 📁 CMS.Backend/          # Tầng Presentation - MVC Controllers, Views, API
│   ├── Controllers/          # Xử lý logic nghiệp vụ (MVC + API)
│   ├── Views/                # Giao diện Razor (.cshtml)
│   ├── Models/               # ViewModel
│   ├── wwwroot/              # File tĩnh (CSS, JS, uploads)
│   └── Program.cs            # Entry point & cấu hình ứng dụng
│
├── 📁 CMS.Data/              # Tầng Data Access - Entity Framework Core
│   ├── Entities/             # Các lớp thực thể (Entity classes)
│   ├── Migrations/           # Lịch sử thay đổi cấu trúc database
│   └── ApplicationDbContext.cs  # DbContext - Kết nối & ánh xạ database
│
├── 📁 cms.frontend/          # Tầng Frontend - React.js (SPA)
│   ├── src/                  # Mã nguồn React
│   ├── public/               # File tĩnh công khai
│   └── package.json          # Quản lý dependencies
│
└── HuynhVanDinhCMS_Solution.sln  # Solution file
```

### Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
├──────────────────────┬──────────────────────────────────────┤
│   Admin Dashboard    │         Trang công khai              │
│   (Razor MVC Views)  │         (React.js SPA)               │
├──────────────────────┴──────────────────────────────────────┤
│                    ASP.NET Core 8.0                          │
├──────────────────────┬──────────────────────────────────────┤
│   MVC Controllers    │         API Controllers              │
│   (Server-rendered)  │         (RESTful JSON)               │
├──────────────────────┴──────────────────────────────────────┤
│              Entity Framework Core 8.0                      │
├─────────────────────────────────────────────────────────────┤
│                  SQL Server Database                         │
│                  (VanDinhCMS_DB)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **.NET** | 8.0 | Framework chính |
| **ASP.NET Core MVC** | 8.0 | Mô hình MVC cho Admin Dashboard |
| **Entity Framework Core** | 8.0.27 | ORM - Ánh xạ đối tượng quan hệ |
| **SQL Server** | - | Hệ quản trị cơ sở dữ liệu |
| **Swagger / Swashbuckle** | 10.1.7 | Tài liệu hóa & kiểm thử API |
| **Cookie Authentication** | Built-in | Xác thực người dùng |

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **React.js** | 19.2.6 | Thư viện xây dựng giao diện SPA |
| **React DOM** | 19.2.6 | Render React trên trình duyệt |
| **React Scripts** | 5.0.1 | Công cụ build & dev server |

### UI Framework (Admin Dashboard)
| Công nghệ | Mô tả |
|---|---|
| **Bootstrap 5** | Framework CSS responsive |
| **Bootstrap Icons** | Bộ icon cho giao diện |
| **Google Fonts (Inter)** | Typography hiện đại |

---

## 📊 Cơ Sở Dữ Liệu

### Sơ Đồ Quan Hệ (ERD)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Category   │     │     Post     │     │     User     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ Id (PK)      │◄────│ CategoryId   │     │ Id (PK)      │
│ Name         │  1:N│ Id (PK)      │     │ Username     │
│ Description  │     │ Title        │     │ PasswordHash │
│              │     │ Content      │     │ FullName     │
│              │     │ ImageUrl     │     │ Role         │
│              │     │ CreatedDate  │     └──────────────┘
└──────────────┘     └──────────────┘

┌──────────────────┐     ┌──────────────┐
│ CategoryProduct  │     │   Product    │
├──────────────────┤     ├──────────────┤
│ Id (PK)          │◄────│ CategoryProductId │
│ Name             │ 1:N │ Id (PK)      │
│ Description      │     │ Name         │
│                  │     │ Description  │
│                  │     │ Price        │
│                  │     │ StockQuantity│
│                  │     │ ImageUrl     │
└──────────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Customer   │     │    Order     │     │ OrderDetail  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ Id (PK)      │◄────│ CustomerId   │     │ Id (PK)      │
│ FullName     │ 1:N │ Id (PK)      │◄────│ OrderId      │
│ Email        │     │ OrderDate    │ 1:N │ ProductId    │
│ Phone        │     │ Status       │     │ Quantity     │
│ Address      │     │ Notes        │     │ UnitPrice    │
│ Password     │     └──────────────┘     └──────────────┘
└──────────────┘
```

### Chi Tiết Các Bảng

#### 1. `Users` - Thành viên quản trị
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã thành viên |
| `Username` | string | Tên đăng nhập |
| `PasswordHash` | string | Mật khẩu (hash) |
| `FullName` | string | Họ tên đầy đủ |
| `Role` | string | Vai trò: `Admin` hoặc `Editor` |

#### 2. `Categories` - Danh mục bài viết
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã danh mục |
| `Name` | string | Tên danh mục (VD: Tin Giáo Dục) |
| `Description` | string | Mô tả danh mục |

#### 3. `Posts` - Bài viết tin tức
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã bài viết |
| `Title` | string | Tiêu đề bài viết |
| `Content` | string | Nội dung chi tiết (HTML) |
| `ImageUrl` | string | Đường dẫn ảnh đại diện |
| `CreatedDate` | DateTime | Ngày tạo bài viết |
| `CategoryId` | int (FK) | Liên kết tới `Categories` |

#### 4. `CategoriesProducts` - Danh mục sản phẩm
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã danh mục sản phẩm |
| `Name` | string (max 100) | Tên danh mục |
| `Description` | string? | Mô tả |

#### 5. `Products` - Sản phẩm
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã sản phẩm |
| `Name` | string (Required) | Tên sản phẩm |
| `Description` | string? | Mô tả sản phẩm |
| `Price` | decimal(18,2) | Giá sản phẩm |
| `StockQuantity` | int | Số lượng tồn kho |
| `ImageUrl` | string? | Ảnh sản phẩm |
| `CategoryProductId` | int (FK) | Liên kết tới `CategoriesProducts` |

#### 6. `Customers` - Khách hàng
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã khách hàng |
| `FullName` | string (Required) | Họ tên |
| `Email` | string (Required, Email) | Địa chỉ email (duy nhất) |
| `Phone` | string? | Số điện thoại |
| `Address` | string? | Địa chỉ giao hàng |
| `Password` | string (Required) | Mật khẩu |

#### 7. `Orders` - Đơn hàng
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã đơn hàng |
| `OrderDate` | DateTime | Ngày đặt hàng |
| `CustomerId` | int (FK) | Liên kết tới `Customers` |
| `Status` | int | 0: Chờ duyệt, 1: Đang giao, 2: Đã xong |
| `Notes` | string? | Ghi chú đơn hàng |

#### 8. `OrderDetails` - Chi tiết đơn hàng
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã chi tiết |
| `OrderId` | int (FK) | Liên kết tới `Orders` |
| `ProductId` | int (FK) | Liên kết tới `Products` |
| `Quantity` | int | Số lượng mua |
| `UnitPrice` | decimal(18,2) | Giá tại thời điểm mua |

---

## 🔐 Hệ Thống Xác Thực & Phân Quyền

### Cơ Chế Xác Thực
- Sử dụng **Cookie Authentication** của ASP.NET Core
- Đăng nhập qua form tại `/Account/Login`
- Thông tin đăng nhập được xác minh với bảng `Users` trong database
- Sau khi đăng nhập, hệ thống tạo **Claims** chứa: `Username`, `Role`, `FullName`

### Phân Quyền (Authorization)
| Vai trò | Quyền hạn |
|---|---|
| **Admin** | Toàn quyền truy cập tất cả chức năng quản trị |
| **Editor** | Chỉ có quyền xem Dashboard (Home), không truy cập được các trang quản lý |

### Bảo Vệ Các Trang
- Tất cả Controller quản trị đều được bảo vệ bởi `[Authorize(Roles = "Admin")]`
- `HomeController` yêu cầu đăng nhập (`[Authorize]`) nhưng không giới hạn vai trò
- Truy cập trái phép sẽ chuyển hướng tới `/Account/AccessDenied`

---

## 📡 RESTful API

API được thiết kế để phục vụ Frontend React.js, tài liệu API có thể truy cập qua **Swagger UI** tại `/swagger`.

### Endpoints

#### Posts API (`/api/posts`)
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/posts` | Lấy toàn bộ bài viết (sắp xếp mới nhất) |
| `GET` | `/api/posts/{id}` | Lấy chi tiết một bài viết theo ID |
| `GET` | `/api/posts/category/{categoryId}` | Lấy bài viết theo danh mục |

### Cấu Hình CORS
API được cấu hình **CORS** cho phép mọi nguồn truy cập (`AllowAnyOrigin`, `AllowAnyMethod`, `AllowAnyHeader`), hỗ trợ Frontend React gọi API từ domain khác.

---

## 🖥️ Trang Quản Trị (Admin Dashboard)

Giao diện quản trị sử dụng layout `_LayoutAdmin.cshtml` với thiết kế hiện đại:
- **Sidebar** cố định bên trái với gradient tối (`#1e293b → #0f172a`)
- **Typography**: Google Fonts Inter
- **Responsive**: Tự động điều chỉnh trên mobile
- **Active State**: Tự động highlight menu đang truy cập

### Các Module Quản Lý

| Module | Controller | Chức năng |
|---|---|---|
| 🏠 **Bảng điều khiển** | `HomeController` | Hiển thị 3 bài viết mới nhất |
| 👤 **Quản lý Thành viên** | `UserController` | CRUD thành viên quản trị |
| 🏷️ **Danh mục bài viết** | `CategoryController` | CRUD danh mục tin tức |
| 📝 **Bài viết tin tức** | `PostController` | CRUD bài viết (có upload ảnh) |
| 📦 **Danh mục sản phẩm** | `CategoriesProductsController` | CRUD danh mục sản phẩm |
| 🛍️ **Quản lý Sản phẩm** | `ProductController` | CRUD sản phẩm (có upload ảnh) |
| 👥 **Khách hàng** | `CustomersController` | CRUD khách hàng (kiểm tra trùng email) |
| 📋 **Quản lý Đơn hàng** | `OrdersController` | CRUD đơn hàng, xem chi tiết |

### Chức Năng CRUD Chi Tiết

Mỗi module đều hỗ trợ đầy đủ:
- **Create (Thêm)**: Form nhập liệu với validation
- **Read (Đọc)**: Danh sách dạng bảng, chi tiết từng bản ghi
- **Update (Sửa)**: Form chỉnh sửa với dữ liệu cũ được nạp sẵn
- **Delete (Xóa)**: Xóa bản ghi khỏi database

### Upload Ảnh
- Hỗ trợ upload ảnh cho **Bài viết** và **Sản phẩm**
- Ảnh được lưu tại `wwwroot/uploads/` với tên file là GUID để tránh trùng lặp
- Khi sửa, nếu không upload ảnh mới thì giữ lại ảnh cũ

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### Yêu Cầu Hệ Thống
- **Visual Studio 2022** (v17.x trở lên)
- **.NET 8.0 SDK**
- **SQL Server** (LocalDB hoặc Express)
- **Node.js** (v18+ cho Frontend React)

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd HuynhVanDinhCMS_Solution
```

### Bước 2: Cấu hình Database
Mở file `CMS.Backend/appsettings.json` và chỉnh sửa chuỗi kết nối cho phù hợp:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TEN_SERVER;Database=VanDinhCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

### Bước 3: Tạo Database (Migration)
Mở **Package Manager Console** trong Visual Studio:
```powershell
# Chọn Default project: CMS.Data
Update-Database
```

Hoặc dùng .NET CLI:
```bash
cd CMS.Backend
dotnet ef database update
```

### Bước 4: Chạy Backend
```bash
cd CMS.Backend
dotnet run
```
Hoặc nhấn **F5** trong Visual Studio. Backend sẽ chạy tại `https://localhost:7xxx`.

### Bước 5: Chạy Frontend (React)
```bash
cd cms.frontend
npm install
npm start
```
Frontend sẽ chạy tại `http://localhost:3000`.

---

## 📁 Cấu Trúc Views Chi Tiết

```
Views/
├── Account/
│   ├── Login.cshtml              # Trang đăng nhập
│   └── AccessDenied.cshtml       # Trang từ chối truy cập
├── Home/
│   ├── Index.cshtml              # Dashboard - Hiển thị bài viết mới
│   └── Privacy.cshtml            # Trang chính sách
├── User/
│   ├── Index.cshtml              # Danh sách thành viên
│   ├── Create.cshtml             # Form thêm thành viên
│   └── Edit.cshtml               # Form sửa thành viên
├── Category/
│   ├── Index.cshtml              # Danh sách danh mục bài viết
│   ├── Create.cshtml             # Form thêm danh mục
│   └── Edit.cshtml               # Form sửa danh mục
├── Post/
│   ├── Index.cshtml              # Danh sách bài viết
│   ├── Create.cshtml             # Form thêm bài viết
│   ├── Edit.cshtml               # Form sửa bài viết
│   └── Details.cshtml            # Chi tiết bài viết
├── CategoriesProducts/
│   ├── Index.cshtml              # Danh sách danh mục sản phẩm
│   ├── Create.cshtml             # Form thêm danh mục SP
│   └── Edit.cshtml               # Form sửa danh mục SP
├── Product/
│   ├── Index.cshtml              # Danh sách sản phẩm
│   ├── Create.cshtml             # Form thêm sản phẩm
│   └── Edit.cshtml               # Form sửa sản phẩm
├── Customers/
│   ├── Index.cshtml              # Danh sách khách hàng
│   ├── Create.cshtml             # Form thêm khách hàng
│   └── Edit.cshtml               # Form sửa khách hàng
├── Orders/
│   ├── Index.cshtml              # Danh sách đơn hàng
│   └── Details.cshtml            # Chi tiết đơn hàng
└── Shared/
    ├── _Layout.cshtml            # Layout mặc định
    ├── _LayoutAdmin.cshtml       # Layout trang quản trị
    ├── Error.cshtml              # Trang lỗi
    └── _ValidationScriptsPartial.cshtml
```

---

## ⚙️ Cấu Hình Middleware Pipeline

Thứ tự middleware trong `Program.cs`:

```
Request → Swagger → ExceptionHandler → HTTPS Redirect → Static Files
       → Routing → CORS → Authentication → Authorization → Controllers
```

1. **Swagger**: Tài liệu API tại `/swagger`
2. **Static Files**: Phục vụ file tĩnh từ `wwwroot/`
3. **CORS**: Cho phép cross-origin requests
4. **Authentication**: Xác thực Cookie
5. **Authorization**: Kiểm tra quyền truy cập
6. **Routing**: Phân luồng MVC (`{controller}/{action}/{id?}`) + API (`api/[controller]`)

---

## 📦 NuGet Packages

### CMS.Backend
| Package | Version |
|---|---|
| `Microsoft.EntityFrameworkCore.Design` | 8.0.27 |
| `Microsoft.EntityFrameworkCore.SqlServer` | 8.0.27 |
| `Microsoft.EntityFrameworkCore.Tools` | 8.0.27 |
| `Microsoft.VisualStudio.Web.CodeGeneration.Design` | 8.0.23 |
| `Swashbuckle.AspNetCore` | 10.1.7 |

### CMS.Data
| Package | Version |
|---|---|
| `Microsoft.EntityFrameworkCore` | 8.0.27 |
| `Microsoft.EntityFrameworkCore.SqlServer` | 8.0.27 |
| `Microsoft.EntityFrameworkCore.Tools` | 8.0.27 |
| `Microsoft.EntityFrameworkCore.Design` | 8.0.27 |

---

## 🧪 Kiểm Thử API

Truy cập Swagger UI để kiểm thử API:
```
https://localhost:{port}/swagger
```

Hoặc sử dụng cURL:
```bash
# Lấy tất cả bài viết
curl -X GET https://localhost:{port}/api/posts

# Lấy bài viết theo ID
curl -X GET https://localhost:{port}/api/posts/1

# Lấy bài viết theo danh mục
curl -X GET https://localhost:{port}/api/posts/category/1
```

---

## 📝 Ghi Chú Phát Triển

- **Database-first vs Code-first**: Dự án sử dụng phương pháp **Code-First** với Entity Framework Core Migrations
- **Validation**: Sử dụng Data Annotations (`[Required]`, `[Range]`, `[EmailAddress]`, `[StringLength]`) trực tiếp trên Entity
- **Duplicate Check**: Kiểm tra trùng `Username` khi tạo User mới, trùng `Email` khi tạo Customer, trùng `Name` khi tạo danh mục sản phẩm
- **Image Upload**: File ảnh được đặt tên bằng GUID để tránh xung đột, lưu trong `wwwroot/uploads/`
- **Eager Loading**: Sử dụng `.Include()` và `.ThenInclude()` để nạp dữ liệu liên quan (Navigation Properties)

---

## 📄 License

Dự án này được phát triển phục vụ mục đích học tập và nghiên cứu.

---

> **VanDinhCMS** - Xây dựng bởi Huỳnh Văn Định (MSSV: 2123110052)
