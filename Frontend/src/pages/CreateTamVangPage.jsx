
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  Stack, IconButton, InputAdornment, CircularProgress 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search'; 
import { useNavigate } from 'react-router-dom';


import { createTamVang } from '../services/tamvangApi'; 
import { findNhanKhau } from '../services/nhankhauApi';

const CreateTamVangPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    maNhanKhau: '', 
    hoTen: '',
    SoCCCD: '',
    maHoKhau: '', 
    ngayDi: new Date().toISOString().split('T')[0], 
    ngayVeDuKien: '',
    lyDo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        
        if (name === 'maNhanKhau') {
            return { ...prev, [name]: value, hoTen: '', SoCCCD: '', maHoKhau: '' };
        }
        return { ...prev, [name]: value };
    });
  };

  
  const handleFindNhanKhau = async () => {
    const maCanTim = formData.maNhanKhau.trim();
    if (!maCanTim) return;

    try {
      const res = await findNhanKhau(maCanTim);
      
      
      const { HoTen, SoCCCD, MaHoKhau } = res.data;

      
      if (!MaHoKhau) {
          alert("Người này chưa có Hộ khẩu thường trú trong hệ thống nên không thể khai báo Tạm vắng!");
          setFormData(prev => ({ ...prev, hoTen: '', SoCCCD: '', maHoKhau: '' }));
          return;
      }

      setFormData(prev => ({
        ...prev,
        maNhanKhau: maCanTim,
        hoTen: HoTen,
        SoCCCD: SoCCCD,
        maHoKhau: MaHoKhau 
      }));

    } catch (err) {
      console.log(err);
      alert("Không tìm thấy nhân khẩu có mã này! Vui lòng kiểm tra lại.");
      setFormData(prev => ({ ...prev, hoTen: '', SoCCCD: '', maHoKhau: '' }));
    }
  };

  
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.maNhanKhau || !formData.hoTen) {
        alert("Vui lòng tìm kiếm Mã nhân khẩu trước!");
        return;
    }
    if (!formData.maHoKhau) {
        alert("Người này không có hộ khẩu hợp lệ!");
        return;
    }

    if (formData.ngayDi && formData.ngayVeDuKien) {
        const startDate = new Date(formData.ngayDi);
        const endDate = new Date(formData.ngayVeDuKien);

        if (endDate <= startDate) {
            alert("Lỗi: Ngày kết thúc tạm vắng phải sau Ngày bắt đầu!");
            return;
        }
    }

    try {
      setLoading(true);
      await createTamVang({
        MaNhanKhau: formData.maNhanKhau,
        MaHoKhau: formData.maHoKhau,
        NgayDi: formData.ngayDi ? new Date(formData.ngayDi) : null,
        NgayVe: formData.ngayVeDuKien ? new Date(formData.ngayVeDuKien) : null,
        LyDo: formData.lyDo
      });
      
      alert("Khai báo tạm vắng thành công!");
      navigate('/quan-ly-nhan-dan/tam-vang');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/tam-vang')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Khai báo tạm vắng 
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mã Nhân Khẩu *"
                name="maNhanKhau"
                variant="filled"
                value={formData.maNhanKhau}
                onChange={handleChange}
                onBlur={handleFindNhanKhau} 
                placeholder="VD: NK001"
                required
                helperText={!formData.hoTen && formData.maNhanKhau ? "Bấm kính lúp để hệ thống tự điền thông tin" : ""}
                error={!formData.hoTen && formData.maNhanKhau !== ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleFindNhanKhau}>
                        <SearchIcon color="primary"/>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth label="Họ và tên" value={formData.hoTen}
                InputProps={{ readOnly: true }} sx={{ bgcolor: '#f5f5f5' }} variant="filled"
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth label="Số CCCD" value={formData.SoCCCD}
                InputProps={{ readOnly: true }} sx={{ bgcolor: '#f5f5f5' }} variant="filled"
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth 
                label="Thuộc Hộ khẩu (Tự động)" 
                name="maHoKhau" 
                variant="filled"
                value={formData.maHoKhau}
                
                InputProps={{ readOnly: true }} 
                sx={{ bgcolor: '#f5f5f5' }} 
                helperText={formData.hoTen && !formData.maHoKhau ? "Lỗi: Người này chưa có mã hộ khẩu" : ""}
              />
            </Grid>

            {}
            <Grid container item spacing={3}>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth label="Ngày đi" name="ngayDi" type="date"
                    value={formData.ngayDi} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} variant="outlined" 
                />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth label="Ngày về dự kiến" name="ngayVeDuKien" type="date"
                    value={formData.ngayVeDuKien} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} variant="outlined" 
                />
                </Grid>
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                fullWidth label="Lý do tạm vắng" name="lyDo" multiline rows={3} variant="filled"
                value={formData.lyDo} onChange={handleChange}
                placeholder="Ví dụ: Đi công tác, Về quê, Du lịch..."
              />
            </Grid>

            {}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit" variant="contained" 
                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                disabled={loading}
                sx={{ bgcolor: '#008ecc', px: 4, py: 1.2, fontWeight: 'bold' }}
              >
                {loading ? "ĐANG LƯU..." : "LƯU KHAI BÁO"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTamVangPage;