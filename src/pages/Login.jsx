import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Auth.css';
import apiService from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.login(formData);
      
      if (response.success) {
        alert('Đăng nhập thành công!');
        // Redirect to appropriate dashboard
        const userType = response.data.user.userType;
        if (userType === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/jobs');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.message || 'Đăng nhập thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header - Similar to Register */}
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
              <li><Link to="/login" className="btn-login active">Đăng nhập</Link></li>
              <li><Link to="/register" className="btn-register">Đăng ký</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form">
              <h2>Đăng nhập</h2>
              <p>Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {errors.submit && (
                  <div className="error-text" style={{ textAlign: 'center', marginBottom: '15px' }}>
                    {errors.submit}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn-auth"
                  disabled={loading}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
              
              <div className="auth-switch">
                <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
              </div>
            </div>
            
            <div className="auth-image">
              <div className="auth-illustration">🔐</div>
              <div className="auth-features">
                <h3>Lợi ích khi đăng nhập</h3>
                <ul>
                  <li>✓ Ứng tuyển việc làm nhanh chóng</li>
                  <li>✓ Lưu công việc yêu thích</li>
                  <li>✓ Nhận thông báo việc làm phù hợp</li>
                  <li>✓ Quản lý hồ sơ ứng tuyển</li>
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

export default Login;