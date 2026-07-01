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
│                    ASP.NET Core 8.0                         │
├──────────────────────┬──────────────────────────────────────┤
│   MVC Controllers    │         API Controllers              │
│   (Server-rendered)  │         (RESTful JSON)               │
├──────────────────────┴──────────────────────────────────────┤
│              Entity Framework Core 8.0                      │
├─────────────────────────────────────────────────────────────┤
│                  SQL Server Database                        │
│                  (VanDinhCMS_DB)                            │
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

┌──────────────┐
│    Banner    │
├──────────────┤
│ Id (PK)      │
│ Title        │
│ Description  │
│ ImageUrl     │
│ IsActive     │
│ DisplayOrder │
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
#### 9.`Banner`
| Cột | Kiểu | Mô tả |
|---|---|---|
| `Id` | int (PK) | Mã banner |
| `Title` | string (max 200) | Tiêu đề banner |
| `Description` | string? | Mô tả banner |
| `ImageUrl` | string? | Ảnh banner |
| `IsActive` | bool | Trạng thái banner |
| `DisplayOrder` | int | Thứ tự hiển thị |
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

> **Base URL:** `https://localhost:{port}`  
> **CORS:** Cho phép mọi nguồn (`AllowAnyOrigin`, `AllowAnyMethod`, `AllowAnyHeader`)

---

### 🔐 Auth API (`/api/Auth`)
*Xác thực tài khoản khách hàng mua sắm (không phải Admin)*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `POST` | `/api/Auth/register` | Đăng ký tài khoản khách hàng mới | ❌ |
| `POST` | `/api/Auth/login` | Đăng nhập tài khoản khách hàng | ❌ |
| `GET` | `/api/Auth/profile/{id}` | Lấy thông tin cá nhân của khách hàng | ❌ |
| `PUT` | `/api/Auth/profile/{id}` | Cập nhật thông tin cá nhân khách hàng | ❌ |
| `POST` | `/api/Auth/forgot-password` | Quên mật khẩu — tạo mật khẩu mới & **gửi Email** | ❌ |

#### Request Body — `POST /api/Auth/register`
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "password": "matkhau123",
  "phone": "0901234567",
  "address": "123 Lê Lợi, TP.HCM"
}
```

#### Request Body — `POST /api/Auth/login`
```json
{
  "email": "nguyenvana@gmail.com",
  "password": "matkhau123"
}
```

#### Request Body — `PUT /api/Auth/profile/{id}`
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0901234567",
  "address": "123 Lê Lợi, TP.HCM",
  "password": "matkhaumoi456"
}
```

#### Request Body — `POST /api/Auth/forgot-password`
```json
{
  "email": "nguyenvana@gmail.com"
}
```
> **📧 Email tự động:** Sau khi gọi endpoint này, hệ thống tạo mật khẩu ngẫu nhiên 8 ký tự, cập nhật vào Database (đã mã hóa SHA256+Salt) và gửi email **"🔑 Khôi phục mật khẩu"** tới địa chỉ email đã đăng ký.

#### Response — Đăng nhập/Đăng ký thành công
```json
{
  "message": "Đăng nhập thành công!",
  "id": 1,
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0901234567",
  "address": "123 Lê Lợi, TP.HCM"
}
```

---

### 📝 Posts API (`/api/Posts`)
*Quản lý bài viết tin tức — hỗ trợ phân trang*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/Posts` | Lấy toàn bộ bài viết (sắp xếp mới nhất) | ❌ |
| `GET` | `/api/Posts?page=1&pageSize=6` | Lấy bài viết có phân trang | ❌ |
| `GET` | `/api/Posts/{id}` | Lấy chi tiết một bài viết theo ID (bao gồm Content HTML) | ❌ |
| `GET` | `/api/Posts/category/{categoryId}` | Lấy bài viết theo danh mục | ❌ |
| `GET` | `/api/Posts/category/{categoryId}?page=1&pageSize=6` | Lấy bài viết theo danh mục + phân trang | ❌ |
| `POST` | `/api/Posts` | Thêm bài viết mới | ❌ |
| `PUT` | `/api/Posts/{id}` | Cập nhật bài viết theo ID | ❌ |
| `DELETE` | `/api/Posts/{id}` | Xóa bài viết theo ID | ❌ |

#### Query Parameters — `GET /api/Posts`
| Tham số | Kiểu | Mô tả |
|---|---|---|
| `page` | int | Số trang (mặc định: không phân trang) |
| `pageSize` | int | Số bài viết mỗi trang (mặc định: 6) |

#### Response — Khi có phân trang
```json
{
  "data": [...],
  "page": 1,
  "pageSize": 6,
  "totalItems": 20,
  "totalPages": 4
}
```

#### Request Body — `POST /api/Posts`
```json
{
  "title": "Tiêu đề bài viết",
  "content": "<p>Nội dung HTML...</p>",
  "imageUrl": "/uploads/abc.jpg",
  "categoryId": 1
}
```

---

### 🛍️ Products API (`/api/Products`)
*Quản lý sản phẩm thương mại điện tử — hỗ trợ lọc động và phân trang*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/Products` | Lấy danh sách sản phẩm (có thể lọc nhiều tiêu chí) | ❌ |
| `GET` | `/api/Products/{id}` | Lấy chi tiết một sản phẩm theo ID | ❌ |
| `GET` | `/api/Products/categoryproduct/{categoryProductId}` | Lấy sản phẩm theo danh mục sản phẩm | ❌ |
| `GET` | `/api/Products/latest` | Lấy 3 sản phẩm mới nhất (theo ID giảm dần) | ❌ |
| `GET` | `/api/Products/hot` | Lấy 3 sản phẩm hot/bán chạy (theo giá cao nhất) | ❌ |
| `POST` | `/api/Products` | Thêm sản phẩm mới vào hệ thống | ❌ |
| `PUT` | `/api/Products/{id}` | Cập nhật thông tin sản phẩm theo ID | ❌ |
| `DELETE` | `/api/Products/{id}` | Xóa sản phẩm theo ID | ❌ |

#### Query Parameters — `GET /api/Products`
| Tham số | Kiểu | Mô tả |
|---|---|---|
| `categoryProductId` | int | Lọc theo mã danh mục sản phẩm |
| `minPrice` | decimal | Lọc giá tối thiểu |
| `maxPrice` | decimal | Lọc giá tối đa |
| `keyword` | string | Tìm kiếm theo tên sản phẩm (LIKE `%keyword%`) |
| `page` | int | Số trang (mặc định: 1) |
| `pageSize` | int | Số sản phẩm mỗi trang (mặc định: 12) |

#### Ví dụ lọc sản phẩm nâng cao
```
GET /api/Products?categoryProductId=2&minPrice=100000&maxPrice=5000000&keyword=gaming&page=1&pageSize=12
```

#### Request Body — `POST /api/Products`
```json
{
  "name": "Chuột gaming XYZ",
  "description": "Mô tả sản phẩm...",
  "price": 350000,
  "stockQuantity": 50,
  "imageUrl": "/uploads/product.jpg",
  "categoryProductId": 2
}
```

---

### 📋 Orders API (`/api/Orders`)
*Quản lý đơn hàng — tích hợp Email tự động theo từng trạng thái*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/Orders` | Lấy danh sách tất cả đơn hàng (dành cho quản trị) | ❌ |
| `GET` | `/api/Orders/{id}` | Lấy chi tiết đơn hàng theo ID (bao gồm danh sách SP) | ❌ |
| `GET` | `/api/Orders/customer/{customerId}` | Lấy lịch sử mua hàng của một khách hàng | ❌ |
| `POST` | `/api/Orders` | Đặt hàng mới — trừ tồn kho & **gửi Email xác nhận** | ❌ |
| `PUT` | `/api/Orders/{id}/status` | Cập nhật trạng thái đơn hàng & **gửi Email thông báo** | ❌ |
| `DELETE` | `/api/Orders/{id}` | Xóa đơn hàng theo ID (bao gồm OrderDetails) | ❌ |

#### Request Body — `POST /api/Orders` (Đặt hàng mới)
```json
{
  "customerId": 1,
  "notes": "Giao giờ hành chính",
  "items": [
    {
      "productId": 5,
      "quantity": 2,
      "unitPrice": 350000
    },
    {
      "productId": 8,
      "quantity": 1,
      "unitPrice": 1200000
    }
  ]
}
```

#### Request Body — `PUT /api/Orders/{id}/status` (Cập nhật trạng thái)
```json
{
  "status": 1
}
```

#### Trạng Thái Đơn Hàng
| Giá trị | Trạng thái | Màu Email | Email gửi |
|---|---|---|---|
| `0` | ⏳ Chờ duyệt (Đang xử lý) | 🟠 Orange | Khi cập nhật về 0 |
| `1` | 🚚 Đang giao hàng | 🔵 Blue | Khi chuyển sang 1 |
| `2` | ✅ Đã hoàn thành | 🟢 Green | Khi chuyển sang 2 |

#### Response — `GET /api/Orders/{id}`
```json
{
  "id": 1,
  "orderDate": "2026-07-01T10:30:00",
  "status": 1,
  "notes": "Giao giờ hành chính",
  "customer": {
    "id": 1,
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "phone": "0901234567",
    "address": "123 Lê Lợi, TP.HCM"
  },
  "totalAmount": 1900000,
  "items": [
    {
      "id": 1,
      "productId": 5,
      "productName": "Chuột gaming XYZ",
      "productImage": "/uploads/product.jpg",
      "quantity": 2,
      "unitPrice": 350000
    }
  ]
}
```

---

### 🏷️ Categories API (`/api/Categories`)
*Quản lý danh mục bài viết tin tức*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/Categories` | Lấy toàn bộ danh mục bài viết | ❌ |
| `GET` | `/api/Categories/{id}` | Lấy chi tiết một danh mục theo ID | ❌ |
| `POST` | `/api/Categories` | Thêm danh mục mới (kiểm tra trùng tên) | ❌ |
| `PUT` | `/api/Categories/{id}` | Cập nhật danh mục theo ID | ❌ |
| `DELETE` | `/api/Categories/{id}` | Xóa danh mục theo ID | ❌ |

#### Request Body — `POST /api/Categories`
```json
{
  "name": "Tin Công Nghệ",
  "description": "Các bài viết về công nghệ mới nhất"
}
```

---

### 📦 Category Products API (`/api/CategoryProducts`)
*Quản lý danh mục sản phẩm thương mại điện tử*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/CategoryProducts` | Lấy toàn bộ danh mục sản phẩm | ❌ |
| `GET` | `/api/CategoryProducts/{id}` | Lấy chi tiết một danh mục sản phẩm | ❌ |
| `POST` | `/api/CategoryProducts` | Thêm danh mục sản phẩm mới | ❌ |
| `PUT` | `/api/CategoryProducts/{id}` | Cập nhật danh mục sản phẩm | ❌ |
| `DELETE` | `/api/CategoryProducts/{id}` | Xóa danh mục sản phẩm | ❌ |

---

### 👥 Customers API (`/api/customers`)
*Quản lý thông tin khách hàng mua sắm*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/customers` | Lấy danh sách toàn bộ khách hàng | ❌ |
| `GET` | `/api/customers/{id}` | Lấy chi tiết một khách hàng theo ID | ❌ |
| `POST` | `/api/customers` | Thêm khách hàng mới (kiểm tra trùng Email) | ❌ |
| `PUT` | `/api/customers/{id}` | Cập nhật thông tin khách hàng theo ID | ❌ |
| `DELETE` | `/api/customers/{id}` | Xóa khách hàng theo ID | ❌ |
| `GET` | `/api/customers/delete/{id}` | Xóa khách hàng (alias dạng GET, dùng cho redirect) | ❌ |

---

### 🖼️ Banners API (`/api/Banners`)
*Quản lý banner quảng cáo trang chủ*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/Banners` | Lấy banner đang kích hoạt (`IsActive = true`), sắp xếp theo thứ tự | ❌ |
| `GET` | `/api/Banners/all` | Lấy toàn bộ banner (kể cả đã ẩn) — dành cho quản trị | ❌ |
| `GET` | `/api/Banners/{id}` | Lấy chi tiết một banner theo ID | ❌ |
| `POST` | `/api/Banners` | Thêm banner mới | ❌ |
| `PUT` | `/api/Banners/{id}` | Cập nhật thông tin banner | ❌ |
| `DELETE` | `/api/Banners/{id}` | Xóa banner theo ID | ❌ |

#### Request Body — `POST /api/Banners`
```json
{
  "title": "Khuyến mãi mùa hè 2026",
  "description": "Giảm đến 50% toàn bộ sản phẩm",
  "imageUrl": "/uploads/banner1.jpg",
  "linkUrl": "/shop",
  "order": 1,
  "isActive": true
}
```

---

### 👤 Users API (`/api/users`)
*Quản lý tài khoản người dùng quản trị (Admin/Editor)*

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/users` | Lấy danh sách tài khoản quản trị | ❌ |
| `GET` | `/api/users/{id}` | Lấy chi tiết một tài khoản quản trị theo ID | ❌ |
| `POST` | `/api/users` | Tạo mới tài khoản quản trị (mật khẩu tự động hash SHA256) | ❌ |
| `PUT` | `/api/users/{id}` | Cập nhật thông tin tài khoản quản trị | ❌ |
| `DELETE` | `/api/users/{id}` | Xóa tài khoản quản trị | ❌ |
| `GET` | `/api/users/delete/{id}` | Xóa tài khoản (alias dạng GET, dùng cho redirect) | ❌ |

#### Request Body — `POST /api/users`
```json
{
  "username": "admin01",
  "passwordHash": "matkhau123",
  "fullName": "Quản trị viên",
  "role": "Admin"
}
```

---

### 📧 Hệ Thống Email Tự Động

Hệ thống tích hợp **EmailService** gửi email qua **SMTP Gmail** (SSL/TLS, port 587) với 3 loại email tự động:

#### 1. 📦 Email Xác Nhận Đặt Hàng
- **Khi nào gửi:** Ngay sau khi khách hàng đặt hàng thành công (`POST /api/Orders`)
- **Tiêu đề:** `✅ Xác nhận đơn hàng #{orderId} - V.DinhCMS.GMGear`
- **Nội dung:** Tên khách hàng, mã đơn hàng, bảng chi tiết sản phẩm (tên, số lượng, đơn giá, thành tiền), tổng tiền, ghi chú đơn hàng
- **Lưu ý:** Lỗi gửi email **KHÔNG** làm thất bại đơn hàng (hệ thống ghi log và tiếp tục)

#### 2. 🔑 Email Quên Mật Khẩu
- **Khi nào gửi:** Khi khách hàng gọi `POST /api/Auth/forgot-password`
- **Tiêu đề:** `🔑 Khôi phục mật khẩu - V.DinhCMS.GMGear`
- **Nội dung:** Tên khách hàng, mật khẩu mới ngẫu nhiên 8 ký tự (hiển thị dạng monospace), cảnh báo bảo mật, nút "Đăng nhập ngay"
- **Cơ chế:** Tạo mật khẩu ngẫu nhiên → mã hóa SHA256+Salt → lưu DB → gửi mật khẩu rõ qua Email

#### 3. 🔔 Email Cập Nhật Trạng Thái Đơn Hàng
- **Khi nào gửi:** Mỗi lần admin cập nhật trạng thái (`PUT /api/Orders/{id}/status`)
- **Tiêu đề:** `🔔 Cập nhật trạng thái đơn hàng #{orderId} - V.DinhCMS.GMGear`
- **Nội dung:** Tên khách hàng, mã đơn hàng, trạng thái mới (màu sắc khác nhau theo trạng thái), tổng tiền
- **Màu sắc trạng thái trong Email:**
  - 🟠 **Chờ duyệt** (`status=0`) → `#FFA500`
  - 🔵 **Đang giao hàng** (`status=1`) → `#007BFF`
  - 🟢 **Đã hoàn thành** (`status=2`) → `#28A745`

#### Cấu Hình Email (`appsettings.json`)
```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "SenderEmail": "your-email@gmail.com",
    "SenderName": "VanDinhCMS GMGear",
    "AppPassword": "xxxx-xxxx-xxxx-xxxx"
  }
}
```

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
Hoặc nhấn **F5** trong Visual Studio. Backend sẽ chạy tại `https://localhost:7125`.

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

Truy cập **Swagger UI** để kiểm thử tất cả API trực tiếp trên trình duyệt:
```
https://localhost:{port}/swagger
```

### Ví dụ cURL

#### 🔐 Auth
```bash
# Đăng ký tài khoản mới
curl -X POST https://localhost:{port}/api/Auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Nguyễn Văn A","email":"a@gmail.com","password":"123456"}'

# Đăng nhập
curl -X POST https://localhost:{port}/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@gmail.com","password":"123456"}'

# Quên mật khẩu (gửi email tự động)
curl -X POST https://localhost:{port}/api/Auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"a@gmail.com"}'

# Lấy thông tin cá nhân
curl -X GET https://localhost:{port}/api/Auth/profile/1
```

#### 📝 Posts
```bash
# Lấy tất cả bài viết
curl -X GET https://localhost:{port}/api/Posts

# Lấy bài viết có phân trang
curl -X GET "https://localhost:{port}/api/Posts?page=1&pageSize=6"

# Lấy chi tiết bài viết
curl -X GET https://localhost:{port}/api/Posts/1

# Lấy bài viết theo danh mục
curl -X GET https://localhost:{port}/api/Posts/category/1
```

#### 🛍️ Products
```bash
# Lấy tất cả sản phẩm
curl -X GET https://localhost:{port}/api/Products

# Lọc sản phẩm nâng cao
curl -X GET "https://localhost:{port}/api/Products?categoryProductId=2&minPrice=100000&maxPrice=5000000&keyword=gaming&page=1&pageSize=12"

# Lấy sản phẩm mới nhất
curl -X GET https://localhost:{port}/api/Products/latest

# Lấy sản phẩm bán chạy
curl -X GET https://localhost:{port}/api/Products/hot
```

#### 📋 Orders
```bash
# Đặt hàng mới (tự động gửi email xác nhận)
curl -X POST https://localhost:{port}/api/Orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"notes":"Giao giờ hành chính","items":[{"productId":5,"quantity":2,"unitPrice":350000}]}'

# Cập nhật trạng thái đơn hàng (tự động gửi email thông báo)
curl -X PUT https://localhost:{port}/api/Orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":1}'

# Lấy lịch sử mua hàng của khách
curl -X GET https://localhost:{port}/api/Orders/customer/1
```

#### 🖼️ Banners
```bash
# Lấy banner đang kích hoạt (dành cho Frontend)
curl -X GET https://localhost:{port}/api/Banners

# Lấy toàn bộ banner (dành cho quản trị)
curl -X GET https://localhost:{port}/api/Banners/all
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
