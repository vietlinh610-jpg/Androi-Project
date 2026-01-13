# Project-IT3180

Phần mềm quản lý chung cư Blue Moon.

Ứng dụng web hỗ trợ quản lý hộ khẩu, nhân khẩu, thu phí, gửi xe và vận hành chung cư.

## Công nghệ sử dụng

- Frontend: ReactJS

- Backend: NodeJS (Express)

- Database : SQL Server

## Cài đặt

### Backend:

Yêu cầu môi trường: Node.js >= 18, SQL Server 2019 trở lên.

1. Tạo sql server database

```
Cài đặt sql server
Tạo database mới
Chạy file Backend/schema.sql để tạo bảng\
(Tùy chọn) Chạy file Backend/seed.sql để sinh dữ liệu mẫu
```

2. Tạo biến môi trường (tạo file .env trong folder backend):

```
DB_USER= $USER
DB_PASS= $PASSWORD
DB_SERVER= $SERVER_NAME
DB_NAME= $DATABASE_NAME
PORT=5000
```

3. Cài đặt và chạy

```
cd Backend
npm i
node server.js
```

### Frontend:

Yêu cầu môi trường: Node.js >= 18, npm v >= 10

1. Cài đặt và chạy

```
cd Frontend
npm i
npm run dev
```

## Ghi chú

Khi mới vào hệ thống, nhập tên đăng nhập là 'admin' và mật khẩu là '123456' để vào vai trò quản trị viên.