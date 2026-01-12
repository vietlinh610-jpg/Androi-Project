import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { chinhSuaTTCN, layTTCN } from "../services/ttcnApi";
import { useNavigate } from 'react-router-dom';


const ThongTinCaNhanPage = () => {
  const navigate = useNavigate();
  
  const userId = localStorage.getItem("userID");

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    hoTen: "",
    cccd: "",
    gioiTinh: "",
    ngaySinh: "",
    soDienThoai: "0900000000", 
    danToc: "",
    tonGiao: "",
    ngheNghiep: "",
    noiSinh: "",
  });

  
  useEffect(() => {
    const fetchTTCN = async () => {
      try {
        const res = await layTTCN(userId);
        const data = res.data.data;

        setUserInfo({
          hoTen: data.HoTen,
          cccd: data.SoCCCD,
          gioiTinh: data.GioiTinh,
          ngaySinh: data.NgaySinh?.slice(0, 10),
          soDienThoai: "0900000000", 
          danToc: data.DanToc,
          tonGiao: data.TonGiao,
          ngheNghiep: data.NgheNghiep,
          noiSinh: data.NoiSinh,
        });
      } catch (err) {
        console.error("Lỗi load TTCN:", err);
        alert("Không thể tải thông tin cá nhân");
      }
    };

    fetchTTCN();
  }, [userId]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSave = async () => {
    try {
      const payload = {
        CCCD: userInfo.cccd,
        SDT: userInfo.soDienThoai,
        TonGiao: userInfo.tonGiao,
        NgheNghiep: userInfo.ngheNghiep,
      };

      await chinhSuaTTCN(userId, payload);

      setIsEditing(false);
      alert("Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật thông tin cá nhân");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Thông tin cá nhân
        </Typography>
      </Stack>


      <Paper elevation={2} sx={{ p: 5, borderRadius: "20px" }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 5 }}>
          <Avatar sx={{ width: 100, height: 100 }}>
            {userInfo.hoTen?.charAt(0)}
          </Avatar>
          <Typography variant="h4">{userInfo.hoTen}</Typography>
        </Stack>

        <Grid container spacing={3}>
          {}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Họ và tên" value={userInfo.hoTen} disabled />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Giới tính" value={userInfo.gioiTinh} disabled />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={userInfo.ngaySinh}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Số CCCD"
              name="cccd"
              value={userInfo.cccd}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="soDienThoai"
              value={userInfo.soDienThoai}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Tôn giáo"
              name="tonGiao"
              value={userInfo.tonGiao}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nghề nghiệp"
              name="ngheNghiep"
              value={userInfo.ngheNghiep}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          {isEditing ? (
            <Stack direction="row" spacing={2}>
              <Button color="error" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Lưu thay đổi
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa thông tin
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ThongTinCaNhanPage;