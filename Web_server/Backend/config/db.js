const sql = require("mssql");
require("dotenv").config();

// Khởi tạo kết nối tới db
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Trả về kết nối
const connectDB = async () => {
  try {
    let pool = await sql.connect(config);
    console.log("✅ Đã kết nối SQL Server thành công!");
    return pool;
  } catch (err) {
    console.log("❌ Lỗi kết nối Database:", err.message);
  }
};

module.exports = { connectDB, sql };
