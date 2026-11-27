# Giải đấu Liên Quân

Trang web giải đấu Liên Quân Mobile chạy hoàn toàn trên trình duyệt (điện thoại và máy tính). Người chơi đăng ký thi đấu, xem lịch, kết quả và bảng xếp hạng, trò chuyện, mua vật phẩm trang trí bằng coin và **nạp coin tự động** bằng chuyển khoản QR. Ban tổ chức quản lý giải qua một trang quản trị riêng.

**Địa chỉ trang:** https://songgohanvippro-create.github.io/Pvp/

> **Trạng thái:** đang phát triển. Dữ liệu giải đấu (đội, trận, chat, tài khoản giải) hiện lưu trong trình duyệt của từng máy. Phần **nạp coin** đã dùng máy chủ thật (Supabase + PayOS). Xem mục [Lộ trình](#lộ-trình).

## Tính năng

### Dành cho người chơi
- **Đăng ký, đăng nhập** bằng tên tài khoản và mã đăng nhập; có đổi tên tài khoản và lấy lại mã khi quên.
- **Đăng ký tham gia** giải đấu.
- **Lịch và kết quả** các trận theo vòng tròn.
- **Xếp hạng đội đấu** và **xếp hạng cá nhân** (Siêu hạ gục, Siêu hỗ trợ, Siêu MVP).
- **Thông tin giải** và **thông báo chung** từ ban tổ chức (biểu tượng chuông).
- **Chat** theo ba kênh: Tất cả, Nhóm, Cá nhân.
- **Avatar cá nhân** và **khung avatar** (Vàng, Tím, Lam, Rồng Xương, Tết Tiên Hi, Ma Tu động...).
- **Cửa hàng** (biểu tượng 🛍️) với hai tab: **Nạp coin** và **Vật phẩm**.

### Dành cho ban tổ chức (trang quản trị)
- Gửi thông báo chung cho tất cả người chơi.
- Xem tài khoản đã đăng ký và danh sách người chơi đăng ký.
- **Phát coin** cho người chơi.
- **Sắp đội** theo số sao (cùng cấp hoặc cân bằng sức mạnh, đội 3 / 4 / 5 người), thêm đội.
- **Tạo lịch vòng tròn** và nhập kết quả.
- Đặt lại dữ liệu mẫu.

## Nạp coin tự động

| Số tiền | Coin nhận được |
| --- | --- |
| 10.000 VND | 10.000 coin |
| 20.000 VND | 20.000 coin |

1. Người chơi mở cửa hàng, tab **Nạp coin**, đăng ký hoặc đăng nhập tài khoản ví (email và mật khẩu).
2. Chọn gói nạp. Trang gọi hàm `create-order` (Supabase Edge Function) để tạo đơn và link thanh toán PayOS.
3. Người chơi quét mã QR bằng ứng dụng ngân hàng để thanh toán.
4. PayOS gửi thông báo (webhook) tới hàm `payos-webhook`. Hàm kiểm tra chữ ký, đối chiếu mã đơn và số tiền rồi cộng coin.
5. Mỗi đơn chỉ được cộng coin **một lần**, kể cả khi PayOS gửi thông báo lặp.
6. Người chơi quay về trang và thấy số dư mới (có nút **Làm mới**).

Số dư coin được lưu trên máy chủ. Người chơi chỉ **xem** được số dư của mình và không thể tự sửa.

## Cấu trúc thư mục

| File | Mô tả |
| --- | --- |
| `index.html` | Toàn bộ giao diện và mã chạy phía trình duyệt |
| `firebase-config.js` | Cấu hình Firebase (chỉ cần khi dùng Firebase cho dữ liệu giải đấu, chưa bắt buộc) |
| `README.md` | Tài liệu này |

## Công nghệ

- **GitHub Pages**: lưu và phát trang web.
- **Supabase**: tài khoản ví, số dư coin, đơn nạp, lịch sử coin, Edge Functions (`create-order`, `payos-webhook`).
- **PayOS**: cổng thanh toán QR, liên kết với tài khoản ngân hàng nhận tiền.
- **Firebase** (dự kiến): dữ liệu giải đấu dùng chung như đội, trận, bảng xếp hạng.

## Triển khai

1. Tải `index.html` lên repository (tên file đúng là `index.html`).
2. Vào **Settings → Pages**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi **Save**.
3. Trong Supabase, mục **Edge Functions → Secrets**, đặt các biến: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` và `SITE_URL` (địa chỉ trang ở trên).
4. Trong kênh thanh toán PayOS, khai báo Webhook URL trỏ tới hàm `payos-webhook`.
5. Thử nạp gói 10.000 VND để kiểm tra coin được cộng đúng một lần.

## Bảo mật

Repository này **công khai**, vì vậy **không bao giờ** đưa các thông tin sau vào file nào trong repository:

- Client ID, API Key, Checksum Key của PayOS.
- Khóa `service_role` hoặc `secret` của Supabase.
- Mật khẩu database hoặc mật khẩu tài khoản bất kỳ.

Các khóa này chỉ nằm trong phần **Secrets** của Supabase. Trong mã chỉ có khóa **công khai** (`publishable` của Supabase, cấu hình web của Firebase), vốn được thiết kế để nằm trong mã phía trình duyệt. Dữ liệu được bảo vệ bằng quy tắc bảo mật dòng (Row Level Security) của Supabase: người chơi chỉ xem được dữ liệu của chính mình, mọi thay đổi coin đều đi qua máy chủ.

## Lộ trình

- [x] Nạp coin tự động qua PayOS và Supabase.
- [ ] Chuyển dữ liệu giải đấu (đội, trận, xếp hạng) sang Firebase để mọi người dùng chung.
- [ ] Mua vật phẩm bằng coin thật trên máy chủ.
- [ ] Mục **Thông tin cá nhân** trong trang quản trị (tên, hệ điều hành, thiết bị, IP khi đăng nhập), kèm thông báo cho người chơi.
