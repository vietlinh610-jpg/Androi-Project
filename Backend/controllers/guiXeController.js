const { connectDB, sql } = require("../config/db");

// Route: //.../api/guixe/:id
// 1. Thêm danh sách gửi xe ứng với hộ khẩu nào đó
// id : mã hộ khẩu cần gửi xe
// body : {"loaixe" :  "Xe máy hoặc ô tô", "BKS" : bks};
const themGuiXe = async (req, res) => {
  try {
    const { id } = req.params;
    const { LoaiXe, BKS } = req.body;

    const pool = await connectDB();

    const query = `
    insert into dang_ky_gui_xe(MaHoKhau, LoaiXe, BienKiemSoat)
    values (@MaHoKhau, @LoaiXe, @BKS);
    `;

    await pool
      .request()
      .input("MaHoKhau", sql.VarChar, id)
      .input("LoaiXe", sql.NVarChar, LoaiXe)
      .input("BKS", sql.VarChar, BKS)
      .query(query);

    return res.status(201).json({
      message: "Thêm đăng ký gửi xe thành công",
    });
  } catch (err) {
    console.error("Lỗi khi tạo gửi xe:", err);
    return res.status(500).json({
      message: "Lỗi server khi tạo gửi xe",
    });
  }
};

// Route: //.../api/guixe/xoa/:id
// Ngược lại : Xóa một phương tiện nào đó khỏi bãi gửi xe (ngừng gửi)
// Coi như hộ đó không gửi xe nữa!
const xoaGuiXe = async (req, res) => {
  try {
    // id : biển kiểm soát của xe
    const { id } = req.params;

    const pool = await connectDB();
    // Xóa phương tiện khỏi hộ!
    await pool.request().input("BienKiemSoat", sql.VarChar, id).query(`
        DELETE FROM dang_ky_gui_xe
        WHERE BienKiemSoat = @BienKiemSoat
      `);

    return res.status(200).json({
      message: "Xóa phương tiện gửi xe thành công",
    });
  } catch (err) {
    console.error("Lỗi khi xóa gửi xe:", err);
    return res.status(500).json({
      message: "Lỗi server khi xóa gửi xe",
    });
  }
};

// Route: //.../api/guixe/dsgx
// 3. Lấy tất cả danh sách gửi xe
const layDSGX = async (req, res) => {
  try {
    const pool = await connectDB();

    const query = `
      SELECT d.MaHoKhau, ch.HoTen as hoTenChuHo, d.LoaiXe, d.BienKiemSoat
      FROM dang_ky_gui_xe d
      JOIN ho_khau h ON d.MaHoKhau = h.MaHoKhau
      JOIN nhan_khau ch on ch.MaHoKhau = h.MaHoKhau and ch.QuanHeVoiChuHo = N'Chủ hộ';
    `;

    const result = await pool.request().query(query);

    return res.status(200).json({
      message: "Lấy danh sách gửi xe thành công",
      data: result.recordset,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách gửi xe:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách gửi xe",
    });
  }
};

// export
module.exports = {
  themGuiXe,
  xoaGuiXe,
  layDSGX,
};
