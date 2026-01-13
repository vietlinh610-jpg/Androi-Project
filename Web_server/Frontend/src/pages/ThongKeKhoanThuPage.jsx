import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";


import { layDoanhThu } from "../services/thuphiApi";

const ThongKeKhoanThuPage = () => {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(2024);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  
  useEffect(() => {
    const fetchDoanhThu = async () => {
      try {
        setLoading(true);

        const requests = [];
        for (let thang = 1; thang <= 12; thang++) {
          requests.push(layDoanhThu(thang, selectedYear));
        }

        const responses = await Promise.all(requests);

        const formattedData = responses.map((res, index) => ({
          month: `T${index + 1}`,
          revenue: res.data.tongDoanhThu || 0,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Lỗi load doanh thu:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoanhThu();
  }, [selectedYear]);

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate("/quan-ly-khoan-thu")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#2c3e50" }}
          >
            Thống kê doanh thu
          </Typography>
        </Stack>

        {}
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Chọn năm</InputLabel>
          <Select
            value={selectedYear}
            label="Chọn năm"
            onChange={handleYearChange}
            sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
          >
            <MenuItem value={2024}>Năm 2024</MenuItem>
            <MenuItem value={2025}>Năm 2025</MenuItem>
            <MenuItem value={2026}>Năm 2026</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: "15px" }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            textAlign: "center",
            fontWeight: "bold",
            color: "#34495e",
          }}
        >
          TỔNG DOANH THU THEO THÁNG - NĂM {selectedYear} (VNĐ)
        </Typography>

        <Box sx={{ width: "100%", height: 450 }}>
          {loading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ecf0f1"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7f8c8d", fontSize: 13 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7f8c8d", fontSize: 13 }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f2f6" }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar
                  dataKey="revenue"
                  name="Doanh thu"
                  fill="#3498db"
                  radius={[6, 6, 0, 0]}
                  barSize={35}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.revenue > 800000000 ? "#2ecc71" : "#3498db"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ThongKeKhoanThuPage;
