import React, { useState } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";

import { themGuiXe } from "../services/guiXeApi";

const CreateGuiXePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hoKhau: "",
    loaiXe: "Xe máy",
    bienKiemSoat: "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.hoKhau || !formData.bienKiemSoat) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      await themGuiXe(formData.hoKhau, {
        LoaiXe: formData.loaiXe,
        BKS: formData.bienKiemSoat,
      });

      alert("Thêm phương tiện gửi xe thành công!");
      navigate("/quan-ly-gui-xe");
    } catch (err) {
      console.error("Lỗi thêm gửi xe:", err);
      alert(
        err.response?.data?.message || "Có lỗi xảy ra khi thêm phương tiện"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.page}>
      <Stack direction="row" alignItems="center" spacing={1} sx={styles.header}>
        <IconButton onClick={() => navigate("/quan-ly-gui-xe")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={styles.title}>
          Thêm phương tiện gửi xe
        </Typography>
      </Stack>

      <Paper sx={styles.paper}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <TextField
                fullWidth
                label="Mã hộ khẩu"
                name="hoKhau"
                variant="filled"
                value={formData.hoKhau}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Loại xe</InputLabel>
                <Select
                  name="loaiXe"
                  value={formData.loaiXe}
                  onChange={handleChange}
                >
                  <MenuItem value="Xe máy">Xe máy</MenuItem>
                  <MenuItem value="Ô tô">Ô tô</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                label="Biển kiểm soát"
                name="bienKiemSoat"
                variant="filled"
                value={formData.bienKiemSoat}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item sx={styles.action}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={styles.saveButton}
                disabled={loading}
              >
                {loading ? "ĐANG LƯU..." : "LƯU"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateGuiXePage;

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
    maxWidth: "800px",
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
