import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Quản lý trạng thái đăng nhập
import apiService from '../services/api'; // Dịch vụ gọi API
import './EmployerDashboard.css'; // File CSS liên quan

const EmployerDashboard = () => {
  const { user, logout } = useAuth(); // Lấy user và hàm logout
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

  // 1. Form Đăng tin
  const [jobForm, setJobForm] = useState({
    title: '',
    company: user?.companyName || '', // Điền trước từ user nếu có
    location: '',
    salary: '',
    type: 'part-time', // Khởi tạo là part-time (hay full-time tùy bạn)
    description: '',
    requirements: '',
    benefits: '',
    contact: user?.email || '', // Điền email liên hệ mặc định là email user
    deadline: '',
  });

  // 2. Tải Dữ liệu Dashboard
  useEffect(() => {
    // Chỉ tải dữ liệu khi user đã đăng nhập và là employer
    if (user && user.userType === 'employer') {
      loadDashboardData();
    } else if (user) {
      setLoading(false);
    }
  }, [user]); // Tải lại khi user thay đổi

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load Jobs & Applications song song
      const [jobsResponse, appsResponse] = await Promise.all([
        apiService.getEmployerJobs(),
        apiService.getEmployerApplications(),
      ]);

      const loadedJobs = jobsResponse.data?.jobs || jobsResponse.jobs || [];
      const loadedApplications = appsResponse.data?.applications || appsResponse.applications || [];

      setJobs(loadedJobs);
      setApplications(loadedApplications);

      // Tính toán Thống kê
      const totalJobs = loadedJobs.length;
      const totalApplications = loadedApplications.length;
      const activeJobs = loadedJobs.filter((job) => job.isActive).length;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newApplications = loadedApplications.filter(
        (app) => new Date(app.appliedAt) > oneWeekAgo
      ).length;

      setStats({
        totalJobs,
        totalApplications,
        activeJobs,
        newApplications,
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // Hiển thị lỗi chi tiết hơn nếu có
      const serverErrorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
      setError('Lỗi khi tải dữ liệu dashboard: ' + serverErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý Form Change
  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Xử lý Đăng tin (Đã sửa lỗi cấu trúc dữ liệu tiềm ẩn)
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      // ⚠️ FIX: Gửi jobForm nguyên vẹn, giả định API Backend dùng trường 'type'
      const jobData = jobForm;
      
      // ⚠️ Validation cơ bản:
      if (!jobData.title || !jobData.location || !jobData.description) {
          return setError('Vui lòng điền đầy đủ các trường bắt buộc (Chức danh, Địa điểm, Mô tả).');
      }

      await apiService.createJob(jobData);

      setShowJobModal(false);
      
      // Reset form sau khi đăng thành công
      setJobForm((prev) => ({ 
        ...prev, 
        title: '', 
        location: '', 
        salary: '', 
        description: '', 
        requirements: '', 
        benefits: '', 
        contact: user?.email || '', // Giữ lại email user
        deadline: '',
      }));
      
      await loadDashboardData(); // Tải lại dữ liệu
      alert('Đăng tin tuyển dụng thành công!');
    } catch (err) {
      // Bắt lỗi Server chi tiết hơn
      const serverErrorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
      console.error('Error creating job:', err);
      setError('Lỗi khi đăng tin tuyển dụng: ' + serverErrorMessage);
    }
  };

  // 5. Xử lý Cập nhật Trạng thái Đơn ứng tuyển
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await apiService.updateApplicationStatus(applicationId, { status });
      loadDashboardData();
    } catch (err) {
      const serverErrorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
      console.error('Error updating application:', err);
      setError('Lỗi khi cập nhật trạng thái: ' + serverErrorMessage);
    }
  };

  // 6. Xử lý Đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- RENDERING ---
  
  // Hiển thị Loading State
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
  
  // Kiểm tra quyền (Nếu user đã đăng nhập nhưng không phải employer)
  if (!user || user.userType !== 'employer') {
      return (
          <div className="employer-dashboard container p-8">
              <h2 className="text-xl font-bold">Truy cập bị từ chối</h2>
              <p>Bạn không có quyền truy cập vào trang quản lý nhà tuyển dụng.</p>
              <button onClick={() => navigate('/')} className="mt-4 btn-primary">Quay về Trang chủ</button>
          </div>
      );
  }

  // Giao diện chính
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
                  {/* FIX: Hiển thị tên (ưu tiên name, sau đó là username/email) */}
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 container mx-auto mt-4">
          {error}
        </div>
      )}

      {/* Dashboard Content */}
      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h1>Quản lý tuyển dụng</h1>
            <p>Quản lý tin tuyển dụng và ứng viên của bạn, chào mừng **{user?.name || user?.username || 'Bạn'}**!</p>
            <button 
              className="btn-primary"
              onClick={() => {
                setShowJobModal(true);
                setError(''); // Xóa lỗi khi mở modal
              }}
            >
              Đăng tin tuyển dụng mới
            </button>
          </div>

          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-info"><h3>{stats.totalJobs}</h3><p>Tin đã đăng</p></div></div>
            <div className="stat-card"><div className="stat-icon">📨</div><div className="stat-info"><h3>{stats.totalApplications}</h3><p>Đơn ứng tuyển</p></div></div>
            <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-info"><h3>{stats.activeJobs}</h3><p>Tin đang hoạt động</p></div></div>
            <div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-info"><h3>{stats.newApplications}</h3><p>Đơn mới (7 ngày)</p></div></div>
          </div>

          {/* Jobs List */}
          <div className="content-section">
            <div className="section-header">
              <h2>Tin tuyển dụng của bạn</h2>
              <button className="btn-secondary" onClick={loadDashboardData}>Làm mới</button>
            </div>
            
            <div className="jobs-list">
              {jobs.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">💼</div><h3>Chưa có tin tuyển dụng</h3><p>Bắt đầu bằng cách đăng tin tuyển dụng đầu tiên!</p></div>
              ) : (
                jobs.map(job => (
                  <div key={job._id || job.id} className="job-item-employer">
                    <div className="job-header-employer">
                      <div>
                        <div className="job-title-employer">{job.title}</div>
                        <div className="job-meta">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salary}</span>
                          <span>🕒 {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <span className="job-status">
                          {job.isActive ? '🟢 Đang hoạt động' : '🔴 Đã đóng'}
                        </span>
                      </div>
                    </div>
                    <div className="job-stats">
                      <div className="job-stat">
                        📨 **{job.applicationStats?.pending || 0}** đơn chờ xem xét
                      </div>
                      <div className="job-stat">
                        👥 **{job.applicationCount || 0}** ứng viên
                      </div>
                    </div>
                    {/* Bạn có thể thêm nút "Xem chi tiết ứng viên" tại đây */}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="content-section">
            <div className="section-header">
              <h2>Đơn ứng tuyển gần đây</h2>
            </div>
            
            <div className="applications-list">
              {applications.slice(0, 5).map(application => (
                <div key={application._id} className="application-item">
                  <div className="application-header">
                    <div>
                      <div className="applicant-name">{application.applicant?.name || application.applicant?.email}</div>
                      <div className="application-job">**{application.job?.title}**</div>
                      <div className="application-meta">
                        <span>📅 {new Date(application.appliedAt).toLocaleDateString('vi-VN')}</span>
                        <span>📧 {application.applicant?.email}</span>
                      </div>
                    </div>
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                      className={`status-select status-${application.status}`}
                    >
                      <option value="pending">Chờ xem xét</option>
                      <option value="reviewed">Đã xem xét</option>
                      <option value="shortlisted">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                  {/* Thêm link/button để xem chi tiết CV/Cover Letter */}
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
              <h3>Đăng tin tuyển dụng mới</h3>
              <button className="modal-close" onClick={() => setShowJobModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleJobSubmit}>
              <div className="modal-body">
                
                <div className="form-row">
                  <div className="form-group"><label>Chức danh công việc *</label><input type="text" name="title" value={jobForm.title} onChange={handleJobFormChange} required/></div>
                  <div className="form-group"><label>Tên công ty *</label><input type="text" name="company" value={jobForm.company} onChange={handleJobFormChange} required/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Địa điểm làm việc *</label><input type="text" name="location" value={jobForm.location} onChange={handleJobFormChange} required/></div>
                  <div className="form-group"><label>Mức lương *</label><input type="text" name="salary" value={jobForm.salary} onChange={handleJobFormChange} placeholder="VD: 25,000 - 30,000 VNĐ/giờ" required/></div>
                </div>
                <div className="form-group">
                  <label>Loại công việc</label>
                  <select name="type" value={jobForm.type} onChange={handleJobFormChange}>
                      <option value="full-time">Toàn thời gian</option>
                      <option value="part-time">Bán thời gian</option>
                      <option value="contract">Hợp đồng</option>
                      <option value="internship">Thực tập</option>
                  </select>
                </div>
                <div className="form-group"><label>Mô tả công việc *</label><textarea name="description" value={jobForm.description} onChange={handleJobFormChange} rows="5" required/></div>
                <div className="form-group"><label>Yêu cầu công việc</label><textarea name="requirements" value={jobForm.requirements} onChange={handleJobFormChange} rows="3"/></div>
                <div className="form-group"><label>Lợi ích</label><textarea name="benefits" value={jobForm.benefits} onChange={handleJobFormChange} rows="3"/></div>
                <div className="form-group"><label>Thông tin liên hệ</label><input type="text" name="contact" value={jobForm.contact} onChange={handleJobFormChange} /></div>
                <div className="form-group"><label>Hạn nộp hồ sơ</label><input type="date" name="deadline" value={jobForm.deadline} onChange={handleJobFormChange} /></div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowJobModal(false)}>Hủy</button>
                  <button type="submit" className="btn-primary">Đăng tin</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="container"><p>&copy; 2025 QTM3-K14. Tất cả quyền được bảo lưu.</p></div>
      </footer>
    </div>
  );
};

export default EmployerDashboard;