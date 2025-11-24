import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1><Link to="/">CĐ9+QTM3K14</Link></h1>
          <p>Việc làm bán thời gian cho học sinh, sinh viên</p>
        </div>
        
        <nav>
          <ul className={isMobileMenuOpen ? 'active' : ''}>
            <li><Link to="/" className={isActive('/')} onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link></li>
            <li><Link to="/jobs" className={isActive('/jobs')} onClick={() => setIsMobileMenuOpen(false)}>Tìm việc</Link></li>
            <li><Link to="/employer/dashboard" className={isActive('/employer')} onClick={() => setIsMobileMenuOpen(false)}>Nhà tuyển dụng</Link></li>
            
            {user ? (
              <li className="user-menu">
                <span className="user-name">👤 {user.name}</span>
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>👤 Hồ sơ</Link>
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>⚙️ Cài đặt</Link>
                  <Link to="/my-applications" onClick={() => setIsMobileMenuOpen(false)}>📨 Đơn ứng tuyển</Link>
                  <Link to="/saved-jobs" onClick={() => setIsMobileMenuOpen(false)}>💚 Việc đã lưu</Link>
                  <hr />
                  <button onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className={`btn-login ${isActive('/login')}`} onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={`btn-register ${isActive('/register')}`} onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
}

export default NavBar;