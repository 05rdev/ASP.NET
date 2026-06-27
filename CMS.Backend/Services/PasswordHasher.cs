using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Services
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            var salt = "VanDinhCMS_Salt_2026"; // Salt cố định cho hệ thống
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
            return Convert.ToBase64String(bytes);
        }
    }
}
