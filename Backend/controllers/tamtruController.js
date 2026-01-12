const { connectDB, sql } = require("../config/db");

// Lấy danh sách
const getListTamTru = async (req, res) => {
  try {
    const pool = await connectDB();
    const query = `
            SELECT 
                TT.ID, 
                TT.MaNhanKhau,
                TT.TuNgay, 
                TT.DenNgay, 
                TT.LyDo,
                NK.HoTen, 
                NK.SoCCCD,
                CH.MaCanHo
            FROM tam_tru TT
            JOIN nhan_khau NK ON TT.MaNhanKhau = NK.MaNhanKhau
            LEFT JOIN can_ho CH ON NK.MaHoKhau = CH.MaHoKhau  -- Nối sang Căn hộ
            ORDER BY TT.ID DESC
        `;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

// Thêm mới
const createTamTru = async (req, res) => {
  try {
    const { MaNhanKhau, TuNgay, DenNgay, LyDo } = req.body;
    const pool = await connectDB();

    // Kiểm tra nhân khẩu
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
      .input("TuNgay", sql.Date, TuNgay) // Cột mới
      .input("DenNgay", sql.Date, DenNgay) // Cột mới
      .input("LyDo", sql.NVarChar, LyDo).query(`
                INSERT INTO tam_tru (MaNhanKhau, TuNgay, DenNgay, LyDo)
                VALUES (@MaNhanKhau, @TuNgay, @DenNgay, @LyDo)
            `);

    res.status(201).json({ message: "Đăng ký tạm trú thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Cập nhật tạm trú
const updateTamTru = async (req, res) => {
  try {
    const { id } = req.params;
    const { TuNgay, DenNgay, LyDo } = req.body;

    const pool = await connectDB();
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("TuNgay", sql.Date, TuNgay)
      .input("DenNgay", sql.Date, DenNgay)
      .input("LyDo", sql.NVarChar, LyDo).query(`
                UPDATE tam_tru 
                SET TuNgay=@TuNgay, DenNgay=@DenNgay, LyDo=@LyDo
                WHERE ID = @ID
            `);

    res.status(200).json({ message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Xóa tạm trú
const deleteTamTru = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM tam_tru WHERE ID = @ID");

    res.status(200).json({ message: "Xóa thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getListTamTru, createTamTru, updateTamTru, deleteTamTru };
