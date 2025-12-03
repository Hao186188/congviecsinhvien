import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Auth.css';
import apiService from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: ''
  });
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.userType) {
      newErrors.userType = 'Vui lòng chọn loại tài khoản';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!agreement) {
      newErrors.agreement = 'Vui lòng đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  try {
    const { confirmPassword, ...submitData } = formData;
    
    const response = await apiService.register(submitData);
    
    if (response.success) {
      alert('Đăng ký thành công!');
      // Auto-login after registration
      const loginResponse = await apiService.login({
        email: formData.email,
        password: formData.password
      });
      
      if (loginResponse.success) {
        // Redirect based on user type
        if (formData.userType === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/jobs');
        }
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-page">
      {/* Header */}
      <header>
        <div className="container">
          <div className="logo">
            <h1><Link to="/">PartTimeJob</Link></h1>
            <p>Việc làm bán thời gian cho học sinh, sinh viên</p>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/jobs">Tìm việc</Link></li>
              <li><Link to="/employer/dashboard">Nhà tuyển dụng</Link></li>
              <li><Link to="/login" className="btn-login">Đăng nhập</Link></li>
              <li><Link to="/register" className="btn-register active">Đăng ký</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Register Section */}
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form">
              <h2>Đăng ký tài khoản</h2>
              <p>Tạo tài khoản để bắt đầu tìm kiếm việc làm phù hợp.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="userType">Bạn là *</label>
                  <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className={errors.userType ? 'error' : ''}
                  >
                    <option value="">Chọn loại tài khoản</option>
                    <option value="student">Học sinh/Sinh viên tìm việc</option>
                    <option value="employer">Nhà tuyển dụng</option>
                  </select>
                  {errors.userType && <span className="error-text">{errors.userType}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
                
                <div className="form-agreement">
                  <label className="agreement">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={agreement}
                      onChange={(e) => setAgreement(e.target.checked)}
                      required
                    />
                    <span>Tôi đồng ý với <a href="/terms">Điều khoản sử dụng</a> và <a href="/privacy">Chính sách bảo mật</a></span>
                  </label>
                  {errors.agreement && <span className="error-text">{errors.agreement}</span>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn-auth"
                  disabled={loading}
                >
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </form>
              
              <div className="auth-divider">
                <span>Hoặc đăng ký với</span>
              </div>
              
              <div className="social-auth">
                <button className="btn-social btn-google">
                  <span>Google</span>
                </button>
                <button className="btn-social btn-facebook">
                  <span>Facebook</span>
                </button>
              </div>
              
              <div className="auth-switch">
                <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
              </div>
            </div>
            
            <div className="auth-image">
              <div className="auth-illustration">📝</div>
              <div className="auth-features">
                <h3>Tại sao nên đăng ký?</h3>
                <ul>
                  <li>✓ Truy cập hàng ngàn việc làm bán thời gian</li>
                  <li>✓ Ứng tuyển nhanh chóng với một cú click</li>
                  <li>✓ Nhận thông báo việc làm phù hợp</li>
                  <li>✓ Lưu và quản lý công việc yêu thích</li>
                  <li>✓ Theo dõi trạng thái ứng tuyển</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>QTM3-K14</h3>
              <p>Kết nối học sinh, sinh viên với các công việc bán thời gian phù hợp.</p>
            </div>
            <div className="footer-section">
              <h4>Liên kết nhanh</h4>
              <ul>
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/jobs">Tìm việc</Link></li>
                <li><Link to="/employer/dashboard">Nhà tuyển dụng</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
                <li><Link to="/contact">Liên hệ</Link></li>
                <li><Link to="/terms">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Theo dõi chúng tôi</h4>
              <div className="social-links">
                <a href="https://facebook.com/share/17PfiN1Xrk/" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
                <a href="https://zalo.me/0788984741" target="_blank" rel="noopener noreferrer">
                  Zalo
                </a>
                <a href="mailto:contact@parttimejob.com">Email</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 QTM3-K14. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;