import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';
import apiService from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      const response = await apiService.getFeaturedJobs();
      setFeaturedJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error loading featured jobs:', error);
      setFeaturedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchTerm}&location=${location}`);
  };

  const categories = [
    { icon: '🍽️', title: 'Phục vụ', description: 'Nhà hàng, quán cafe' },
    { icon: '🛒', title: 'Bán hàng', description: 'Cửa hàng, siêu thị' },
    { icon: '📚', title: 'Gia sư', description: 'Dạy kèm các môn học' },
    { icon: '💻', title: 'Công nghệ', description: 'Lập trình, thiết kế' },
    { icon: '📦', title: 'Giao hàng', description: 'Shipper, giao đồ ăn' },
    { icon: '🎯', title: 'Khác', description: 'Các công việc đa dạng' }
  ];

  const steps = [
    { number: 1, title: 'Tạo tài khoản', description: 'Đăng ký tài khoản miễn phí trong vài phút' },
    { number: 2, title: 'Tìm việc phù hợp', description: 'Tìm kiếm và lọc các công việc bán thời gian' },
    { number: 3, title: 'Ứng tuyển', description: 'Gửi hồ sơ ứng tuyển đến nhà tuyển dụng' },
    { number: 4, title: 'Bắt đầu làm việc', description: 'Nhận công việc và bắt đầu làm việc' }
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <header>
        <div className="container">
          <div className="logo">
            <h1><Link to="/">CĐ9+QTM3K14</Link></h1>
            <p>Việc làm bán thời gian cho học sinh, sinh viên</p>
          </div>
          <nav>
            <ul>
              <li><Link to="/" className="active">Trang chủ</Link></li>
              <li><Link to="/jobs">Tìm việc</Link></li>
              <li><Link to="/employer/dashboard">Nhà tuyển dụng</Link></li>
              <li><Link to="/login" className="btn-login">Đăng nhập</Link></li>
              <li><Link to="/register" className="btn-register">Đăng ký</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Tìm Việc Làm Bán Thời Gian Phù Hợp</h1>
            <p>Kết nối học sinh, sinh viên với các công việc bán thời gian linh hoạt, phù hợp với lịch học</p>
            <form className="search-box" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Tìm kiếm việc làm, vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Tất cả địa điểm</option>
                <option value="hanoi">Rạch Giá</option>
                <option value="hcm">Rạch Sỏi</option>
                <option value="danang">Kiên Lương</option>
              </select>
              <button type="submit" className="btn-search">
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2>Danh mục việc làm</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-jobs">
        <div className="container">
          <h2>Việc làm nổi bật</h2>
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Đang tải việc làm...</p>
            </div>
          ) : (
            <>
              <div className="jobs-grid">
                {featuredJobs.slice(0, 6).map(job => (
                  <div key={job._id} className="job-item">
                    <div className="job-header">
                      <div className="job-title">{job.title}</div>
                      <div className="job-company">{job.company?.name}</div>
                    </div>
                    <div className="job-body">
                      <div className="job-info">
                        <div className="job-location">📍 {job.location}</div>
                        <div className="job-salary">💰 {job.salary}</div>
                      </div>
                      <p className="job-description">
                        {job.description.length > 100 
                          ? `${job.description.substring(0, 100)}...` 
                          : job.description
                        }
                      </p>
                    </div>
                    <div className="job-footer">
                      <span className="job-type">{job.jobType}</span>
                      <button 
                        className="btn-apply"
                        onClick={() => navigate(`/jobs#${job._id}`)}
                      >
                        Ứng tuyển
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {featuredJobs.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">💼</div>
                  <h3>Chưa có việc làm nổi bật</h3>
                  <p>Hãy quay lại sau để xem các công việc mới nhất</p>
                </div>
              )}
              <div className="view-all">
                <Link to="/jobs" className="btn-view-all">
                  Xem tất cả việc làm
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>Cách thức hoạt động</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <div key={index} className="step">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
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

export default Home;