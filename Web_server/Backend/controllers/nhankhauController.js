const { connectDB, sql } = require("../config/db");

// 1. API CHO TRANG CHỦ: Lấy danh sách Căn hộ + Số thành viên
const getCanHoWithCount = async (req, res) => {
  try {
    const pool = await connectDB();
    // Logic: JOIN Căn hộ với Hộ khẩu, rồi đếm trong bảng Nhân khẩu
    const query = `
            SELECT 
                CH.MaCanHo,
                CH.TenCanHo,
                CH.MaHoKhau,
                (SELECT COUNT(*) FROM nhan_khau NK WHERE NK.MaHoKhau = CH.MaHoKhau) AS SoThanhVien
            FROM can_ho CH
            WHERE CH.MaHoKhau IS NOT NULL
        `;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 2. API CHO TRANG CHI TIẾT: Lấy danh sách nhân khẩu theo Mã Căn Hộ
const getNhanKhauByCanHo = async (req, res) => {
  try {
    const { maCanHo } = req.params;
    const pool = await connectDB();

    // Bước 1: Tìm Mã Hộ Khẩu của căn hộ này
    const chCheck = await pool
      .request()
      .input("MaCanHo", sql.VarChar, maCanHo)
      .query("SELECT MaHoKhau FROM can_ho WHERE MaCanHo = @MaCanHo");

    if (chCheck.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy căn hộ" });

    const maHoKhau = chCheck.recordset[0].MaHoKhau;

    if (!maHoKhau) {
      // Căn hộ trống, chưa có hộ khẩu -> Trả về danh sách rỗng
      return res.status(200).json({ data: [], maHoKhau: null });
    }

    // Bước 2: Lấy danh sách nhân khẩu
    const result = await pool
      .request()
      .input("MaHoKhau", sql.VarChar, maHoKhau)
      .query(`SELECT * FROM nhan_khau WHERE MaHoKhau = @MaHoKhau`);

    // Trả về cả list nhân khẩu VÀ mã hộ khẩu (để dùng cho nút Thêm mới)
    res.status(200).json({ data: result.recordset, maHoKhau: maHoKhau });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy chi tiết", error: err.message });
  }
};

// 3. API UPDATE NHÂN KHẨU (Sửa trực tiếp trên lưới)
const updateNhanKhau = async (req, res) => {
  try {
    const { id } = req.params; // MaNhanKhau
    const data = req.body;
    const pool = await connectDB();

    await pool
      .request()
      .input("MaNK", sql.VarChar, id)
      .input("HoTen", sql.NVarChar, data.HoTen)
      .input("GioiTinh", sql.NVarChar, data.GioiTinh)
      .input("DanToc", sql.NVarChar, data.DanToc)
      .input("NgheNghiep", sql.NVarChar, data.NgheNghiep)
      .input("SoCCCD", sql.VarChar, data.SoCCCD)
      .input("NoiSinh", sql.NVarChar, data.NoiSinh)
      .input("QuanHe", sql.NVarChar, data.QuanHeVoiChuHo)
      .input("NgaySinh", sql.Date, data.NgaySinh).query(`
                UPDATE nhan_khau
                SET HoTen=@HoTen, GioiTinh=@GioiTinh, DanToc=@DanToc, 
                    NgheNghiep=@NgheNghiep, SoCCCD=@SoCCCD, NoiSinh=@NoiSinh, 
                    QuanHeVoiChuHo=@QuanHe, NgaySinh=@NgaySinh
                WHERE MaNhanKhau = @MaNK
            `);
    res.status(200).json({ message: "Update thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. API XÓA NHÂN KHẨU
const deleteNhanKhau = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    await pool
      .request()
      .input("MaNK", sql.VarChar, id)
      .query("DELETE FROM nhan_khau WHERE MaNhanKhau = @MaNK");
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. API THÊM NHÂN KHẨU MỚI
const createNhanKhau = async (req, res) => {
  try {
    const {
      MaNhanKhau,
      MaHoKhau,
      HoTen,
      GioiTinh,
      NgaySinh,
      DanToc,
      TonGiao,
      QuocTich,
      NgheNghiep,
      SoCCCD,
      NoiSinh,
      QuanHeVoiChuHo,
    } = req.body;

    const pool = await connectDB();

    await pool
      .request()
      .input("MaNhanKhau", sql.VarChar, MaNhanKhau)
      .input("MaHoKhau", sql.VarChar, MaHoKhau)
      .input("HoTen", sql.NVarChar, HoTen)
      .input("GioiTinh", sql.NVarChar, GioiTinh)
      .input("NgaySinh", sql.Date, NgaySinh) // Nullable
      .input("DanToc", sql.NVarChar, DanToc)
      .input("TonGiao", sql.NVarChar, TonGiao)
      .input("QuocTich", sql.NVarChar, QuocTich || "Việt Nam")
      .input("NgheNghiep", sql.NVarChar, NgheNghiep)
      .input("SoCCCD", sql.VarChar, SoCCCD)
      .input("NoiSinh", sql.NVarChar, NoiSinh)
      .input("QuanHeVoiChuHo", sql.NVarChar, QuanHeVoiChuHo).query(`
                INSERT INTO nhan_khau (
                    MaNhanKhau, MaHoKhau, HoTen, GioiTinh, NgaySinh, 
                    DanToc, TonGiao, QuocTich, NgheNghiep, SoCCCD, 
                    NoiSinh, QuanHeVoiChuHo
                )
                VALUES (
                    @MaNhanKhau, @MaHoKhau, @HoTen, @GioiTinh, @NgaySinh, 
                    @DanToc, @TonGiao, @QuocTich, @NgheNghiep, @SoCCCD, 
                    @NoiSinh, @QuanHeVoiChuHo
                )
            `);

    res.status(201).json({ message: "Thêm nhân khẩu thành công!" });
  } catch (err) {
    // Lỗi trùng khóa chính (Mã nhân khẩu hoặc CCCD)
    if (err.number === 2627) {
      return res
        .status(409)
        .json({ message: "Mã nhân khẩu hoặc số CCCD đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi thêm mới", error: err.message });
  }
};

const getNhanKhauByMa = async (req, res) => {
  try {
    const { id } = req.params;
    const maCanTim = id.trim();

    const pool = await connectDB();

    const query = `
            SELECT 
                NK.MaHoKhau,
                NK.HoTen, 
                NK.SoCCCD, 
                CH.MaCanHo
            FROM nhan_khau NK
            LEFT JOIN can_ho CH ON NK.MaHoKhau = CH.MaHoKhau 
            WHERE NK.MaNhanKhau = @MaNK
        `;

    const result = await pool
      .request()
      .input("MaNK", sql.VarChar, maCanTim)
      .query(query);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy nhân khẩu trong hệ thống" });
    }

    // 2. XỬ LÝ DỮ LIỆU: Gom nhóm căn hộ lại
    const firstRow = result.recordset[0];

    // Tạo mảng danh sách căn hộ (lọc bỏ giá trị null nếu người đó chưa có căn hộ)
    const listCanHo = result.recordset
      .map((item) => item.MaCanHo)
      .filter((ma) => ma !== null);

    // 3. Trả về cấu trúc JSON khớp với Frontend
    const responseData = {
      HoTen: firstRow.HoTen,
      SoCCCD: firstRow.SoCCCD,
      MaHoKhau: firstRow.MaHoKhau,
      DanhSachCanHo: listCanHo,
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Lỗi tìm nhân khẩu:", err);
    res.status(500).json({ error: err.message });
  }
};

const getAllNhanKhau = async (req, res) => {
  try {
    const pool = await connectDB();

    // Truy vấn: Lấy tất cả thông tin nhân khẩu KÈM THEO Mã Căn Hộ từ bảng Hộ Khẩu
    const result = await pool.request().query(`
      SELECT 
        NK.MaHoKhau,
        NK.MaNhanKhau,
        NK.HoTen,
        NK.GioiTinh,
        NK.SoCCCD,
        NK.NgaySinh,
        NK.NoiSinh,
        NK.DanToc,
        NK.NgheNghiep,
        CH.MaCanHo 
      FROM nhan_khau NK
      LEFT JOIN can_ho CH ON NK.MaHoKhau = CH.MaHoKhau
    `);

    // Trả về dữ liệu
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách nhân khẩu:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = {
  getCanHoWithCount,
  getNhanKhauByCanHo,
  updateNhanKhau,
  deleteNhanKhau,
  createNhanKhau,
  getNhanKhauByMa,
  getAllNhanKhau,
};
