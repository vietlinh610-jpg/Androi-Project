
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  Stack, IconButton, InputAdornment, CircularProgress, MenuItem 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search'; 
import { useNavigate } from 'react-router-dom';


import { createTamTru } from '../services/tamtruApi';
import { findNhanKhau } from '../services/nhankhauApi';

const CreateTamTruPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  
  const [foundApartments, setFoundApartments] = useState([]);

  const [formData, setFormData] = useState({
    maNhanKhau: '', 
    hoTen: '',
    SoCCCD: '',
    canHo: '',
    ngayBatDau: new Date().toISOString().split('T')[0], 
    ngayKetThuc: '',
    lyDo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        
        if (name === 'maNhanKhau') {
            setFoundApartments([]); 
            return { ...prev, [name]: value, hoTen: '', SoCCCD: '', canHo: '' };
        }
        return { ...prev, [name]: value };
    });
  };

  
  const handleFindNhanKhau = async () => {
    const maCanTim = formData.maNhanKhau.trim();
    if (!maCanTim) return;

    try {
      const res = await findNhanKhau(maCanTim);
      const { HoTen, SoCCCD, DanhSachCanHo } = res.data;

      
      if (!DanhSachCanHo || DanhSachCanHo.length === 0) {
          alert("THẤT BẠI: Nhân khẩu này chưa thuê/sở hữu căn hộ nào trong hệ thống!");
          
          setFormData(prev => ({ 
              ...prev, 
              maNhanKhau: maCanTim, 
              hoTen: '',            
              SoCCCD: '', 
              canHo: '' 
          }));
          setFoundApartments([]);
          return;
      }
      

      
      setFoundApartments(DanhSachCanHo); 

      setFormData(prev => ({
        ...prev,
        maNhanKhau: maCanTim,
        hoTen: HoTen,
        SoCCCD: SoCCCD,
        
        canHo: DanhSachCanHo.length === 1 ? DanhSachCanHo[0] : ''
      }));

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Không tìm thấy nhân khẩu này trong hệ thống!");
      setFormData(prev => ({ ...prev, hoTen: '', SoCCCD: '', canHo: '' }));
      setFoundApartments([]);
    }
  };

  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.maNhanKhau || !formData.hoTen) {
        alert("Vui lòng tìm kiếm Mã nhân khẩu hợp lệ trước!");
        return;
    }
    if (!formData.canHo) {
        alert("Vui lòng chọn căn hộ!");
        return;
    }

    if (formData.ngayBatDau && formData.ngayKetThuc) {
        const startDate = new Date(formData.ngayBatDau);
        const endDate = new Date(formData.ngayKetThuc);

        if (endDate <= startDate) {
            alert("Lỗi: Ngày kết thúc tạm trú phải sau Ngày bắt đầu!");
            return;
        }
    }

    try {
      setLoading(true);
      await createTamTru({
        MaNhanKhau: formData.maNhanKhau,
        
        TuNgay: formData.ngayBatDau,
        DenNgay: formData.ngayKetThuc,
        LyDo: formData.lyDo + ` (Tại căn hộ: ${formData.canHo})`
      });
      
      alert("Đăng ký tạm trú thành công!");
      navigate('/quan-ly-nhan-dan/tam-tru'); 
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/tam-tru')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Đăng ký tạm trú mới
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            
            {}
            <Grid item xs={12}>
               <TextField
                fullWidth label="Mã Nhân Khẩu *" name="maNhanKhau" variant="filled"
                value={formData.maNhanKhau} onChange={handleChange}
                onBlur={handleFindNhanKhau} 
                placeholder="Nhập mã (VD: NK001) rồi bấm tìm kiếm" required
                helperText={!formData.hoTen && formData.maNhanKhau ? "Bấm kính lúp để kiểm tra thông tin căn hộ" : ""}
                error={!formData.hoTen && formData.maNhanKhau !== ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleFindNhanKhau}><SearchIcon color="primary"/></IconButton>
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
            <Grid item xs={12}>
              <TextField
                fullWidth label="Số CCCD" value={formData.SoCCCD}
                InputProps={{ readOnly: true }} sx={{ bgcolor: '#f5f5f5' }} variant="filled"
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                select 
                fullWidth
                label="Chọn căn hộ tạm trú *"
                name="canHo"
                variant="filled"
                value={formData.canHo}
                onChange={handleChange}
                required
                
                disabled={foundApartments.length === 0} 
                helperText={
                    foundApartments.length === 0 
                    ? "Vui lòng tìm Mã nhân khẩu có sở hữu căn hộ trước" 
                    : "Chọn một trong các căn hộ của người này"
                }
              >
                {foundApartments.map((ma) => (
                    <MenuItem key={ma} value={ma}>
                        {ma}
                    </MenuItem>
                ))}
              </TextField>
            </Grid>

            {}
            <Grid container item spacing={3}>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth label="Tạm trú từ ngày *" name="ngayBatDau" type="date"
                    value={formData.ngayBatDau} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} variant="outlined" required
                />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth label="Đến ngày *" name="ngayKetThuc" type="date"
                    value={formData.ngayKetThuc} onChange={handleChange}
                    InputLabelProps={{ shrink: true }} variant="outlined" required
                />
                </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth label="Lý do tạm trú" name="lyDo" multiline rows={2} variant="filled"
                value={formData.lyDo} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit" variant="contained" 
                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                disabled={loading}
                sx={{ bgcolor: '#008ecc', px: 4, py: 1.2, fontWeight: 'bold' }}
              >
                {loading ? "ĐANG LƯU..." : "LƯU ĐĂNG KÝ"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTamTruPage;