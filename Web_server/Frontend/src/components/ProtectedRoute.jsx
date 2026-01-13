import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken'); // Kiểm tra quyền truy cập
  
  if (!token) {
    // Nếu chưa đăng nhập, bắt buộc quay về trang login
    return <Navigate to="/login" replace />;
  }

  return children; // Nếu đã login, cho phép hiện Sidebar và Dashboard
};

export default ProtectedRoute;