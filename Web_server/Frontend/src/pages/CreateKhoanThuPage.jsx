import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { taoKhoanThu } from "../services/khoaThuApi";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


const KHONG_NHAP_TIEN = ["Phí gửi xe"];

const CreateKhoanThuPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tenKhoanThu: "",
    ghiChu: "",
    loaiKhoanThu: "Phí đóng góp",
    soTien: "",
    ngayBatDau: dayjs(),
    ngayKetThuc: dayjs(),
  });

  const isDisabledSoTien = KHONG_NHAP_TIEN.includes(formData.loaiKhoanThu);

  
  useEffect(() => {
    if (isDisabledSoTien) {
      
      setFormData((prev) => ({
        ...prev,
        soTien: 0,
      }));
    }
  }, [isDisabledSoTien]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        TenKhoanThu: formData.tenKhoanThu,
        GhiChu: formData.ghiChu,
        Loai: formData.loaiKhoanThu,
        SoTien: isDisabledSoTien ? 0 : Number(formData.soTien),
        NgayBatDau: formData.ngayBatDau.format("YYYY-MM-DD"),
        NgayKetThuc: formData.ngayKetThuc.format("YYYY-MM-DD"),
      };

      await taoKhoanThu(payload);

      alert("Tạo khoản thu thành công!");
      navigate("/quan-ly-khoan-thu");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi không xác định");
    }
  };

  return (
    <Box sx={styles.page}>
      {}
      <Stack direction="row" alignItems="center" spacing={1} sx={styles.header}>
        <IconButton onClick={() => navigate("/quan-ly-khoan-thu")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={styles.title}>
          Tạo khoản thu
        </Typography>
      </Stack>

      <Paper sx={styles.paper}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <TextField
                fullWidth
                label="Tên khoản thu"
                name="tenKhoanThu"
                variant="filled"
                value={formData.tenKhoanThu}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                label="Ghi chú"
                name="ghiChu"
                variant="filled"
                multiline
                rows={3}
                value={formData.ghiChu}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Loại khoản thu</InputLabel>
                <Select
                  name="loaiKhoanThu"
                  value={formData.loaiKhoanThu}
                  onChange={handleChange}
                >
                  <MenuItem value="Phí dịch vụ">Phí dịch vụ</MenuItem>
                  <MenuItem value="Phí quản lý">Phí quản lý</MenuItem>
                  <MenuItem value="Phí đóng góp">Phí đóng góp</MenuItem>
                  <MenuItem value="Phí gửi xe">Phí gửi xe</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                label="Số tiền"
                name="soTien"
                variant="filled"
                value={formData.soTien}
                onChange={handleChange}
                disabled={isDisabledSoTien}
                required={!isDisabledSoTien}
              />
              {isDisabledSoTien && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Phí gửi xe sẽ được tính tự động theo số phương tiện của từng hộ.
                </Typography>
              )}
            </Grid>

            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={formData.ngayBatDau}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      ngayBatDau: newValue,
                    }))
                  }
                  slotProps={{
                    textField: { fullWidth: true, variant: "filled" },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.ngayKetThuc}
                  minDate={formData.ngayBatDau}
                  onChange={(newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      ngayKetThuc: newValue,
                    }))
                  }
                  slotProps={{
                    textField: { fullWidth: true, variant: "filled" },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sx={styles.action}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={styles.saveButton}
              >
                LƯU
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateKhoanThuPage;

const styles = {
  page: {
    p: 4,
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
  },
  header: { mb: 3 },
  title: { fontWeight: "bold" },
  paper: {
    p: 4,
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    maxWidth: "1000px",
  },
  action: {
    display: "flex",
    justifyContent: "flex-end",
    mt: 2,
  },
  saveButton: {
    bgcolor: "#1abc9c",
    px: 4,
    py: 1.2,
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": { bgcolor: "#16a085" },
  },
};
