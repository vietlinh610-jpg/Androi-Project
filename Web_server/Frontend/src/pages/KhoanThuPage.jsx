

import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import { layKhoanThu } from "../services/khoaThuApi";
import { getTrangThaiThuPhi } from "../services/thuphiApi";

const KhoanThuPage = () => {
  const navigate = useNavigate();

  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [householdRows, setHouseholdRows] = useState([]);
  const [loadingHousehold, setLoadingHousehold] = useState(false);
  
  const [openModal, setOpenModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  
  useEffect(() => {
    const fetchKhoanThu = async () => {
      try {
        setLoading(true);
        const res = await layKhoanThu();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mappedRows = res.data.data.map((item) => {
          const endDate = new Date(item.NgayKetThuc);
          endDate.setHours(0, 0, 0, 0);

          return {
            id: item.MaKhoanThu,
            tenKhoanThu: item.TenKhoanThu,
            loaiKhoanThu: item.Loai,
            soTien: item.SoTien?.toLocaleString("vi-VN"),
            ngayBatDau: item.NgayBatDau?.slice(0, 10),
            ngayKetThuc: item.NgayKetThuc?.slice(0, 10),
            trangThai: today <= endDate ? "Đang thu" : "Hoàn thành",
          };
        });

        setRows(mappedRows);
      } catch (err) {
        console.error("Lỗi lấy khoản thu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKhoanThu();
  }, []);

  
  const handleOpenHouseholdList = async (fee) => {
    try {
      setSelectedFee(fee);
      setOpenModal(true);
      setLoadingHousehold(true);

      const res = await getTrangThaiThuPhi(fee.id);

      const mappedRows = res.data.data.map((item, index) => ({
        id: index + 1,
        canHo: item.MaCanHo,
        chuHo: item.ChuHo,
        soTien: item.SoTien?.toLocaleString("vi-VN"),
        ngayNop: item.NgayNop ? item.NgayNop.slice(0, 10) : "",
        trangThai: item.TrangThai === "Đã nộp" ? "Hoàn thành" : "Đang thu",
      }));

      setHouseholdRows(mappedRows);
    } catch (err) {
      console.error("Lỗi lấy danh sách hộ:", err);
    } finally {
      setLoadingHousehold(false);
    }
  };

  
  const columns = [
    { field: "tenKhoanThu", headerName: "Tên khoản thu", flex: 1.5 },
    { field: "loaiKhoanThu", headerName: "Loại khoản thu", flex: 1 },
    { field: "soTien", headerName: "Số tiền", width: 140 },
    { field: "ngayBatDau", headerName: "Ngày bắt đầu", width: 130 },
    { field: "ngayKetThuc", headerName: "Ngày kết thúc", width: 130 },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Hoàn thành" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 220,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<ListAltIcon />}
          sx={styles.householdBtn}
          onClick={() => handleOpenHouseholdList(params.row)}
        >
          DANH SÁCH HỘ
        </Button>
      ),
    },
  ];

  
  const householdColumns = [
    { field: "canHo", headerName: "Căn hộ", width: 100 },
    { field: "chuHo", headerName: "Chủ hộ", flex: 1 },
    { field: "soTien", headerName: "Số tiền", width: 130 },
    { field: "ngayNop", headerName: "Ngày nộp", width: 130 },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Hoàn thành" ? "success" : "error"}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box sx={styles.page}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Quản lý các khoản thu phí
        </Typography>
      </Stack>


      <Stack direction="row" spacing={2} sx={styles.toolbar}>
        <Button
          variant="contained"
          sx={styles.createBtn}
          onClick={() => navigate("/quan-ly-khoan-thu/create")}
        >
          TẠO KHOẢN THU MỚI
        </Button>

        {}
        <Button
          variant="contained"
          startIcon={<BarChartIcon />}
          onClick={() => navigate("/quan-ly-khoan-thu/thong-ke")}
          sx={{
            bgcolor: "#3fa8c3",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#2f8fa6" },
          }}
        >
          THỐNG KÊ DOANH THU
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[10, 20]}
        sx={styles.dataGrid}
      />

      {}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={styles.modalTitle}>
          Tình trạng nộp: {selectedFee?.tenKhoanThu}
          <IconButton onClick={() => setOpenModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <DataGrid
            rows={householdRows}
            columns={householdColumns}
            loading={loadingHousehold}
            pageSizeOptions={[5]}
            sx={{ height: 400 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KhoanThuPage;

const styles = {
  page: { p: 3, height: "100vh" },
  title: { fontWeight: "bold", mb: 2 },
  toolbar: { mb: 3 },
  createBtn: {
    bgcolor: "#008ecc",
    fontWeight: "bold",
    "&:hover": { bgcolor: "#007bb5" },
  },
  dataGrid: { height: "calc(100vh - 200px)" },
  householdBtn: {
    bgcolor: "#008ecc",
    fontSize: "12px",
    "&:hover": { bgcolor: "#007bb5" },
  },
  modalTitle: {
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
