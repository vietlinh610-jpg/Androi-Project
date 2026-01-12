const { query } = require("mssql");
const { connectDB, sql } = require("../config/db");

// 1. Xem trạng thái thu phí của hộ theo khoản thu
// Lấy danh sách các hộ kèm theo các khoản thu với trạng thái đã đóng, chưa đóng
const xemTrangThaiThuPhi = async (req, res) => {
  try {
    // Lấy mã khoản thu từ request
    const { maKhoanThu } = req.params;

    const pool = await connectDB();

    // * Thêm phí gửi xe -> Chỉ hiển thị những hộ gửi phương tiện
    // Kiểm tra xem với maKhoanThu, khoản thu là phí cố định hay gửi xe
    let ans = await pool.request().input("MaKhoanThu", sql.Int, maKhoanThu)
      .query(`
        select SoTien
        from khoan_thu
        where MaKhoanThu = @MaKhoanThu
      `);

    const soTienKhoanThu = ans.recordset[0]?.SoTien;
    // Nếu số tiền là 0 -> Mark là phí gửi xe
    const laPhiGX = Number(soTienKhoanThu) === 0;

    let query;
    // Nếu là phí gửi xe thì chỉ hiện những hộ gửi
    if (laPhiGX) {
      query = `
        select 
          ViewGx.MaCanHo as MaCanHo,
          ViewGx.ChuHo as ChuHo,
          ViewGx.PhiGuiXe as SoTien,
          tp.NgayDong as NgayNop,
          CASE
            WHEN tp.MaThuPhi IS NOT NULL THEN N'Đã nộp'
            ELSE N'Chưa nộp'
          END AS TrangThai
        from vw_phi_gui_xe_theo_ho ViewGx
          left join thu_phi tp on ViewGx.MaHoKhau = tp.MaHoKhau and tp.MaKhoanThu = @MaKhoanThu
        where ViewGx.PhiGuiXe > 0;
      `;
    } else {
      query = `
      SELECT
          ch.MaCanHo as MaCanHo,
          nk.HoTen AS ChuHo,
          kt.SoTien AS SoTien,
          tp.NgayDong AS NgayNop,
          CASE
              WHEN tp.MaThuPhi IS NOT NULL THEN N'Đã nộp'
              ELSE N'Chưa nộp'
          END AS TrangThai
      FROM can_ho ch
      JOIN ho_khau hk
          ON ch.MaHoKhau = hk.MaHoKhau
      JOIN nhan_khau nk
          ON nk.MaHoKhau = hk.MaHoKhau AND nk.QuanHeVoiChuHo = N'Chủ hộ'
      JOIN khoan_thu kt
          ON kt.MaKhoanThu = @MaKhoanThu
      LEFT JOIN thu_phi tp
          ON tp.MaHoKhau = hk.MaHoKhau AND tp.MaKhoanThu = kt.MaKhoanThu;
    `;
    }

    // Truy vấn
    const result = await pool
      .request()
      .input("MaKhoanThu", sql.Int, maKhoanThu)
      .query(query);

    return res.status(200).json({
      data: result.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi xem trạng thái thu phí",
    });
  }
};

// 2. Lấy trạng thái của các khoản thu trong bảng thu_phi
// Phục vụ cho trang "Kiểm tra khoản thu"
const kiemTraKhoanThu = async (req, res) => {
  try {
    const pool = await connectDB();

    query = `
      select tp.SoTienPhaiThu as soTien, kt.TenKhoanThu as tenKhoanThu,
        nk.HoTen as chuHo, tp.NgayDong as ngayDaDong, tp.DaDong as daDong
      from thu_phi tp
        join ho_khau hk on tp.MaHoKhau = hk.MaHoKhau
        join nhan_khau nk on hk.MaHoKhau = nk.MaHoKhau
        join khoan_thu kt on tp.MaKhoanThu = kt.makhoanthu
      where nk.QuanHeVoiChuHo = N'Chu ho'
    `;

    const result = await pool.request().query(query);

    return res.status(200).json({
      data: result.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error!",
    });
  }
};

// 3. Lấy doanh thu theo tháng, năm
// Phục vụ trang thống kê doanh thu
const thongKeDT = async (req, res) => {
  try {
    const pool = await connectDB();

    const { thang, nam } = req.params;

    const query = `
      WITH cte(TongDoanhThu) as (
        SELECT 
          SUM(kt.SoTien) AS TongDoanhThu
        FROM thu_phi tp
          JOIN khoan_thu kt 
            ON tp.MaKhoanThu = kt.MaKhoanThu
        WHERE tp.DaXacNhan = 1
          AND kt.SoTien > 0
          AND MONTH(tp.NgayDong) = @thang
          AND YEAR(tp.NgayDong) = @nam

        UNION ALL

        SELECT 
          SUM(vx.PhiGuiXe) AS TongDoanhThu
        FROM thu_phi tp
          JOIN vw_phi_gui_xe_theo_ho vx 
            ON tp.MaHoKhau = vx.MaHoKhau
        WHERE tp.DaXacNhan = 1
          AND vx.PhiGuiXe > 0
          AND MONTH(tp.NgayDong) = @thang
          AND YEAR(tp.NgayDong) = @nam
      )
      select SUM(TongDoanhThu) as DoanhThu from cte
    `;

    const result = await pool
      .request()
      .input("thang", sql.Int, thang)
      .input("nam", sql.Int, nam)
      .query(query);

    const tongDoanhThu = Number(result.recordset[0]?.DoanhThu ?? 0);

    // trả về doanh thu trong tháng + năm
    return res.status(200).json({
      thang: thang,
      nam: nam,
      tongDoanhThu: tongDoanhThu,
    });
  } catch (err) {
    console.error("Lỗi thống kê doanh thu:", err);
    return res.status(500).json({
      message: "Lỗi khi thống kê doanh thu",
    });
  }
};

module.exports = {
  xemTrangThaiThuPhi,
  kiemTraKhoanThu,
  thongKeDT,
};
