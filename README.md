# Library Management Backend

[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Đây là phần backend của hệ thống quản lý mượn sách, được phát triển để cung cấp các API cho ứng dụng frontend. Backend này chịu trách nhiệm xử lý logic nghiệp vụ, quản lý dữ liệu với cơ sở dữ liệu MongoDB và đảm bảo các chức năng bảo mật như xác thực và phân quyền người dùng.

## 1. Giới thiệu

Library Management Backend là trái tim của hệ thống quản lý mượn sách, được xây dựng với Node.js và framework Express.js. Nó đóng vai trò là cầu nối giữa giao diện người dùng (frontend) và cơ sở dữ liệu, quản lý tất cả các hoạt động liên quan đến sách, độc giả, nhân viên, tác giả, nhà xuất bản và các giao dịch mượn trả.

**Các công nghệ chính được sử dụng:**

* **Node.js:** Môi trường runtime JavaScript phía máy chủ, cung cấp nền tảng vững chắc cho ứng dụng backend.
* **Express.js:** Framework web mạnh mẽ và linh hoạt cho Node.js, dùng để xây dựng các API RESTful.
* **MongoDB:** Cơ sở dữ liệu NoSQL dựa trên tài liệu, cung cấp khả năng lưu trữ dữ liệu linh hoạt và mở rộng.
* **Mongoose:** Thư viện Object Data Modeling (ODM) cho MongoDB, giúp tương tác với cơ sở dữ liệu một cách dễ dàng và có cấu trúc.
* **JSON Web Token (JWT):** Dùng để xác thực và phân quyền người dùng (Độc giả và Nhân viên), đảm bảo an toàn và cá nhân hóa trải nghiệm.
* **Bcryptjs:** Thư viện để mã hóa mật khẩu, tăng cường bảo mật thông tin người dùng.
* **Multer:** Middleware xử lý tải lên tệp (file uploads), đặc biệt hữu ích cho việc quản lý ảnh (ví dụ: ảnh bìa sách).
* **Nodemailer:** Module dùng để gửi email, được tích hợp cho các chức năng như gửi mã OTP (One-Time Password) để đặt lại mật khẩu.
* **Cors:** Middleware cho phép các yêu cầu từ các miền khác (ví dụ: frontend chạy trên một cổng khác) truy cập vào API backend.
* **Dotenv:** Giúp quản lý các biến môi trường, bảo mật thông tin nhạy cảm.
* **Socket.IO:** Thư viện cho phép giao tiếp thời gian thực dựa trên sự kiện giữa máy chủ và trình duyệt (có thể dùng cho thông báo hoặc các tương tác động khác).

## 2. Yêu cầu hệ thống

Trước khi khởi tạo và chạy dự án, hãy đảm bảo bạn đã cài đặt các công cụ sau:

* **Node.js** (Phiên bản khuyến nghị: LTS - 18.x trở lên)
* **npm** (Thường đi kèm với Node.js)
* **MongoDB** (Đảm bảo MongoDB server đang chạy, hoặc sử dụng MongoDB Atlas cloud database)

## 3. Khởi tạo dự án

Thực hiện các bước sau để thiết lập dự án backend:

1.  **Clone repository:**
    ```bash
    git clone <URL_TO_YOUR_REPOSITORY>
    cd backend
    ```
    *(Thay `<URL_TO_YOUR_REPOSITORY>` bằng URL repository của bạn)*

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```
    Lệnh này sẽ cài đặt tất cả các thư viện được liệt kê trong `dependencies` và `devDependencies` của file `package.json`.

3.  **Tạo file cấu hình môi trường (.env):**
    Tạo một file có tên `.env` ở thư mục gốc của dự án backend và cấu hình các biến môi trường cần thiết. Đây là một ví dụ cơ bản (bạn cần thay thế các giá trị bằng thông tin thực tế của mình):

    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/library_db
    JWT_SECRET=your_jwt_secret_key_here
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_app_password_here
    EMAIL_SERVICE=your_email_service
    EMAIL_PORT=your_email_port
    EMAIL_HOST=your_email_host
    ```
    * `PORT`: Cổng mà server backend sẽ chạy.
    * `MONGODB_URI`: Chuỗi kết nối đến cơ sở dữ liệu MongoDB của bạn.
    * `JWT_SECRET`: Khóa bí mật dùng để ký và xác minh JWT. Nên là một chuỗi ngẫu nhiên, phức tạp và bảo mật.
    * `EMAIL_USER`: Địa chỉ email được sử dụng để gửi mã OTP và các thông báo khác.
    * `EMAIL_PASS`: Mật khẩu ứng dụng (App Password) hoặc mật khẩu của tài khoản email đã cấu hình. (Lưu ý: Không sử dụng mật khẩu tài khoản chính nếu không cần thiết, hãy dùng App Password nếu dịch vụ email của bạn hỗ trợ).
    * `EMAIL_SERVICE`: Dịch vụ email mà bạn đang sử dụng(gmail, yahoo...).
    * `EMAIL_PORT`: port email mà bạn đang sử dụng(gmail, yahoo...).
    * `EMAIL_HOST`: Host email mà bạn đang sử dụng(gmail, yahoo...).
      


## 4. Chạy dự án

Dự án backend có hai chế độ chạy chính:

1.  **Chạy ở chế độ phát triển (Development Mode):**
    Sử dụng `nodemon` để tự động khởi động lại server mỗi khi có thay đổi trong mã nguồn, rất tiện lợi cho quá trình phát triển.
    ```bash
    npm run dev
    ```
    Server sẽ khởi động và lắng nghe trên cổng được cấu hình trong `.env` (mặc định là 5000).

2.  **Chạy ở chế độ sản phẩm (Production Mode):**
    Sử dụng `node` để chạy server. Chế độ này thích hợp cho môi trường triển khai thực tế.
    ```bash
    npm start
    ```
    Server sẽ khởi động và lắng nghe trên cổng được cấu hình trong `.env` (mặc định là 5000).

Sau khi server khởi động thành công, backend của bạn đã sẵn sàng để nhận các yêu cầu API từ frontend.
