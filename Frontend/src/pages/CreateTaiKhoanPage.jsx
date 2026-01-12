
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack, IconButton, InputAdornment 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';


import { createTaiKhoan } from '../services/taikhoanApi';
import { getThongTinChuHo } from '../services/hokhauApi';

const CreateTaiKhoanPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  
  const [hkError, setHkError] = useState("");

  const [formData, setFormData] = useState({
    hoTen: '',
    SoCCCD: '',
    tenDangNhap: '',
    matKhau: '',
    quyen: 'Người dùng', 
    maHoKhau: ''
  });

  
  const isUser = formData.quyen === 'Người dùng';

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name === 'quyen') {
        setFormData({
            ...formData,
            quyen: value,
            maHoKhau: '', 
            hoTen: '',    
            SoCCCD: ''    
        });
        setHkError(""); 
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  
  const handleCheckMaHoKhau = async () => {
    
    if (isUser && formData.maHoKhau) {
        try {
            const res = await getThongTinChuHo(formData.maHoKhau);
            const { HoTen, SoCCCD } = res.data;
            
            
            setFormData(prev => ({
                ...prev,
                hoTen: HoTen,
                SoCCCD: SoCCCD
            }));
            setHkError(""); 

        } catch (error) {
            
            const msg = error.response?.data?.message || "Không tìm thấy hộ khẩu này!";
            setHkError(msg);
            setFormData(prev => ({ ...prev, hoTen: '', SoCCCD: '' }));
        }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (hkError) return; 

    try {
        const payload = {
            tenDangNhap: formData.tenDangNhap,
            matKhau: formData.matKhau,
            quyen: formData.quyen,
            
            maHoKhau: isUser ? formData.maHoKhau : null,
            hoTen: formData.hoTen,
            SoCCCD: formData.SoCCCD
        };

        await createTaiKhoan(payload);
        alert("Tạo tài khoản thành công!");
        navigate('/quan-ly-tai-khoan');
    } catch (error) {
        const msg = error.response?.data?.message || "Lỗi khi tạo tài khoản";
        alert(msg);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-tai-khoan')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tạo tài khoản mới
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '800px', mx: 'auto' }}>
        <form onSubmit={handleSave}>
          {}
          <Grid container spacing={3} direction="column">

            {}
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Vai trò hệ thống *</InputLabel>
                <Select
                  name="quyen"
                  value={formData.quyen}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Người dùng">Cư dân (User)</MenuItem>
                  <MenuItem value="Kế toán">Kế toán</MenuItem>
                  <MenuItem value="Admin">Ban quản trị (Admin)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mã Hộ Khẩu"
                name="maHoKhau"
                variant="filled"
                value={formData.maHoKhau}
                onChange={handleChange}
                onBlur={handleCheckMaHoKhau} 
                
                
                disabled={!isUser} 
                required={isUser}  
                
                error={!!hkError}
                helperText={
                    hkError 
                    ? hkError 
                    : (isUser ? "Nhập mã HK để tự động lấy tên chủ hộ." : "Vai trò quản lý không cần nhập mã này.")
                }
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên chủ tài khoản *"
                name="hoTen"
                variant="filled"
                value={formData.hoTen}
                onChange={handleChange}
                required
                disabled={isUser}
                InputLabelProps={{ shrink: true }} 
                placeholder={isUser ? "Tự động điền theo mã HK..." : "Nhập họ tên nhân viên"}
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Căn cước công dân *"
                name="SoCCCD"
                variant="filled"
                value={formData.SoCCCD}
                onChange={handleChange}
                required
                
                
                disabled={isUser} 
                
                InputLabelProps={{ shrink: true }}
                placeholder={isUser ? "Tự động điền theo mã HK..." : "Nhập số CCCD"}
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên đăng nhập *"
                name="tenDangNhap"
                variant="filled"
                value={formData.tenDangNhap}
                onChange={handleChange}
                required
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mật khẩu *"
                name="matKhau"
                type={showPassword ? 'text' : 'password'}
                variant="filled"
                value={formData.matKhau}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                startIcon={<SaveIcon />}
                disabled={!!hkError} 
                sx={{ 
                  bgcolor: '#008ecc', 
                  px: 4, py: 1.2, fontWeight: 'bold', textTransform: 'none',
                  '&:hover': { bgcolor: '#007bb5' }
                }}
              >
                TẠO TÀI KHOẢN
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTaiKhoanPage;