const { connectDB, sql } = require("../config/db");

// * Bang nhan_khau thieu truong : sdt

// Route : /.../api/ttcn/layttcn/:id
// 1. Lấy thông tin cá nhân để hiển thị ra bảng
const layTTCN = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await connectDB();

    const result = await pool.request().input("id", sql.VarChar, id).query(`
        SELECT 
          HoTen,
          GioiTinh,
          NgaySinh,
          DanToc,
          TonGiao,
          NgheNghiep,
          SoCCCD,
          NoiSinh
        FROM nhan_khau
        WHERE MaNhanKhau = @id
      `);

    // Đề phòng không tìm thấy nhân khẩu
    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin cá nhân",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin cá nhân thành công",
      data: result.recordset[0],
    });
  } catch (err) {
    console.error("Lỗi lấy ttcn:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy ttcn",
    });
  }
};

// Route : /.../api/ttcn/chinhsua/:id
// 2. Chỉnh sửa thông tin cá nhân với id
const chinhSuaTTCN = async (req, res) => {
  try {
    // id của người cần chuyển thông tin
    const { id } = req.params;
    // Lấy các tham số từ request
    const { CCCD, SDT, TonGiao, NgheNghiep } = req.body;

    const pool = await connectDB();

    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("CCCD", sql.VarChar, CCCD)
      .input("SDT", sql.VarChar, SDT)
      .input("TonGiao", sql.NVarChar, TonGiao)
      .input("NgheNghiep", sql.NVarChar, NgheNghiep).query(`
        UPDATE nhan_khau
        SET
          SoCCCD = @CCCD,
          TonGiao = @TonGiao,
          NgheNghiep = @NgheNghiep
        WHERE MaNhanKhau = @id
      `);

    return res.status(200).json({
      message: "Chỉnh sửa thông tin cá nhân thành công",
    });
  } catch (err) {
    // * Note for myself: Nên ghi log err để biết đường debug
    console.log(`Loi chinh sua thong tin ca nhan : ${err}`);
    return res.status(500).json({
      message: "Lỗi khi chỉnh sửa thông tin cá nhân",
    });
  }
};

// Route : /api/ttcn/ttchung/:id
// 3. Lấy thông tin chung về hộ khẩu theo nhân khẩu

const layTTChung = async (req, res) => {
  try {
    // id của người cần lấy thông tin chung
    const { id } = req.params;

    const pool = await connectDB();

    const result = await pool.request().input("id", sql.VarChar, id).query(`
        SELECT 
          nk.MaHoKhau        AS maHoKhau,
          ch.MaCanHo         AS canHo,
          ch.Tang            AS tang,
          chuHo.HoTen        AS chuHo,
          hk.DiaChiThuongTru AS diaChiThuongTru
        FROM nhan_khau nk
          JOIN ho_khau hk 
            ON nk.MaHoKhau = hk.MaHoKhau
          JOIN can_ho ch 
            ON ch.MaHoKhau = hk.MaHoKhau
          JOIN nhan_khau chuHo 
            ON nk.MaHoKhau = chuHo.MaHoKhau
           AND chuHo.QuanHeVoiChuHo = N'Chủ hộ'
        WHERE nk.MaNhanKhau = @id
      `);

    // Không tìm thấy thông tin
    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin chung của hộ khẩu",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin chung thành công",
      data: result.recordset[0],
    });
  } catch (err) {
    console.error("Lỗi khi lấy ttc:", err);
    return res.status(500).json({
      message: "Lỗi khi lấy ttc",
    });
  }
};

// Route : /api/ttcn/ttgd/:id
// 4. Lấy thông tin về các thành viên trong gia đình

const layTTGD = async (req, res) => {
  try {
    // id của người cần lấy thông tin
    const { id } = req.params;

    const pool = await connectDB();

    const query = `
      SELECT 
        gd.MaNhanKhau,
        gd.HoTen,
        gd.QuanHeVoiChuHo,
        gd.NgaySinh,
        gd.GioiTinh,
        gd.DanToc,
        gd.TonGiao,
        gd.NgheNghiep
      FROM nhan_khau nk
        JOIN ho_khau hk ON nk.MaHoKhau = hk.MaHoKhau
        JOIN nhan_khau gd ON gd.MaHoKhau = hk.MaHoKhau
      WHERE nk.MaNhanKhau = @id
      ORDER BY 
        CASE 
          WHEN gd.QuanHeVoiChuHo = N'Chủ hộ' THEN 0 
          ELSE 1 
        END,
        gd.NgaySinh;
    `;

    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .query(query);

    return res.status(200).json({
      message: "Lấy thông tin gia đình thành công",
      data: result.recordset,
    });
  } catch (err) {
    console.error("Lỗi khi lấy tt gd:", err);
    return res.status(500).json({
      message: "Lỗi khi lấy thông tin gia đình",
    });
  }
};

module.exports = {
  chinhSuaTTCN,
  layTTCN,
  layTTChung,
  layTTGD,
};
