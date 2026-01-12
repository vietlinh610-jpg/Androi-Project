import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';




import { layTTChung, layTTGD } from "../services/ttcnApi";


const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
};

const ThanhVienGiaDinhPage = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userID");

  
  const [ttChung, setTtChung] = useState({
    maHoKhau: "",
    canHo: "",
    tang: "",
    chuHo: "",
    diaChiThuongTru: "",
  });

  const [members, setMembers] = useState([]);

  
  useEffect(() => {
    const fetchTTChung = async () => {
      try {
        const res = await layTTChung(userId);
        const data = res.data.data;

        setTtChung({
          maHoKhau: data.maHoKhau,
          canHo: data.canHo,
          tang: data.tang,
          chuHo: data.chuHo,
          diaChiThuongTru: data.diaChiThuongTru,
        });
      } catch (err) {
        console.error("Lỗi lấy thông tin chung:", err);
      }
    };

    fetchTTChung();
  }, [userId]);

  
  useEffect(() => {
    const fetchTTGD = async () => {
      try {
        const res = await layTTGD(userId);

        const data = res.data.data.map((item) => ({
          id: item.MaNhanKhau,
          hoTen: item.HoTen,
          quanHe: item.QuanHeVoiChuHo,
          ngaySinh: formatDate(item.NgaySinh),
          gioiTinh: item.GioiTinh,
          danToc: item.DanToc,
          tonGiao: item.TonGiao,
          ngheNghiep: item.NgheNghiep,
        }));

        setMembers(data);
      } catch (err) {
        console.error("Lỗi lấy thông tin gia đình:", err);
      }
    };

    fetchTTGD();
  }, [userId]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} title="Trang chủ">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Thông tin hộ gia đình
        </Typography>
      </Stack>


      {}
      <Paper elevation={1} sx={{ p: 3, borderRadius: "12px", mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <HomeIcon sx={{ color: "#008ecc" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Thông tin chung
              </Typography>
            </Stack>

            <Typography sx={{ mb: 1 }}>
              <strong>Mã hộ khẩu:</strong>{" "}
              <span style={{ color: "#008ecc", fontWeight: "bold" }}>
                {ttChung.maHoKhau}
              </span>
            </Typography>

            <Typography>
              <strong>Chủ hộ:</strong> {ttChung.chuHo}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ mt: 1 }}>
            <Stack
              direction="row"
              spacing={4}
              sx={{ mt: { xs: 0, md: 5 }, mb: 1 }}
            >
              <Typography>
                <strong>Căn hộ:</strong> {ttChung.canHo}
              </Typography>
              <Typography>
                <strong>Tầng:</strong> {ttChung.tang}
              </Typography>
            </Stack>

            <Typography>
              <strong>Địa chỉ thường trú:</strong>{" "}
              {ttChung.diaChiThuongTru}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {}
      <Paper elevation={1} sx={{ borderRadius: "12px", overflow: "hidden" }}>
        <Box
          sx={{
            p: 2,
            bgcolor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <GroupsIcon sx={{ color: "#008ecc" }} />
          <Typography sx={{ fontWeight: "bold" }}>
            Thành viên trong gia đình
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quan hệ</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Giới tính</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Dân tộc</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tôn giáo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nghề nghiệp</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell sx={{ fontWeight: "500" }}>
                    {member.hoTen}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.quanHe}
                      size="small"
                      color={
                        member.quanHe === "Chủ hộ" ? "primary" : "default"
                      }
                      variant={
                        member.quanHe === "Chủ hộ" ? "filled" : "outlined"
                      }
                    />
                  </TableCell>
                  <TableCell>{member.ngaySinh}</TableCell>
                  <TableCell>{member.gioiTinh}</TableCell>
                  <TableCell>{member.danToc}</TableCell>
                  <TableCell>{member.tonGiao}</TableCell>
                  <TableCell>{member.ngheNghiep}</TableCell>
                </TableRow>
              ))}

              {members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có dữ liệu thành viên
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ThanhVienGiaDinhPage;
