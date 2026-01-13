const { connectDB, sql } = require("../config/db");

// 1. Lấy các khoản thu từ bảng thu phí
// Ghi chú : Các khoản chưa nộp thì xem trong quản lý khoản thu tùy theo khoản thu
// Chỉ hiển thị các khoản thu đang chờ xác nhận nhằm mục đích xác nhận hợp lệ
const kiemTraThuPhi = async (req, res) =>  {
  try {
    const pool = await connectDB();

    // Mã thu phí cần thiết cho xác nhận khoản thu
    // * Chưa tính phí gửi xe
    query = `
    select tp.maThuPhi as maThuPhi, kt.TenKhoanThu as TenKhoanThu, kt.SoTien as soTien,
      ch.MaCanHo as MaCanHo, nk.HoTen as ChuHo, tp.NgayDong as NgayGioNop
    from thu_phi tp
      join khoan_thu kt on tp.MaKhoanThu = kt.makhoanthu and kt.SoTien > 0
      join ho_khau hk on tp.MaHoKhau = hk.MaHoKhau
      join nhan_khau nk on hk.MaHoKhau = nk.MaHoKhau and nk.QuanHeVoiChuHo = N'Chủ hộ'
      join can_ho ch on ch.MaHoKhau = hk.MaHoKhau
    where tp.DaXacNhan = 0 and tp.tuChoi = 0

    UNION ALL -- Tính thêm phí gửi xe

    select 
      tp.maThuPhi as maThuPhi,
      kt.TenKhoanThu as TenKhoanThu,
      vx.PhiGuiXe as soTien,
      vx.MaCanHo as MaCanHo,
      vx.ChuHo as ChuHo,
      tp.NgayDong as NgayGioNop
    from thu_phi tp
      join vw_phi_gui_xe_theo_ho vx 
        on tp.MaHoKhau = vx.MaHoKhau
      join khoan_thu kt on kt.MaKhoanThu = tp.MaKhoanThu and kt.SoTien = 0
    where tp.DaXacNhan = 0
      and tp.tuChoi = 0
      and vx.PhiGuiXe > 0

    order by tp.maThuPhi desc
    `
    const result = await pool.request().query(query);
    // Truy vấn những khoản thu đang chờ xác nhận và trả về kết quả
    return res.status(200).json({
      data:result.recordset,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi xem trạng thái đóng phí",
    });
  }
}

// 2. Xác nhận một khoản thu phí
// Lấy mã khoản thu và đặt trạng thái xác nhận về true
const xacNhanThuPhi =  async (req, res) => {
  try {
    // id của mã khoản thu để xác nhận
    const { id } = req.params;

    const pool = await connectDB();

    const query = `
      UPDATE thu_phi
      SET
        DaXacNhan = 1
      WHERE
        MaThuPhi = @MaThuPhi
    `;

    await pool.request()
      .input("MaThuPhi", sql.Int, id)
      .query(query)

    return res.status(201).json({
      message: "Xác nhận khoản thu thành công",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi xác nhận một khoản thu phí",
    })
  }
}

// 3. Từ chối 1 khoản phí
// Lấy mã khoản thu và đặt trường từ chối về 1
const tuChoiKhoanThu = async(req, res) => {
  try {
    // id của mã khoản thu để từ chối
    const { id } = req.params;

    const pool = await connectDB();

    const query = `
      UPDATE thu_phi
      SET
        tuChoi = 1
      WHERE
        MaThuPhi = @MaThuPhi
    `;

    await pool.request()
      .input("MaThuPhi", sql.Int, id)
      .query(query);

    return res.status(201).json({
      message: "Từ chối khoản thu thành công",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi từ chối một khoản thu phí",
    })
  }
}

module.exports = {
  kiemTraThuPhi,
  xacNhanThuPhi,
  tuChoiKhoanThu,
};
