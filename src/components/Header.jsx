import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1><Link to="/">CĐ9+QTM3K14</Link></h1>
          <p>Việc làm bán thời gian cho học sinh, sinh viên</p>
        </div>
        <nav>
          <ul>
            <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
            <li><Link to="/jobs" className={isActive('/jobs')}>Tìm việc</Link></li>
            <li><Link to="/employer/dashboard" className={isActive('/employer')}>Nhà tuyển dụng</Link></li>
            
            {user ? (
              <li className="user-menu">
                <span className="user-name">👤 {user.name}</span>
                <div className="user-dropdown">
                  <button onClick={logout}>🚪 Đăng xuất</button>
                </div>
              </li>
            ) : (
              <>
                <li><Link to="/login" className={`btn-login ${isActive('/login')}`}>Đăng nhập</Link></li>
                <li><Link to="/register" className={`btn-register ${isActive('/register')}`}>Đăng ký</Link></li>
              </>
            )}
          </ul>
        </nav>
        <div className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;