const { connectDB, sql } = require("../config/db");

// 1. Tạo khoản thu mới
const taoKhoanThu = async (req, res) => {
  try {
    // Lấy dữ liệu từ request
    const { TenKhoanThu, GhiChu, Loai, SoTien, NgayBatDau, NgayKetThuc } =
      req.body;

    if (!TenKhoanThu || !Loai || SoTien == null || SoTien == undefined || !NgayBatDau || !NgayKetThuc) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const query = `
        INSERT INTO khoan_thu
            (TenKhoanThu, GhiChu, Loai, SoTien, NgayBatDau, NgayKetThuc)
        VALUES
            (@TenKhoanThu, @GhiChu, @Loai, @SoTien, @NgayBatDau, @NgayKetThuc)
    `;

    const pool = await connectDB();
    // Thêm khoản thu vào db
    await pool
      .request()
      .input("TenKhoanThu", sql.NVarChar, TenKhoanThu)
      .input("GhiChu", sql.NVarChar, GhiChu || null)
      .input("Loai", sql.NVarChar, Loai)
      .input("SoTien", sql.Decimal(18, 2), SoTien)
      .input("NgayBatDau", sql.Date, NgayBatDau)
      .input("NgayKetThuc", sql.Date, NgayKetThuc)
      .query(query);

    return res.status(201).json({
      message: "Tạo khoản thu thành công",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi không xác định",
    });
  }
};

// 2. Lấy danh sách các khoản thu hiện có
// ! Khi hệ thống quá lớn, có thể phải sửa lại thành lấy trong vài tháng nhất định
const layKhoanThu = async (req, res) => {
  try {
    const pool = await connectDB();

    const query = `
      SELECT 
        MaKhoanThu,
        TenKhoanThu,
        GhiChu,
        Loai,
        SoTien,
        NgayBatDau,
        NgayKetThuc
      FROM khoan_thu
      ORDER BY NgayBatDau DESC
    `;
    // Truy vấn lấy khoản thu
    const result = await pool.request().query(query);
    
    return res.status(200).json({
      data: result.recordset,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Lỗi không xác định",
    });
  }
};

module.exports = {
  taoKhoanThu,
  layKhoanThu,
};
