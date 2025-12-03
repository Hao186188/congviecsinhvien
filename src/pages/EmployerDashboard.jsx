import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    newApplications: 0,
  });
  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form Đăng tin - Cập nhật mapping đúng với backend schema
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    salary: '', 
    jobType: 'Bán thời gian',
    category: 'Khác',
    description: '',
    requirements: '',
    benefits: '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    applicationDeadline: '',
    workHours: '',
    vacancies: 1,
    experience: 'Không yêu cầu',
    education: 'Không yêu cầu'
  });

  // Tải Dữ liệu Dashboard
  useEffect(() => {
    if (user && user.userType === 'employer') {
      loadDashboardData();
    } else if (user) {
      setLoading(false);
      setError('Bạn không có quyền truy cập trang nhà tuyển dụng');
    } else {
      setLoading(false);
      setError('Vui lòng đăng nhập để truy cập');
    }
  }, [user]); 

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [jobsResponse, appsResponse] = await Promise.all([
        apiService.getEmployerJobs(),
        apiService.getEmployerApplications(),
      ]);
      
      console.log('Jobs response:', jobsResponse);
      console.log('Applications response:', appsResponse);

      const loadedJobs = jobsResponse.data?.jobs || [];
      const loadedApplications = appsResponse.data?.applications || [];
      
      setJobs(loadedJobs);
      setApplications(loadedApplications);

      // Tính toán thống kê
      const totalJobs = loadedJobs.length;
      const totalApplications = loadedApplications.length;
      const activeJobs = loadedJobs.filter((job) => job.isActive !== false).length;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newApplications = loadedApplications.filter(
        (app) => new Date(app.appliedAt) > oneWeekAgo
      ).length;

      setStats({ 
        totalJobs, 
        totalApplications, 
        activeJobs, 
        newApplications 
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const serverErrorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
      setError('Lỗi khi tải dữ liệu dashboard: ' + serverErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Form Change
  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý Đăng tin - Phiên bản đã sửa
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      console.log('🟡 Bắt đầu xử lý đăng tin...');

      // Validation cơ bản - CHỈ các trường thực sự required
      if (!jobForm.title || !jobForm.location || !jobForm.description) {
        const errorMsg = 'Vui lòng điền đầy đủ các trường bắt buộc (tiêu đề, địa điểm, mô tả)';
        console.log('❌ Validation failed:', errorMsg);
        setLoading(false);
        return setError(errorMsg);
      }

      // 🔥 CHUẨN BỊ DỮ LIỆU ĐÚNG VỚI BACKEND SCHEMA
      const jobData = {
        title: jobForm.title,
        location: jobForm.location,
        description: jobForm.description,
        jobType: jobForm.jobType,
        category: jobForm.category,
        
        // Các trường optional - CHỈ gửi nếu có giá trị
        ...(jobForm.salary && { salary: jobForm.salary }),
        ...(jobForm.requirements && { requirements: jobForm.requirements }),
        ...(jobForm.benefits && { benefits: jobForm.benefits }),
        ...(jobForm.contactEmail && { contactEmail: jobForm.contactEmail }),
        ...(jobForm.contactPhone && { contactPhone: jobForm.contactPhone }),
        ...(jobForm.workHours && { workHours: jobForm.workHours }),
        ...(jobForm.vacancies && { vacancies: parseInt(jobForm.vacancies) }),
        ...(jobForm.experience && { experience: jobForm.experience }),
        ...(jobForm.education && { education: jobForm.education }),
        ...(jobForm.applicationDeadline && { 
          applicationDeadline: new Date(jobForm.applicationDeadline).toISOString() 
        })
      };

      console.log('=== DEBUG JOB DATA ===');
      console.log('Title:', jobForm.title);
      console.log('Location:', jobForm.location);
      console.log('Description length:', jobForm.description?.length);
      console.log('Job Type:', jobForm.jobType);
      console.log('Category:', jobForm.category);
      console.log('Full jobData:', JSON.stringify(jobData, null, 2));

      console.log('📤 Dữ liệu gửi đến backend:', jobData);

      // Gửi request
      const response = await apiService.createJob(jobData);
      
      console.log('✅ Phản hồi từ backend:', response);

      if (response.success) {
        setShowJobModal(false);
        
        // Reset form
        setJobForm({
          title: '',
          location: '',
          salary: '', 
          jobType: 'Bán thời gian',
          category: 'Khác',
          description: '',
          requirements: '',
          benefits: '',
          contactEmail: user?.email || '',
          contactPhone: user?.phone || '',
          applicationDeadline: '',
          workHours: '',
          vacancies: 1,
          experience: 'Không yêu cầu',
          education: 'Không yêu cầu'
        });
        
        await loadDashboardData();
        alert('✅ Đăng tin tuyển dụng thành công!');
      } else {
        throw new Error(response.message || 'Đăng tin thất bại');
      }

    } catch (err) {
      console.error('❌ Lỗi khi đăng tin:', err);
      
      // 🔥 HIỂN THỊ LỖI CHI TIẾT TỪ SERVER
      let errorMessage = 'Lỗi không xác định khi đăng tin';
      
      if (err.response?.data) {
        const serverError = err.response.data;
        
        // Lỗi validation từ server
        if (serverError.errors && Array.isArray(serverError.errors)) {
          errorMessage = serverError.errors.map(error => 
            `${error.field || 'field'}: ${error.message}`
          ).join(', ');
        } 
        // Lỗi thông báo từ server
        else if (serverError.message) {
          errorMessage = serverError.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`Lỗi đăng tin: ${errorMessage}`);
      
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Cập nhật Trạng thái Đơn ứng tuyển
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await apiService.updateApplicationStatus(applicationId, { status });
      await loadDashboardData();
      alert('✅ Cập nhật trạng thái thành công!');
    } catch (err) {
      const serverErrorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
      console.error('Error updating application:', err);
      setError('Lỗi khi cập nhật trạng thái: ' + serverErrorMessage);
    }
  };

  // Xử lý Đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- RENDERING ---
  
  if (loading) {
    return (
      <div className="employer-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  
  if (!user || user.userType !== 'employer') {
    return (
      <div className="employer-dashboard container">
        <div className="access-denied">
          <h2>🚫 Truy cập bị từ chối</h2>
          <p>Bạn không có quyền truy cập vào trang quản lý nhà tuyển dụng.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employer-dashboard">
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
              <li><Link to="/employer/dashboard" className="active">Nhà tuyển dụng</Link></li>
              <li className="user-menu">
                <span className="user-name">
                  {user?.name || user?.username || user?.email || 'Tài khoản'}
                </span>
                <div className="user-dropdown">
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {error && (
        <div className="error-banner">
          <div className="container">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>🎯 Quản lý tuyển dụng</h1>
            <p>Quản lý tin tuyển dụng và ứng viên của bạn, chào mừng <strong>{user?.name || user?.username || 'Bạn'}</strong>!</p>
            <button 
              className="btn-primary"
              onClick={() => {
                setShowJobModal(true);
                setError('');
              }}
            >
              📝 Đăng tin tuyển dụng mới
            </button>
          </div>

          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.totalJobs}</h3>
                <p>Tin đã đăng</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📨</div>
              <div className="stat-info">
                <h3>{stats.totalApplications}</h3>
                <p>Đơn ứng tuyển</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.activeJobs}</h3>
                <p>Tin đang hoạt động</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{stats.newApplications}</h3>
                <p>Đơn mới (7 ngày)</p>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="content-section">
            <div className="section-header">
              <h2>💼 Tin tuyển dụng của bạn</h2>
              <button className="btn-secondary" onClick={loadDashboardData}>🔄 Làm mới</button>
            </div>
            
            <div className="jobs-list">
              {jobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💼</div>
                  <h3>Chưa có tin tuyển dụng</h3>
                  <p>Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên!</p>
                </div>
              ) : (
                jobs.map(job => (
                  <div key={job._id || job.id} className="job-item-employer">
                    <div className="job-header-employer">
                      <div>
                        <div className="job-title-employer">{job.title}</div>
                        <div className="job-meta">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salary || 'Thương lượng'}</span>
                          <span>🕒 {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <span className={`job-status ${job.isActive ? 'active' : 'inactive'}`}>
                          {job.isActive ? '🟢 Đang hoạt động' : '🔴 Đã đóng'}
                        </span>
                      </div>
                    </div>
                    <div className="job-stats">
                      <div className="job-stat">
                        📨 <strong>{job.applicationCount || 0}</strong> ứng viên
                      </div>
                      <div className="job-stat">
                        🏷️ {job.category || 'Khác'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="content-section">
            <div className="section-header">
              <h2>📨 Đơn ứng tuyển gần đây</h2>
            </div>
            
            <div className="applications-list">
              {applications.slice(0, 5).map(application => (
                <div key={application._id} className="application-item">
                  <div className="application-header">
                    <div>
                      <div className="applicant-name">
                        {application.applicant?.name || application.applicantName || 'Ứng viên'}
                      </div>
                      <div className="application-job">
                        <strong>{application.job?.title || application.jobTitle}</strong>
                      </div>
                      <div className="application-meta">
                        <span>📅 {new Date(application.appliedAt).toLocaleDateString('vi-VN')}</span>
                        <span>📧 {application.applicant?.email || 'Chưa có email'}</span>
                      </div>
                    </div>
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                      className={`status-select status-${application.status}`}
                    >
                      <option value="pending">⏳ Chờ xem xét</option>
                      <option value="reviewed">👀 Đã xem xét</option>
                      <option value="shortlisted">✅ Đã duyệt</option>
                      <option value="rejected">❌ Từ chối</option>
                    </select>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📨</div>
                  <h3>Chưa có đơn ứng tuyển</h3>
                  <p>Đăng tin tuyển dụng để nhận đơn từ ứng viên</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Posting Modal */}
      {showJobModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>📝 Đăng tin tuyển dụng mới</h3>
              <button className="modal-close" onClick={() => setShowJobModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleJobSubmit}>
              <div className="modal-body">
                
                {/* Hiển thị lỗi chi tiết */}
                {error && (
                  <div style={{
                    background: '#fee',
                    border: '1px solid #fcc',
                    color: '#c33',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Chức danh công việc *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={jobForm.title} 
                      onChange={handleJobFormChange} 
                      required
                      minLength="5"
                      maxLength="100"
                      placeholder="VD: Nhân viên phục vụ part-time"
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa điểm làm việc *</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={jobForm.location} 
                      onChange={handleJobFormChange} 
                      required
                      minLength="3"
                      maxLength="200"
                      placeholder="VD: Quận 1, TP.HCM"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mức lương</label>
                    <input 
                      type="text" 
                      name="salary" 
                      value={jobForm.salary} 
                      onChange={handleJobFormChange} 
                      placeholder="VD: 25,000 - 30,000 VNĐ/giờ"
                      maxLength="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại công việc *</label>
                    <select name="jobType" value={jobForm.jobType} onChange={handleJobFormChange} required>
                      <option value="Bán thời gian">Bán thời gian</option>
                      <option value="Toàn thời gian">Toàn thời gian</option>
                      <option value="Thực tập">Thực tập</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Danh mục *</label>
                    <select name="category" value={jobForm.category} onChange={handleJobFormChange} required>
                      <option value="Phục vụ">Phục vụ</option>
                      <option value="Bán hàng">Bán hàng</option>
                      <option value="Gia sư">Gia sư</option>
                      <option value="Công nghệ">Công nghệ</option>
                      <option value="Giao hàng">Giao hàng</option>
                      <option value="Văn phòng">Văn phòng</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Số lượng tuyển</label>
                    <input 
                      type="number" 
                      name="vacancies" 
                      value={jobForm.vacancies} 
                      onChange={handleJobFormChange}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô tả công việc *</label>
                  <textarea 
                    name="description" 
                    value={jobForm.description} 
                    onChange={handleJobFormChange} 
                    rows="5" 
                    required
                    minLength="10"
                    maxLength="5000"
                    placeholder="Mô tả chi tiết về công việc, nhiệm vụ, trách nhiệm..."
                  />
                </div>

                <div className="form-group">
                  <label>Yêu cầu công việc</label>
                  <textarea 
                    name="requirements" 
                    value={jobForm.requirements} 
                    onChange={handleJobFormChange} 
                    rows="3"
                    maxLength="2000"
                    placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
                  />
                </div>

                <div className="form-group">
                  <label>Quyền lợi</label>
                  <textarea 
                    name="benefits" 
                    value={jobForm.benefits} 
                    onChange={handleJobFormChange} 
                    rows="3"
                    maxLength="2000"
                    placeholder="Quyền lợi khi làm việc, phúc lợi..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email liên hệ</label>
                    <input 
                      type="email" 
                      name="contactEmail" 
                      value={jobForm.contactEmail} 
                      onChange={handleJobFormChange} 
                      placeholder="email@congty.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input 
                      type="tel" 
                      name="contactPhone" 
                      value={jobForm.contactPhone} 
                      onChange={handleJobFormChange}
                      placeholder="VD: 0901234567"
                      pattern="^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b$"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kinh nghiệm</label>
                    <select name="experience" value={jobForm.experience} onChange={handleJobFormChange}>
                      <option value="Không yêu cầu">Không yêu cầu</option>
                      <option value="Dưới 1 năm">Dưới 1 năm</option>
                      <option value="1-2 năm">1-2 năm</option>
                      <option value="Trên 2 năm">Trên 2 năm</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trình độ học vấn</label>
                    <select name="education" value={jobForm.education} onChange={handleJobFormChange}>
                      <option value="Không yêu cầu">Không yêu cầu</option>
                      <option value="THPT">THPT</option>
                      <option value="Trung cấp">Trung cấp</option>
                      <option value="Cao đẳng">Cao đẳng</option>
                      <option value="Đại học">Đại học</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Giờ làm việc</label>
                    <input 
                      type="text" 
                      name="workHours" 
                      value={jobForm.workHours} 
                      onChange={handleJobFormChange}
                      placeholder="VD: Linh hoạt, 4h/ngày"
                      maxLength="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hạn nộp hồ sơ</label>
                    <input 
                      type="date" 
                      name="applicationDeadline" 
                      value={jobForm.applicationDeadline} 
                      onChange={handleJobFormChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setShowJobModal(false)}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng tin...' : 'Đăng tin'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2025 QTM3-K14. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default EmployerDashboard;