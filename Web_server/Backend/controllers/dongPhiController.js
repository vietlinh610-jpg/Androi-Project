const { connectDB, sql } = require("../config/db");

// Route: //.../api/dongphi/dskt/:id
// 1. Lấy tất cả danh sách khoản thu ứng với hộ của nhân khẩu đó
const layDSKT = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await connectDB();

    // Lấy các khoản thu có trạng thái chưa nộp, đang chờ xác nhận hoặc bị từ chối
    const query = `
      SELECT
          kt.MaKhoanThu,
          kt.TenKhoanThu,
          kt.Loai,
          kt.SoTien,
          kt.NgayKetThuc AS HanNop,
          CASE
              WHEN tp.MaThuPhi IS NULL THEN N'Chưa nộp'
              WHEN tp.TuChoi = 1 THEN N'Từ chối'
              ELSE N'Chờ xác nhận'
          END AS TrangThai
      FROM nhan_khau nk
      JOIN ho_khau hk ON nk.MaHoKhau = hk.MaHoKhau
      JOIN khoan_thu kt ON 1 = 1
      LEFT JOIN thu_phi tp 
          ON tp.MaHoKhau = hk.MaHoKhau 
        AND tp.MaKhoanThu = kt.MaKhoanThu
      WHERE nk.MaNhanKhau = @id
      AND (
          tp.MaThuPhi IS NULL
          OR tp.DaXacNhan = 0
      ) AND kt.SoTien > 0 -- Day khong tinh khoan phi gui xe!

      UNION ALL -- Tính thêm phần phí gửi xe vào

      SELECT
          kt.MaKhoanThu,
          kt.TenKhoanThu,
          kt.Loai,
          ViewGx.PhiGuiXe AS SoTien,
          kt.NgayKetThuc AS HanNop,
          CASE
              WHEN tp.MaThuPhi IS NULL THEN N'Chưa nộp'
              WHEN tp.TuChoi = 1 THEN N'Từ chối'
              ELSE N'Chờ xác nhận'
          END AS TrangThai
      FROM nhan_khau nk
      JOIN ho_khau hk 
          ON nk.MaHoKhau = hk.MaHoKhau
      JOIN khoan_thu kt 
          ON kt.SoTien = 0  -- Phí gửi xe
      JOIN vw_phi_gui_xe_theo_ho ViewGx
          ON ViewGx.MaHoKhau = hk.MaHoKhau
      LEFT JOIN thu_phi tp
          ON tp.MaHoKhau = hk.MaHoKhau
        AND tp.MaKhoanThu = kt.MaKhoanThu
      WHERE nk.MaNhanKhau = @id
        AND ViewGx.PhiGuiXe > 0
        AND (
              tp.MaThuPhi IS NULL
              OR tp.DaXacNhan = 0
            );
    `;

    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(query);

    return res.status(200).json({
      message: "Lấy danh sách khoản thu thành công",
      data: result.recordset,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách khoản thu:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách khoản thu",
    });
  }
};

// Route: //.../api/dongphi/noptien
// 2. Xử lý khi hộ khẩu có mã hộ là id_hk đóng khoản thu có mã là id_kt
// Lấy id_hk từ id_nk
const dongPhi = async (req, res) => {
  try {
    const { id_nk, id_kt, soTien } = req.body;

    if (!id_nk || !id_kt || !soTien) {
      return res.status(400).json({
        message: "Thiếu mã hộ khẩu hoặc mã khoản thu",
      });
    }

    const pool = await connectDB();

    // Lấy ra mã hộ khẩu từ nhân khẩu để phục vụ đóng phí
    const getHoKhauQuery = `
      SELECT MaHoKhau
      FROM nhan_khau
      WHERE MaNhanKhau = @id_nk
    `;

    const hoKhauResult = await pool
      .request()
      .input("id_nk", sql.VarChar, id_nk)
      .query(getHoKhauQuery);

    if (hoKhauResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy nhân khẩu",
      });
    }

    const id_hk = hoKhauResult.recordset[0].MaHoKhau;

    // Kiểm tra xem hộ đã đóng phí này lần nào chưa?
    const checkQuery = `
      SELECT * FROM thu_phi
      WHERE MaHoKhau = @id_hk AND MaKhoanThu = @id_kt
    `;

    const checkResult = await pool
      .request()
      .input("id_hk", sql.VarChar, id_hk)
      .input("id_kt", sql.Int, id_kt)
      .query(checkQuery);

    // Nếu đóng lần đầu
    if (checkResult.recordset.length === 0) {
      const insertQuery = `
        INSERT INTO thu_phi (MaHoKhau, MaKhoanThu, SoTienPhaiThu, DaXacNhan, TuChoi, NgayDong)
        VALUES (@id_hk, @id_kt, @soTien, 0, 0, GETDATE())
      `;

      await pool
        .request()
        .input("id_hk", sql.VarChar, id_hk)
        .input("id_kt", sql.Int, id_kt)
        .input("soTien", sql.Decimal(18, 2), soTien)
        .query(insertQuery);

      return res.status(201).json({
        message: "Đã gửi yêu cầu đóng phí, đang chờ xác nhận",
      });
    }

    // Nếu đã đóng -> Khả năng là bị từ chối -> Nộp lại
    const updateQuery = `
      UPDATE thu_phi
      SET TuChoi = 0,
          DaXacNhan = 0,
          NgayDong = GETDATE()
      WHERE MaHoKhau = @id_hk AND MaKhoanThu = @id_kt
    `;

    await pool
      .request()
      .input("id_hk", sql.VarChar, id_hk)
      .input("id_kt", sql.Int, id_kt)
      .query(updateQuery);

    return res.status(200).json({
      message: "Đã gửi lại yêu cầu đóng phí, đang chờ xác nhận",
    });
  } catch (err) {
    console.error("Lỗi khi đóng phí:", err);
    return res.status(500).json({
      message: "Lỗi server khi cố gắng đóng phí",
    });
  }
};

// Route: //.../api/dongphi/lstt/:id
// 3. Lấy lịch sử thanh toán, là các khoản thu đã nộp
const lichsuTT = async (req, res) => {
  try {
    // Lấy id nhân khẩu
    const { id } = req.params;
    const pool = await connectDB();

    const query = `
      SELECT
          kt.TenKhoanThu,
          kt.Loai,
          tp.SoTienPhaiThu,
          tp.NgayDong
      FROM thu_phi tp
      JOIN khoan_thu kt ON tp.MaKhoanThu = kt.MaKhoanThu
      JOIN ho_khau hk ON tp.MaHoKhau = hk.MaHoKhau
      JOIN nhan_khau nk ON nk.MaHoKhau = hk.MaHoKhau
      WHERE nk.MaNhanKhau = @id_nk
      AND tp.DaXacNhan = 1
      ORDER BY tp.NgayDong DESC
    `;

    const result = await pool
      .request()
      .input("id_nk", sql.VarChar, id)
      .query(query);

    return res.status(201).json({
      message: "Lấy danh sách thành công",
      data: result.recordset,
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy lịch sử thanh toán" });
  }
};


module.exports = {
  layDSKT,
  dongPhi,
  lichsuTT,
};
