import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  IconButton, Stack, CircularProgress 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom'; 
import { createNhanKhau, getCanHoCount, getNhanKhauByCanHo } from '../services/nhankhauApi';

const CreateNhanKhauPage = () => {
  const navigate = useNavigate();
  const { maHoKhau } = useParams(); 
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    maNhanKhau: '', 
    hoTen: '',
    cccd: '',
    danToc: 'Kinh',
    tonGiao: 'Không',
    quocTich: 'Việt Nam',
    ngheNghiep: '',
    ngaySinh: '',
    noiSinh: '',
    quanHe: '',
    ghiChu: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!maHoKhau) {
      alert("Lỗi: Không xác định được Hộ khẩu để thêm người này vào!");
      return;
    }

    try {
      setLoading(true);
      if (formData.quanHe.trim().toLowerCase() === 'chủ hộ') {
       
        const resApartments = await getCanHoCount();
        const targetApartment = resApartments.data.find(apt => String(apt.MaHoKhau) === String(maHoKhau));

        if (targetApartment) {
           
            const resMembers = await getNhanKhauByCanHo(targetApartment.MaCanHo);
            const members = (resMembers.data && resMembers.data.data) ? resMembers.data.data : [];

            
            const existingHost = members.find(m => m.QuanHeVoiChuHo && m.QuanHeVoiChuHo.trim().toLowerCase() === 'chủ hộ');
            
            if (existingHost) {
                alert(`Lỗi: Hộ này đã có chủ hộ là "${existingHost.HoTen}".\nKhông thể thêm chủ hộ thứ hai.`);
                setLoading(false);
                return; 
            }
        }
      }

      
      const payload = {
        MaNhanKhau: formData.maNhanKhau,
        MaHoKhau: maHoKhau, 
        HoTen: formData.hoTen,
        GioiTinh: formData.gioiTinh,
        NgaySinh: formData.ngaySinh || null,
        DanToc: formData.danToc,
        TonGiao: formData.tonGiao,
        QuocTich: formData.quocTich,
        NgheNghiep: formData.ngheNghiep,
        SoCCCD: formData.cccd,
        NoiSinh: formData.noiSinh,
        QuanHeVoiChuHo: formData.quanHe
      };

      await createNhanKhau(payload);
      
      alert("Đăng ký nhân khẩu thành công!");
      navigate('/quan-ly-nhan-dan/nhan-khau', { state: { targetMaHoKhau: maHoKhau } });

    } catch (error) {
      console.error("Lỗi:", error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau', { state: { targetMaHoKhau: maHoKhau } })}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Thêm thành viên mới
            </Typography>
            <Typography variant="body2" color="textSecondary">
            Đang thêm vào Hộ khẩu mã: <b>{maHoKhau}</b>
            </Typography>
        </Box>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            
            {}
            <Grid size={4}>
              <TextField
                fullWidth
                label="Mã Nhân Khẩu (ID) *"
                name="maNhanKhau"
                variant="filled"
                value={formData.maNhanKhau}
                onChange={handleChange}
                required
                placeholder="VD: NK001"
              />
            </Grid>
            <Grid size={8}>
              <TextField
                fullWidth
                label="Họ tên *"
                name="hoTen"
                variant="filled"
                value={formData.hoTen}
                onChange={handleChange}
                required
              />
            </Grid>

            {}
            <Grid size={4}>
               {}
               <TextField
                select
                fullWidth
                label="Giới tính *"
                name="gioiTinh"
                variant="filled"
                value={formData.gioiTinh || ''}
                onChange={handleChange}
                SelectProps={{ native: true }}
                
              >
                <option value=""></option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </TextField>
            </Grid>
            <Grid size={8}>
              <TextField
                fullWidth
                label="Ngày sinh"
                name="ngaySinh"
                type="date"
                variant="filled"
                value={formData.ngaySinh}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                
              />
            </Grid>

            {}
            <Grid size={4}>
              <TextField
                fullWidth
                label="Số CCCD "
                name="cccd"
                variant="filled"
                value={formData.cccd}
                onChange={handleChange}
                
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                label="Dân tộc"
                name="danToc"
                variant="filled"
                value={formData.danToc}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                fullWidth
                label="Quan hệ với chủ hộ"
                name="quanHe"
                variant="filled"
                value={formData.quanHe}
                onChange={handleChange}
                placeholder="VD: Con, Vợ..."
              />
            </Grid>

            {}
            <Grid size={6}>
              <TextField
                fullWidth
                label="Nghề nghiệp"
                name="ngheNghiep"
                variant="filled"
                value={formData.ngheNghiep}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Nơi sinh"
                name="noiSinh"
                variant="filled"
                value={formData.noiSinh}
                onChange={handleChange}
              />
            </Grid>
            
            
            <Grid size={6}>
              <TextField
                fullWidth
                label="Tôn giáo"
                name="tonGiao"
                variant="filled"
                value={formData.tonGiao}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Quốc tịch"
                name="quocTich"
                variant="filled"
                value={formData.quocTich}
                onChange={handleChange}
              />
            </Grid>

            {}
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau', { state: { targetMaHoKhau: maHoKhau } })}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                sx={{ 
                  bgcolor: '#27ae60', 
                  px: 4, 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#219150' }
                }}
              >
                {loading ? "ĐANG LƯU..." : "LƯU NHÂN KHẨU"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateNhanKhauPage;