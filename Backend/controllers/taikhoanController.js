// controllers/taiKhoanController.js
const { connectDB, sql } = require("../config/db");

// 1. LẤY DANH SÁCH TÀI KHOẢN
const getTaiKhoan = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
            SELECT 
                t.ID as id,
                t.MaHoKhau as maHoKhau,
                t.HoTen as hoTen,
                t.SoCCCD as SoCCCD,
                t.TenDangNhap as tenDangNhap,
                t.MatKhau as matKhau,
                t.Quyen as quyenTaiKhoan
            FROM tai_khoan t
            ORDER BY t.ID DESC
        `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. THÊM TÀI KHOẢN MỚI
const createTaiKhoan = async (req, res) => {
  const { tenDangNhap, matKhau, quyen, maHoKhau, hoTen, SoCCCD } = req.body;

  try {
    const pool = await connectDB();

    // Tạo mới admin hoặc kế toán
    if (quyen !== "Người dùng") {
      await pool
        .request()
        .input("TenDangNhap", sql.VarChar, tenDangNhap)
        .input("MatKhau", sql.VarChar, matKhau)
        .input("Quyen", sql.NVarChar, quyen)
        .input("HoTen", sql.NVarChar, hoTen)
        .input("SoCCCD", sql.VarChar, SoCCCD).query(`
                    INSERT INTO tai_khoan (TenDangNhap, MatKhau, Quyen, HoTen, SoCCCD, MaHoKhau)
                    VALUES (@TenDangNhap, @MatKhau, @Quyen, @HoTen, @SoCCCD, NULL)
                `);
    }

    // Tạo mới cư dân
    else {
      // Tìm thông tin CHỦ HỘ dựa vào MaHoKhau
      const chuHoResult = await pool
        .request()
        .input("MaHoKhau", sql.VarChar, maHoKhau).query(`
                    SELECT HoTen, SoCCCD FROM nhan_khau 
                    WHERE MaHoKhau = @MaHoKhau AND QuanHeVoiChuHo = N'Chủ hộ'
                `);

      if (chuHoResult.recordset.length === 0) {
        return res
          .status(400)
          .json({ message: "Hộ khẩu này chưa có Chủ hộ hoặc không tồn tại!" });
      }

      const chuHo = chuHoResult.recordset[0]; // Lấy dữ liệu chủ hộ tìm được

      // Insert vào bảng tai_khoan với thông tin Chủ hộ vừa tìm được
      await pool
        .request()
        .input("TenDangNhap", sql.VarChar, tenDangNhap)
        .input("MatKhau", sql.VarChar, matKhau)
        .input("Quyen", sql.NVarChar, quyen)
        .input("MaHoKhau", sql.VarChar, maHoKhau)
        .input("HoTen", sql.NVarChar, chuHo.HoTen)
        .input("SoCCCD", sql.VarChar, chuHo.SoCCCD).query(`
                    INSERT INTO tai_khoan (TenDangNhap, MatKhau, Quyen, HoTen, SoCCCD, MaHoKhau)
                    VALUES (@TenDangNhap, @MatKhau, @Quyen, @HoTen, @SoCCCD, @MaHoKhau)
                `);
    }

    res.json({ message: "Tạo tài khoản thành công!" });
  } catch (error) {
    // Xử lý lỗi trùng lặp (nếu trùng User hoặc trùng Mã HK)
    if (error.number === 2627 || error.number === 2601) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc Hộ khẩu này đã tồn tại!" });
    }
    res.status(500).json({ error: error.message });
  }
};

// 3. XÓA TÀI KHOẢN
const deleteTaiKhoan = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM tai_khoan WHERE ID = @ID");

    res.json({ message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. SỬA TÀI KHOẢN (PUT)
const updateTaiKhoan = async (req, res) => {
  const { id } = req.params;
  // Lấy dữ liệu từ Frontend gửi lên
  const { tenDangNhap, matKhau, hoTen, SoCCCD, quyen } = req.body;

  try {
    const pool = await connectDB();

    // Kiểm tra xem Tên đăng nhập mới có bị trùng với người khác không
    const checkUser = await pool
      .request()
      .input("TenDangNhap", sql.VarChar, tenDangNhap)
      .input("ID", sql.Int, id)
      .query(
        "SELECT ID FROM tai_khoan WHERE TenDangNhap = @TenDangNhap AND ID != @ID"
      );

    if (checkUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập này đã có người sử dụng!" });
    }

    const request = pool
      .request()
      .input("ID", sql.Int, id)
      .input("TenDangNhap", sql.VarChar, tenDangNhap)
      .input("MatKhau", sql.VarChar, matKhau);

    let sqlQuery = "";

    // Người dùng ko được sửa
    if (quyen === "Người dùng") {
      // Nếu là Người dùng: CHỈ Update Tên đăng nhập và Mật khẩu
      // Không được động vào HoTen, CCCD
      sqlQuery = `
                UPDATE tai_khoan 
                SET TenDangNhap = @TenDangNhap, 
                    MatKhau = @MatKhau 
                WHERE ID = @ID
            `;
    } else {
      // Nếu là Admin/Kế toán: Update CẢ Họ tên và CCCD
      request.input("HoTen", sql.NVarChar, hoTen);
      request.input("SoCCCD", sql.VarChar, SoCCCD);

      sqlQuery = `
                UPDATE tai_khoan 
                SET TenDangNhap = @TenDangNhap, 
                    MatKhau = @MatKhau,
                    HoTen = @HoTen,
                    SoCCCD = @SoCCCD
                WHERE ID = @ID
            `;
    }

    await request.query(sqlQuery);
    res.json({ message: "Cập nhật tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTaiKhoan,
  createTaiKhoan,
  deleteTaiKhoan,
  updateTaiKhoan,
};
