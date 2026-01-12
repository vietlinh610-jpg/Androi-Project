import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// GỘP TẤT CẢ IMPORT MUI VÀO ĐÂY
import { 
  Box, Typography, Button, Stack, Chip, IconButton 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { layDSGX, ngungGuiXe } from "../services/guiXeApi";

const GuiXePage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  
  
  
  useEffect(() => {
    fetchDSGX();
  }, []);

  const fetchDSGX = async () => {
    try {
      setLoading(true);
      const res = await layDSGX();

      const mappedRows = res.data.data.map((item, index) => ({
        id: index + 1, 
        hoKhau: item.MaHoKhau,
        chuHo: item.hoTenChuHo,
        loaiXe: item.LoaiXe,
        bienSo: item.BienKiemSoat,
      }));

      setRows(mappedRows);
    } catch (err) {
      console.error("Lỗi lấy danh sách gửi xe:", err);
    } finally {
      setLoading(false);
    }
  };

  
  
  
  const handleNgungGui = async (row) => {
    const isConfirm = window.confirm(
      `Bạn có chắc muốn ngừng gửi xe biển số ${row.bienSo} không?`
    );
    if (!isConfirm) return;

    try {
      setLoading(true);
      await ngungGuiXe(row.bienSo);
      alert("Ngừng gửi xe thành công");
      fetchDSGX();
    } catch (err) {
      console.error("Lỗi ngừng gửi xe:", err);
      alert("Ngừng gửi xe thất bại");
    } finally {
      setLoading(false);
    }
  };

  
  
  
  const columns = [
    {
      field: "hoKhau",
      headerName: "Hộ khẩu",
      width: 120,
    },
    {
      field: "chuHo",
      headerName: "Chủ hộ",
      flex: 1.2,
    },
    {
      field: "loaiXe",
      headerName: "Loại xe",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Ô tô" ? "primary" : "success"}
          size="small"
        />
      ),
    },
    {
      field: "bienSo",
      headerName: "Biển kiểm soát",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Ngừng gửi",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleNgungGui(params.row)}
        >
          Ngừng gửi
        </Button>
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
          Quản lý gửi xe
        </Typography>
      </Stack>


      <Stack direction="row" sx={styles.toolbar}>
        <Button
          variant="contained"
          sx={styles.createBtn}
          onClick={() => navigate("/quan-ly-gui-xe/create")}
        >
          THÊM PHƯƠNG TIỆN
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[5, 10]}
        sx={styles.dataGrid}
      />
    </Box>
  );
};

export default GuiXePage;




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
};
