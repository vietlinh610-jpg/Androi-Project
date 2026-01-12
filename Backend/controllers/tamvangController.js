const { connectDB, sql } = require("../config/db");

// 1. LẤY DANH SÁCH
const getListTamVang = async (req, res) => {
  try {
    const pool = await connectDB();
    const query = `
            SELECT 
                TV.ID,
                TV.MaNhanKhau,
                TV.NgayDi,
                TV.NgayVe,
                TV.LyDo,
                NK.HoTen,
                NK.SoCCCD,
                NK.MaHoKhau
            FROM tam_vang TV
            JOIN nhan_khau NK ON TV.MaNhanKhau = NK.MaNhanKhau
            ORDER BY TV.ID DESC
        `;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

// 2. THÊM MỚI
const createTamVang = async (req, res) => {
  try {
    // SQL mới không có MaHoKhau
    const { MaNhanKhau, NgayDi, NgayVe, LyDo } = req.body;
    const pool = await connectDB();

    const checkNK = await pool
      .request()
      .input("MaNK", sql.VarChar, MaNhanKhau)
      .query("SELECT HoTen FROM nhan_khau WHERE MaNhanKhau = @MaNK");

    if (checkNK.recordset.length === 0) {
      return res.status(404).json({ message: "Mã nhân khẩu không tồn tại!" });
    }

    await pool
      .request()
      .input("MaNhanKhau", sql.VarChar, MaNhanKhau)
      .input("NgayDi", sql.Date, NgayDi)
      .input("NgayVe", sql.Date, NgayVe)
      .input("LyDo", sql.NVarChar, LyDo).query(`
                INSERT INTO tam_vang (MaNhanKhau, NgayDi, NgayVe, LyDo)
                VALUES (@MaNhanKhau, @NgayDi, @NgayVe, @LyDo)
            `);

    res.status(201).json({ message: "Đăng ký tạm vắng thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. CẬP NHẬT
const updateTamVang = async (req, res) => {
  try {
    const { id } = req.params;
    const { NgayDi, NgayVe, LyDo } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("NgayDi", sql.Date, NgayDi)
      .input("NgayVe", sql.Date, NgayVe)
      .input("LyDo", sql.NVarChar, LyDo).query(`
                UPDATE tam_vang 
                SET NgayDi=@NgayDi, NgayVe=@NgayVe, LyDo=@LyDo
                WHERE ID = @ID
            `);

    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. XÓA
const deleteTamVang = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM tam_vang WHERE ID = @ID");
    res.status(200).json({ message: "Xóa thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getListTamVang,
  createTamVang,
  updateTamVang,
  deleteTamVang,
};
