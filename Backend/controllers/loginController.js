const { connectDB, sql } = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mat_khau_bi_mat_123"; // Demo

const login = async (req, res) => {
  // Frontend gửi lên: tenDangNhap, matKhau
  const { tenDangNhap, matKhau } = req.body;

  try {
    const pool = await connectDB();

    // 1. Tìm user
    const result = await pool
      .request()
      .input("TenDangNhap", sql.VarChar, tenDangNhap)
      .query("SELECT * FROM tai_khoan WHERE TenDangNhap = @TenDangNhap");

    const user = result.recordset[0];

    // 2. Kiểm tra tồn tại
    if (!user) {
      return res.status(401).json({ message: "Tên đăng nhập không tồn tại!" });
    }

    // Tìm mã nhân khẩu ứng với mã hộ khẩu
    const query = `
        select nk.MaNhanKhau
        from nhan_khau nk
          join ho_khau hk 
          on nk.MaHoKhau = hk.MaHoKhau and nk.QuanHeVoiChuHo = N'Chủ hộ'
        where hk.MaHoKhau = @MaHoKhau;
        `;
    const nkRes = await pool
      .request()
      .input("MaHoKhau", sql.VarChar, user.MaHoKhau)
      .query(query);

    // Lấy ra mã nhân khẩu của chủ hộ
    const nhanKhau = nkRes.recordset[0] || { MaNhanKhau: "Not an user" };

    // 3. Kiểm tra mật khẩu (So sánh chuỗi thường, ko hash)
    // Demo
    if (user.MatKhau !== matKhau) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // 4. Tạo Token
    const token = jwt.sign(
      { id: user.ID, quyen: user.Quyen, hoTen: user.HoTen },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 5. Trả về Client
    res.json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        hoTen: user.HoTen,
        quyen: user.Quyen,
        maHoKhau: user.MaHoKhau,
        id: nhanKhau.MaNhanKhau, // Thêm userID để tích hợp với frontend
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
