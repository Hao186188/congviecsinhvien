import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
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
              <a href="mailto:vonhathaoqtm3k14@gmail.com">Email</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 QTM3-K14. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;