/*
 * Họ tên: Huỳnh Văn Định
 * MSSV: 2123110052
 * Version: 2.1
 * Mô tả: Dịch vụ gửi Email qua SMTP Gmail cho hệ thống VanDinhCMS
 * Cập nhật: Thiết kế lại giao diện Email theo bố cục table chuẩn (tương thích Outlook/Gmail/Apple Mail)
 */
using System.Net;
using System.Net.Mail;
using System.Text;

namespace CMS.Backend.Services
{
    /// <summary>
    /// Dịch vụ gửi Email thông qua SMTP Gmail
    /// Sử dụng App Password để xác thực an toàn (không dùng mật khẩu chính)
    /// </summary>
    public class EmailService
    {
        private readonly IConfiguration _config;

        // Bảng màu thương hiệu - đồng bộ xuyên suốt các template
        private const string ColorPrimary = "#005088";
        private const string ColorAccent = "#11CAA0";
        private const string ColorDark = "#0F1729";
        private const string ColorTextBody = "#3C4858";
        private const string ColorTextMuted = "#8A94A6";
        private const string ColorBgPage = "#EEF2F7";
        private const string ColorBorder = "#E6EBF1";

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Gửi email xác nhận đơn hàng cho khách hàng
        /// </summary>
        /// <param name="toEmail">Email khách hàng</param>
        /// <param name="customerName">Tên khách hàng</param>
        /// <param name="orderId">Mã đơn hàng</param>
        /// <param name="orderItems">Danh sách sản phẩm trong đơn</param>
        /// <param name="totalAmount">Tổng tiền đơn hàng</param>
        /// <param name="notes">Ghi chú đơn hàng</param>
        public async Task SendOrderConfirmationEmail(
            string toEmail,
            string customerName,
            int orderId,
            List<OrderEmailItem> orderItems,
            decimal totalAmount,
            string? notes)
        {
            var smtpServer = _config["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"] ?? "587");
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var senderName = _config["EmailSettings:SenderName"];
            var appPassword = _config["EmailSettings:AppPassword"];

            // Xây dựng nội dung Email HTML chuyên nghiệp
            var htmlBody = BuildOrderEmailTemplate(customerName, orderId, orderItems, totalAmount, notes);

            using var smtpClient = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, appPassword),
                EnableSsl = true, // Bật mã hóa SSL/TLS bắt buộc cho Gmail
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 30000 // Timeout 30 giây
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, senderName),
                Subject = $"✅ Xác nhận đơn hàng #{orderId} - V.DinhCMS.GMGear",
                Body = htmlBody,
                IsBodyHtml = true, // Cho phép gửi Email dạng HTML đẹp mắt
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            mailMessage.To.Add(new MailAddress(toEmail, customerName));

            await smtpClient.SendMailAsync(mailMessage);
        }

        /// <summary>
        /// Gửi email quên mật khẩu cho khách hàng
        /// </summary>
        public async Task SendForgotPasswordEmail(string toEmail, string customerName, string newPassword)
        {
            var smtpServer = _config["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"] ?? "587");
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var senderName = _config["EmailSettings:SenderName"];
            var appPassword = _config["EmailSettings:AppPassword"];

            var htmlBody = BuildForgotPasswordEmailTemplate(customerName, newPassword);

            using var smtpClient = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, appPassword),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 30000
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, senderName),
                Subject = $"🔑 Khôi phục mật khẩu - V.DinhCMS.GMGear",
                Body = htmlBody,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            mailMessage.To.Add(new MailAddress(toEmail, customerName));

            await smtpClient.SendMailAsync(mailMessage);
        }

        /// <summary>
        /// Template Email xác nhận đơn hàng dạng HTML chuyên nghiệp
        /// Sử dụng bố cục table-based để tương thích tối đa với các email client (Outlook, Gmail, Apple Mail...)
        /// </summary>
        private string BuildOrderEmailTemplate(
            string customerName,
            int orderId,
            List<OrderEmailItem> items,
            decimal totalAmount,
            string? notes)
        {
            int totalQuantity = items.Sum(i => i.Quantity);

            var itemsHtml = new StringBuilder();
            int stt = 1;
            foreach (var item in items)
            {
                var lineTotal = item.UnitPrice * item.Quantity;
                itemsHtml.Append($@"
                <tr>
                    <td style=""padding:16px 10px;border-bottom:1px solid {ColorBorder};font-family:Arial,Helvetica,sans-serif;font-size:13px;color:{ColorTextMuted};text-align:center;vertical-align:top;"">{stt++}</td>
                    <td style=""padding:16px 10px;border-bottom:1px solid {ColorBorder};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:{ColorDark};font-weight:600;vertical-align:top;"">{item.ProductName}</td>
                    <td style=""padding:16px 10px;border-bottom:1px solid {ColorBorder};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:{ColorTextBody};text-align:center;vertical-align:top;"">x{item.Quantity}</td>
                    <td style=""padding:16px 10px;border-bottom:1px solid {ColorBorder};font-family:Arial,Helvetica,sans-serif;font-size:13px;color:{ColorTextMuted};text-align:right;vertical-align:top;"">{item.UnitPrice:N0}&nbsp;₫</td>
                    <td style=""padding:16px 10px;border-bottom:1px solid {ColorBorder};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:{ColorAccent};font-weight:700;text-align:right;vertical-align:top;"">{lineTotal:N0}&nbsp;₫</td>
                </tr>");
            }

            var notesSection = string.IsNullOrEmpty(notes) ? "" : $@"
            <tr>
                <td style=""padding:0 32px 8px 32px;"">
                    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#FFF8E6;border-radius:10px;"">
                        <tr>
                            <td style=""padding:14px 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8A6D1B;line-height:1.6;"">
                                <strong>📝 Ghi chú đơn hàng:</strong> {notes}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>";

            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Xác nhận đơn hàng</title>
</head>
<body style=""margin:0;padding:0;background-color:{ColorBgPage};"">
<table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:{ColorBgPage};padding:32px 12px;"">
<tr>
<td align=""center"">
<table role=""presentation"" width=""640"" cellpadding=""0"" cellspacing=""0"" style=""width:640px;max-width:640px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,41,0.08);"">

    <!-- HEADER -->
    <tr>
        <td style=""background:linear-gradient(135deg,{ColorPrimary} 0%,{ColorAccent} 100%);background-color:{ColorPrimary};padding:36px 32px;text-align:center;"">
            <p style=""margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;"">Cảm ơn bạn đã mua hàng</p>
            <h1 style=""margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;"">V.DinhCMS.GMGear</h1>
        </td>
    </tr>

    <!-- ICON + TITLE -->
    <tr>
        <td style=""padding:36px 32px 8px 32px;text-align:center;"">
            <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" align=""center"" style=""margin:0 auto 14px auto;"">
                <tr><td style=""width:56px;height:56px;border-radius:50%;background-color:#E5F8F1;text-align:center;vertical-align:middle;font-size:28px;line-height:56px;"">✅</td></tr>
            </table>
            <h2 style=""margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:700;color:{ColorDark};"">Đặt hàng thành công!</h2>
            <p style=""margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:{ColorTextMuted};"">Chúng tôi đã nhận được đơn hàng và sẽ xử lý trong thời gian sớm nhất.</p>
        </td>
    </tr>

    <!-- ORDER INFO STRIP -->
    <tr>
        <td style=""padding:24px 32px 8px 32px;"">
            <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#F4F8FC;border:1px solid #DCEAF6;border-radius:12px;"">
                <tr>
                    <td style=""padding:18px 22px;width:50%;font-family:Arial,Helvetica,sans-serif;"">
                        <p style=""margin:0 0 3px 0;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;"">Khách hàng</p>
                        <p style=""margin:0;font-size:15px;font-weight:700;color:{ColorDark};"">{customerName}</p>
                    </td>
                    <td style=""padding:18px 22px;width:50%;font-family:Arial,Helvetica,sans-serif;border-left:1px solid #DCEAF6;"">
                        <p style=""margin:0 0 3px 0;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;"">Mã đơn hàng</p>
                        <p style=""margin:0;font-size:15px;font-weight:700;color:{ColorAccent};"">#{orderId}</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- ITEMS TABLE -->
    <tr>
        <td style=""padding:24px 32px 0 32px;"">
            <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"">
                <thead>
                    <tr>
                        <th style=""padding:0 10px 10px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;text-align:center;border-bottom:2px solid {ColorDark};"">#</th>
                        <th style=""padding:0 10px 10px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;text-align:left;border-bottom:2px solid {ColorDark};"">Sản phẩm</th>
                        <th style=""padding:0 10px 10px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;text-align:center;border-bottom:2px solid {ColorDark};"">SL</th>
                        <th style=""padding:0 10px 10px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;text-align:right;border-bottom:2px solid {ColorDark};"">Đơn giá</th>
                        <th style=""padding:0 10px 10px 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.5px;color:{ColorTextMuted};text-transform:uppercase;text-align:right;border-bottom:2px solid {ColorDark};"">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsHtml}
                </tbody>
            </table>
        </td>
    </tr>

    <!-- TOTAL -->
    <tr>
        <td style=""padding:22px 32px 0 32px;"">
            <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:linear-gradient(135deg,{ColorPrimary} 0%,{ColorAccent} 100%);background-color:{ColorPrimary};border-radius:12px;"">
                <tr>
                    <td style=""padding:18px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:rgba(255,255,255,0.9);"">
                        💰 Tổng thanh toán <span style=""color:rgba(255,255,255,0.65);font-size:12px;"">({totalQuantity} sản phẩm)</span>
                    </td>
                    <td style=""padding:18px 24px;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:23px;font-weight:800;color:#FFFFFF;letter-spacing:0.3px;"">
                        {totalAmount:N0}&nbsp;₫
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    {notesSection}

    <!-- DELIVERY NOTE -->
    <tr>
        <td style=""padding:22px 32px 0 32px;"">
            <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#EEF8F0;border-radius:10px;"">
                <tr>
                    <td style=""padding:16px 20px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#2E7D4F;line-height:1.7;"">
                        🚚 Đơn hàng sẽ được giao đến bạn trong thời gian sớm nhất.<br/>
                        Cần hỗ trợ? Gọi hotline <strong>090x.xxx.xxx</strong>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- SPACER -->
    <tr><td style=""padding-top:32px;""></td></tr>

    <!-- FOOTER -->
    <tr>
        <td style=""background-color:{ColorDark};padding:26px 32px;text-align:center;"">
            <p style=""margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.75);"">
                © 2026 V.DinhCMS.GMGear — Huỳnh Văn Định (MSSV: 2123110052)
            </p>
            <p style=""margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.45);"">
                Đây là email tự động, vui lòng không trả lời lại email này.
            </p>
        </td>
    </tr>

</table>
</td>
</tr>
</table>
</body>
</html>";
        }

        /// <summary>
        /// Template Email quên mật khẩu
        /// Sử dụng bố cục table-based để tương thích tối đa với các email client
        /// </summary>
        private string BuildForgotPasswordEmailTemplate(string customerName, string newPassword)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Khôi phục mật khẩu</title>
</head>
<body style=""margin:0;padding:0;background-color:{ColorBgPage};"">
<table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:{ColorBgPage};padding:32px 12px;"">
<tr>
<td align=""center"">
<table role=""presentation"" width=""520"" cellpadding=""0"" cellspacing=""0"" style=""width:520px;max-width:520px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,41,0.08);"">

    <!-- HEADER -->
    <tr>
        <td style=""background:linear-gradient(135deg,{ColorPrimary} 0%,{ColorAccent} 100%);background-color:{ColorPrimary};padding:36px 32px;text-align:center;"">
            <p style=""margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;"">Bảo mật tài khoản</p>
            <h1 style=""margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;"">V.DinhCMS.GMGear</h1>
        </td>
    </tr>

    <!-- ICON + GREETING -->
    <tr>
        <td style=""padding:36px 32px 6px 32px;text-align:center;"">
            <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" align=""center"" style=""margin:0 auto 14px auto;"">
                <tr><td style=""width:56px;height:56px;border-radius:50%;background-color:#FFF3D6;text-align:center;vertical-align:middle;font-size:28px;line-height:56px;"">🔑</td></tr>
            </table>
            <h2 style=""margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:{ColorDark};"">Xin chào, {customerName}!</h2>
            <p style=""margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:{ColorTextMuted};"">Chúng tôi đã đặt lại mật khẩu mới cho tài khoản của bạn.</p>
        </td>
    </tr>

    <!-- NEW PASSWORD BOX -->
    <tr>
        <td style=""padding:26px 32px 0 32px;"">
            <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#FFF8E6;border:1.5px dashed #E8B93B;border-radius:14px;"">
                <tr>
                    <td style=""padding:22px 20px;text-align:center;"">
                        <p style=""margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#9A7B1E;text-transform:uppercase;font-weight:700;"">Mật khẩu mới của bạn</p>
                        <p style=""margin:0;font-family:'Courier New',monospace;font-size:26px;font-weight:800;color:{ColorPrimary};letter-spacing:3px;"">{newPassword}</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- WARNING -->
    <tr>
        <td style=""padding:18px 32px 0 32px;"">
            <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color:#FDECEC;border-radius:10px;"">
                <tr>
                    <td style=""padding:14px 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#A33A3A;line-height:1.6;"">
                        ⚠️ <strong>Lưu ý bảo mật:</strong> Vui lòng đăng nhập và đổi mật khẩu mới ngay để đảm bảo an toàn cho tài khoản của bạn.
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- CTA BUTTON -->
    <tr>
        <td style=""padding:28px 32px 6px 32px;text-align:center;"">
            <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" align=""center"">
                <tr>
                    <td style=""background:linear-gradient(135deg,{ColorPrimary} 0%,{ColorAccent} 100%);background-color:{ColorPrimary};border-radius:30px;"">
                        <a href=""http://localhost:3000/login"" style=""display:inline-block;padding:14px 40px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.3px;"">Đăng nhập ngay</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- SPACER -->
    <tr><td style=""padding-top:30px;""></td></tr>

    <!-- FOOTER -->
    <tr>
        <td style=""background-color:{ColorDark};padding:26px 32px;text-align:center;"">
            <p style=""margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.75);"">
                © 2026 V.DinhCMS.GMGear — Huỳnh Văn Định (MSSV: 2123110052)
            </p>
            <p style=""margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,0.45);"">
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
        </td>
    </tr>

</table>
</td>
</tr>
</table>
</body>
</html>";
        }

        /// <summary>
        /// Gửi email thông báo thay đổi trạng thái đơn hàng cho khách hàng
        /// </summary>
        public async Task SendOrderStatusUpdateEmail(
            string toEmail,
            string customerName,
            int orderId,
            int status,
            decimal totalAmount)
        {
            var smtpServer = _config["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"] ?? "587");
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var senderName = _config["EmailSettings:SenderName"];
            var appPassword = _config["EmailSettings:AppPassword"];

            string statusText = status switch
            {
                0 => "Chờ duyệt (Đang xử lý)",
                1 => "Đang giao hàng",
                2 => "Đã hoàn thành",
                _ => "Đã cập nhật"
            };

            string statusColor = status switch
            {
                0 => "#FFA500", // Orange
                1 => "#007BFF", // Blue
                2 => "#28A745", // Green
                _ => "#6C757D"
            };

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Cập nhật trạng thái đơn hàng #{orderId}</title>
</head>
<body style='margin: 0; padding: 0; background-color: {ColorBgPage}; font-family: ""Times New Roman"", Times, serif;'>
    <table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='border-collapse: collapse; background-color: #ffffff; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
        <tr>
            <td bgcolor='{ColorPrimary}' style='padding: 30px 20px; text-align: center; color: #ffffff;'>
                <h1 style='margin: 0; font-size: 24px; color: #ffffff;'>CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG</h1>
                <p style='margin: 10px 0 0 0; font-size: 14px; color: #ffffff;'>Đơn hàng #{orderId} - V.DinhCMS.GMGear</p>
            </td>
        </tr>
        <tr>
            <td style='padding: 30px 20px; color: {ColorTextBody}; line-height: 1.6;'>
                <p>Xin chào <strong>{customerName}</strong>,</p>
                <p>Chúng tôi xin thông báo trạng thái đơn hàng <strong>#{orderId}</strong> của bạn đã được cập nhật:</p>
                
                <table border='0' cellpadding='10' cellspacing='0' width='100%' style='background-color: #f8f9fa; border-radius: 4px; margin: 20px 0;'>
                    <tr>
                        <td width='40%' style='font-weight: bold;'>Trạng thái mới:</td>
                        <td style='color: {statusColor}; font-weight: bold; font-size: 16px;'>{statusText}</td>
                    </tr>
                    <tr>
                        <td style='font-weight: bold;'>Tổng tiền đơn hàng:</td>
                        <td style='font-weight: bold;'>{totalAmount:N0} VNĐ</td>
                    </tr>
                </table>

                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email support hoặc số điện thoại hotline của cửa hàng.</p>
                <p>Trân trọng,<br/><strong>V.DinhCMS.GMGear Team</strong></p>
            </td>
        </tr>
        <tr>
            <td bgcolor='#f8f9fa' style='padding: 20px; text-align: center; font-size: 12px; color: {ColorTextMuted}; border-top: 1px solid {ColorBorder};'>
                <p style='margin: 0;'>Đây là email tự động từ hệ thống VanDinhCMS. Vui lòng không phản hồi email này.</p>
            </td>
        </tr>
    </table>
</body>
</html>";

            using var smtpClient = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, appPassword),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 30000
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, senderName),
                Subject = $"🔔 Cập nhật trạng thái đơn hàng #{orderId} - V.DinhCMS.GMGear",
                Body = htmlBody,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            mailMessage.To.Add(new MailAddress(toEmail, customerName));

            await smtpClient.SendMailAsync(mailMessage);
        }
    }


    /// <summary>
    /// DTO chứa thông tin sản phẩm gửi trong Email đơn hàng
    /// </summary>
    public class OrderEmailItem
    {
        public string ProductName { get; set; } = "";
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}