import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Sử dụng context Auth đã hoàn chỉnh

/**
 * Component bảo vệ các tuyến đường, kiểm tra trạng thái xác thực và phân quyền.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Nội dung (Component) cần hiển thị nếu có quyền.
 * @param {boolean} [props.requireAuth=true] - Có bắt buộc phải đăng nhập không.
 * @param {string[]} [props.allowedRoles=[]] - Mảng các loại người dùng được phép truy cập (ví dụ: ['employer', 'student']).
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = []
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Xử lý trạng thái Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* Có thể thay bằng một Component Spinner chuyên dụng */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Xử lý Route riêng tư (Yêu cầu đăng nhập)
  if (requireAuth) {
    // Nếu chưa xác thực, chuyển hướng đến trang Đăng nhập
    if (!isAuthenticated) {
      // Lưu lại đường dẫn hiện tại để quay lại sau khi đăng nhập thành công
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra Phân quyền (Role-based access)
    // Nếu có roles được định nghĩa và user không có trong danh sách cho phép
    // Phải kiểm tra user tồn tại trước khi truy cập user.userType
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.userType)) {
      // Chuyển hướng đến trang Bị cấm/Không có quyền
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Nếu đã xác thực và có quyền
    return children;
  }

  // 3. Xử lý Route công khai (Không yêu cầu đăng nhập: /login, /register)
  if (!requireAuth) {
    // Nếu ĐÃ đăng nhập, chuyển hướng khỏi các trang công khai (login, register)
    if (isAuthenticated) {
      // Chuyển hướng đến Dashboard phù hợp dựa trên userType
      const redirectTo = user.userType === 'employer' ? '/employer/dashboard' : '/dashboard';
      return <Navigate to={redirectTo} replace />;
    }
    
    // Nếu chưa đăng nhập, cho phép truy cập
    return children;
  }
};

export default ProtectedRoute;