const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


// Import Routes
const hokhauRoutes = require('./routes/hokhauRoutes');
const canhoRoutes = require('./routes/canhoRoutes');
const nhankhauRoutes = require('./routes/nhankhauRoutes');
const tamvangRoutes = require('./routes/tamvangRoutes');
const tamtruRoutes = require('./routes/tamtruRoutes');
const taikhoanRoutes = require('./routes/taikhoanRoutes');
const loginRoutes = require('./routes/loginRoutes');

// Phần thu phí + người dùng
const khoanThuRoutes = require('./routes/khoanThuRoutes');
const thuPhiRoutes = require('./routes/thuPhiRoutes');
const ktKhoanThuRoutes = require('./routes/KTKhoanThuRoutes');
const ttcnRoutes = require('./routes/thongTinCaNhanRoutes');
const dongPhiRoutes = require('./routes/dongPhiRoutes');
const guiXeRoutes = require('./routes/guiXeRoutes');

// Sử dụng Routes
app.use('/api/hokhau', hokhauRoutes);
app.use('/api/canho', canhoRoutes);
app.use('/api/nhankhau', nhankhauRoutes);
app.use('/api/tamvang', tamvangRoutes);
app.use('/api/tamtru', tamtruRoutes);
app.use('/api/taikhoan', taikhoanRoutes);
app.use('/api/login', loginRoutes);

// Phần thu phí + người dùng
app.use("/api/khoan-thu", khoanThuRoutes);
app.use("/api/thu-phi", thuPhiRoutes);
app.use("/api/kt-khoanthu", ktKhoanThuRoutes);
app.use("/api/ttcn", ttcnRoutes);
app.use("/api/dongphi", dongPhiRoutes);
app.use("/api/guixe", guiXeRoutes);

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/^.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});