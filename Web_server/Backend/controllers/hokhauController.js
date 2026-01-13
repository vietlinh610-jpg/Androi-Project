const { connectDB, sql } = require("../config/db");

// 1. LẤY DANH SÁCH HỘ KHẨU
const getListHoKhau = async (req, res) => {
  try {
    const pool = await connectDB();
    const query = `
            SELECT 
                HK.MaHoKhau,
                HK.DiaChiThuongTru,
                HK.NoiCap,
                HK.NgayCap,
                (SELECT COUNT(*) FROM nhan_khau NK WHERE NK.MaHoKhau = HK.MaHoKhau) AS SoThanhVien
            FROM ho_khau HK
        `;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

// 2. THÊM HỘ KHẨU MỚI
const createHoKhau = async (req, res) => {
  try {
    const { MaHoKhau, DiaChiThuongTru, NoiCap, NgayCap } = req.body;
    const pool = await connectDB();

    await pool
      .request()
      .input("MaHoKhau", sql.VarChar, MaHoKhau)
      .input("DiaChiThuongTru", sql.NVarChar, DiaChiThuongTru)
      .input("NoiCap", sql.NVarChar, NoiCap)
      .input("NgayCap", sql.Date, NgayCap).query(`
                INSERT INTO ho_khau (MaHoKhau, DiaChiThuongTru, NoiCap, NgayCap)
                VALUES (@MaHoKhau, @DiaChiThuongTru, @NoiCap, @NgayCap)
            `);

    res.status(201).json({ message: "Thêm hộ khẩu thành công!" });
  } catch (err) {
    if (err.number === 2627) {
      return res.status(409).json({ message: "Mã hộ khẩu này đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 3. SỬA HỘ KHẨU (Inline Edit: Địa chỉ, Nơi cấp, Ngày cấp)
const updateHoKhau = async (req, res) => {
  try {
    const { id } = req.params;
    const { DiaChiThuongTru, NoiCap, NgayCap } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("MaHoKhau", sql.VarChar, id)
      .input("DiaChiThuongTru", sql.NVarChar, DiaChiThuongTru)
      .input("NoiCap", sql.NVarChar, NoiCap)
      .input("NgayCap", sql.Date, NgayCap).query(`
                UPDATE ho_khau 
                SET DiaChiThuongTru = @DiaChiThuongTru, 
                    NoiCap = @NoiCap, 
                    NgayCap = @NgayCap
                WHERE MaHoKhau = @MaHoKhau
            `);

    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

// 4. XÓA HỘ KHẨU (XÓA SẠCH CẢ NHÂN KHẨU)
const deleteHoKhau = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    const query = `
            -- Bước 1: Xóa tất cả Nhân khẩu thuộc hộ này trước
            DELETE FROM nhan_khau WHERE MaHoKhau = @MaHoKhau;

            -- Bước 2: Sau khi sạch nhân khẩu thì xóa Hộ khẩu
            DELETE FROM ho_khau WHERE MaHoKhau = @MaHoKhau;
        `;

    await pool.request().input("MaHoKhau", sql.VarChar, id).query(query);

    res
      .status(200)
      .json({ message: "Đã xóa vĩnh viễn Hộ khẩu và toàn bộ thành viên!" });
  } catch (err) {
    // Log lỗi ra để dễ debug nếu có bảng khác (ví dụ TamTru, TamVang) đang tham chiếu tới
    console.error(err);
    res.status(500).json({ message: "Lỗi xóa dữ liệu", error: err.message });
  }
};

const getThongTinChuHo = async (req, res) => {
  const { maHoKhau } = req.params;
  try {
    const pool = await connectDB();

    // 1. Kiểm tra xem Mã hộ khẩu có tồn tại không
    const checkHK = await pool
      .request()
      .input("MaHoKhau", sql.VarChar, maHoKhau)
      .query("SELECT MaHoKhau FROM ho_khau WHERE MaHoKhau = @MaHoKhau");

    if (checkHK.recordset.length === 0) {
      return res.status(404).json({ message: "Mã hộ khẩu này không tồn tại!" });
    }

    // 2. Nếu tồn tại, lấy thông tin CHỦ HỘ
    const result = await pool.request().input("MaHoKhau", sql.VarChar, maHoKhau)
      .query(`
                SELECT HoTen, SoCCCD 
                FROM nhan_khau 
                WHERE MaHoKhau = @MaHoKhau AND QuanHeVoiChuHo = N'Chủ hộ'
            `);

    if (result.recordset.length === 0) {
      return res
        .status(400)
        .json({ message: "Hộ khẩu này chưa khai báo Chủ hộ!" });
    }

    // 3. Trả về tên và CCCD
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getListHoKhau,
  createHoKhau,
  updateHoKhau,
  deleteHoKhau,
  getThongTinChuHo,
};
