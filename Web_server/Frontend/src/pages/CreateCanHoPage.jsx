import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper,
  Stack, IconButton, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { createCanHo } from '../services/canhoApi';

const CreateCanHoPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    maCanHo: '', 
    tenCanHo: '',
    tang: '',
    dienTich: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    
    if (!formData.maCanHo || !formData.tenCanHo) {
      alert("Vui lòng điền mã và tên căn hộ!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        MaCanHo: formData.maCanHo.trim(), 
        
        TenCanHo: formData.tenCanHo,
        Tang: parseInt(formData.tang),
        DienTich: parseFloat(formData.dienTich),
        MaHoKhau: null
      };

      await createCanHo(payload);
      
      alert("Thêm căn hộ thành công!");
      navigate('/ho-gia-dinh/can-ho');

    } catch (error) {
      console.error("Lỗi:", error);
      
      const message = error.response?.data?.message || "Có lỗi xảy ra!";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
        p: 4, 
        width: '100%',        
        height: '100vh',     
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'  
      }}>
      
      {}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/ho-gia-dinh/can-ho')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Thêm căn hộ mới
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '800px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            
            <Grid size={12}>
              <TextField
                fullWidth
                label="Mã căn hộ (ID) *"
                name="maCanHo"
                type="text" 
                variant="filled"
                value={formData.maCanHo}
                onChange={handleChange}
                placeholder="Ví dụ: P101, A205..."
                required
                autoFocus 
              />
            </Grid>

            {}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Tên căn hộ *"
                name="tenCanHo"
                variant="filled"
                value={formData.tenCanHo}
                onChange={handleChange}
                placeholder="Nhập tên hiển thị..."
                required
              />
            </Grid>

            {}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Tầng *"
                name="tang"
                type="number"
                variant="filled"
                value={formData.tang}
                onChange={handleChange}
                required
              />
            </Grid>

            {}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Diện tích (m2) *"
                name="dienTich"
                type="number"
                variant="filled"
                value={formData.dienTich}
                onChange={handleChange}
                required
                inputProps={{ step: "0.1" }} 
              />
            </Grid>

            {}
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                disabled={loading} 
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ 
                  bgcolor: '#008ecc', 
                  px: 4, 
                  py: 1.2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#007bb5' }
                }}
              >
                {loading ? "ĐANG LƯU..." : "LƯU CĂN HỘ"}
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCanHoPage;