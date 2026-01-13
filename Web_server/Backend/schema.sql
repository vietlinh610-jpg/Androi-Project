CREATE TABLE ho_khau (
    MaHoKhau VARCHAR(20) PRIMARY KEY,
    DiaChiThuongTru NVARCHAR(200),
    NoiCap NVARCHAR(100),
    NgayCap DATE
);
GO

CREATE TABLE can_ho (
    MaCanHo VARCHAR(20) PRIMARY KEY,
    TenCanHo NVARCHAR(50),
    Tang INT,
    DienTich FLOAT,
    
    MaHoKhau VARCHAR(20), 
    
    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE 
);
GO

CREATE TABLE nhan_khau (
    MaNhanKhau VARCHAR(20) PRIMARY KEY, -- Tự nhập: "NK001"
    
    MaHoKhau VARCHAR(20),
    
    HoTen NVARCHAR(100) NOT NULL,
    GioiTinh NVARCHAR(10), 
    NgaySinh DATE,
    DanToc NVARCHAR(50),
    TonGiao NVARCHAR(50),
    QuocTich NVARCHAR(50) DEFAULT N'Việt Nam',
    NgheNghiep NVARCHAR(100),
    SoCCCD VARCHAR(20),
    NoiSinh NVARCHAR(200),
    QuanHeVoiChuHo NVARCHAR(50), 
    
    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);
GO

CREATE UNIQUE NONCLUSTERED INDEX IX_NhanKhau_CCCD ON nhan_khau(SoCCCD) WHERE SoCCCD IS NOT NULL;
GO

CREATE TABLE tam_vang (
    ID INT PRIMARY KEY IDENTITY(1,1), -- ID tự động (1, 2, 3...)
    
    MaNhanKhau VARCHAR(20) NOT NULL, -- Vẫn nối với mã tự nhập của bảng Nhân Khẩu
    
    NgayDi DATE,
    NgayVe DATE,
    LyDo NVARCHAR(255),
    
    -- Nếu mã nhân khẩu sửa NK01 -> NK99, bảng này tự cập nhật
    FOREIGN KEY (MaNhanKhau) REFERENCES nhan_khau(MaNhanKhau) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);
GO

CREATE TABLE tam_tru (
    ID INT PRIMARY KEY IDENTITY(1,1), -- ID tự động (1, 2, 3...)
    
    MaNhanKhau VARCHAR(20) NOT NULL, 
    
    TuNgay DATE,
    DenNgay DATE,
    LyDo NVARCHAR(255),
    
    FOREIGN KEY (MaNhanKhau) REFERENCES nhan_khau(MaNhanKhau) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);

CREATE TABLE tai_khoan (
    ID INT PRIMARY KEY IDENTITY(1,1),
    HoTen NVARCHAR(100) NOT NULL,
    SoCCCD VARCHAR(20) NOT NULL,
    MaHoKhau VARCHAR(20), 
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    Quyen NVARCHAR(50) NOT NULL DEFAULT N'Người dùng',
    CONSTRAINT CK_TaiKhoan_Quyen CHECK (Quyen IN (N'Admin', N'Kế toán', N'Người dùng')),
    CONSTRAINT CK_Logic_MaHoKhau CHECK (
        (Quyen = N'Người dùng' AND MaHoKhau IS NOT NULL) 
        OR 
        (Quyen <> N'Người dùng' AND MaHoKhau IS NULL)
    ),
    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE UNIQUE NONCLUSTERED INDEX UQ_TaiKhoan_MaHoKhau_KhongNull
ON tai_khoan(MaHoKhau)
WHERE MaHoKhau IS NOT NULL;
GO

-- Xóa trigger cũ nếu có
IF OBJECT_ID('trg_ChongXoaAdmin', 'TR') IS NOT NULL DROP TRIGGER trg_ChongXoaAdmin;
GO

CREATE TRIGGER trg_ChongXoaAdmin
ON tai_khoan
FOR DELETE
AS
BEGIN
    -- Đếm số lượng Admin còn lại trong bảng sau khi lệnh xóa chạy
    DECLARE @CountAdmin INT;
    SELECT @CountAdmin = COUNT(*) FROM tai_khoan WHERE Quyen = N'Admin';

    -- Nếu không còn Admin nào -> Báo lỗi và Hoàn tác
    IF @CountAdmin < 1
    BEGIN
        PRINT N'LỖI: Không thể xóa! Hệ thống bắt buộc phải còn ít nhất 1 Admin.';
        ROLLBACK TRANSACTION; -- Hủy lệnh xóa
    END
END;
GO
-- Xóa trigger cũ nếu có
IF OBJECT_ID('trg_ChongSuaQuyenAdmin', 'TR') IS NOT NULL DROP TRIGGER trg_ChongSuaQuyenAdmin;
GO

CREATE TRIGGER trg_ChongSuaQuyenAdmin
ON tai_khoan
FOR UPDATE
AS
BEGIN
    -- Chỉ kiểm tra nếu cột "Quyen" bị thay đổi
    IF UPDATE(Quyen)
    BEGIN
        -- Đếm số Admin còn lại sau khi sửa
        DECLARE @CountAdmin INT;
        SELECT @CountAdmin = COUNT(*) FROM tai_khoan WHERE Quyen = N'Admin';

        -- Nếu số Admin về 0 -> Báo lỗi và Hoàn tác
        IF @CountAdmin < 1
        BEGIN
            PRINT N'LỖI: Không thể hạ quyền! Đây là Admin duy nhất còn lại.';
            ROLLBACK TRANSACTION; -- Hủy lệnh update
        END
    END
END;
GO

create table khoan_thu (
	makhoanthu int identity(1,1) primary key,
	TenKhoanThu NVARCHAR(200) NOT NULL,
	GhiChu NVARCHAR(255),
	Loai NVARCHAR(20) NOT NULL, -- bat buoc hoac tu nguyen
	SoTien DECIMAL(18,2) NOT NULL,
	NgayBatDau DATE NOT NULL,
	NgayKetThuc DATE NOT NULL
);
GO

CREATE TABLE thu_phi (
    MaThuPhi INT IDENTITY(1,1) PRIMARY KEY,
    MaHoKhau VARCHAR(20) NOT NULL,
    MaKhoanThu INT NOT NULL,
    SoTienPhaiThu DECIMAL(18,2) NOT NULL,
    DaXacNhan BIT DEFAULT 0,
    NgayDong DATE NULL,
    GhiChu NVARCHAR(255),
	TuChoi BIT DEFAULT 0,
    CONSTRAINT FK_ThuPhi_HoKhau
        FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT FK_ThuPhi_KhoanThu
        FOREIGN KEY (MaKhoanThu) REFERENCES khoan_thu(MaKhoanThu)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT UQ_ThuPhi UNIQUE (MaHoKhau, MaKhoanThu)
);
GO

create table dang_ky_gui_xe (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    MaHoKhau VARCHAR(20) NOT NULL,
    LoaiXe NVARCHAR(20) NOT NULL,
    bienkiemsoat varchar(20) not null,
    CONSTRAINT GUIXE_HoKhau
        FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE VIEW vw_phi_gui_xe_theo_ho
AS
SELECT
    hk.MaHoKhau,
    ch.MaCanHo,
    nk.HoTen AS ChuHo,
    SUM(
        CASE 
            WHEN gx.LoaiXe = N'Xe máy' THEN 70000
            WHEN gx.LoaiXe = N'Ô tô'   THEN 1200000
            ELSE 0
        END
    ) AS PhiGuiXe
FROM ho_khau hk
JOIN can_ho ch
    ON ch.MaHoKhau = hk.MaHoKhau
JOIN nhan_khau nk
    ON nk.MaHoKhau = hk.MaHoKhau
   AND nk.QuanHeVoiChuHo = N'Chủ hộ'
LEFT JOIN dang_ky_gui_xe gx
    ON gx.MaHoKhau = hk.MaHoKhau
GROUP BY
    hk.MaHoKhau,
    ch.MaCanHo,
    nk.HoTen;
GO