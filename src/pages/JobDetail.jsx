import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
// Import styles and service
import './JobDetail.css';
import apiService from '../services/api';

function JobDetail() {
    // 1. Hooks và State
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [similarJobs, setSimilarJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isJobSaved, setIsJobSaved] = useState(false);

    // 2. Hàm kiểm tra trạng thái lưu (Sử dụng API mới trong apiService)
    const checkSavedStatus = useCallback(async (jobId) => {
        if (!user) return;
        try {
            const response = await apiService.checkSavedJob(jobId);
            setIsJobSaved(response.isSaved || false);
        } catch (err) {
            console.warn("Error checking saved status, assuming not saved:", err);
            setIsJobSaved(false);
        }
    }, [user]);

    // 3. Hàm tải chi tiết công việc
    const loadJobDetail = useCallback(async () => {
        if (!id) {
            setError('Lỗi: Không tìm thấy ID công việc trong URL.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await apiService.getJob(id);
            // Sửa lỗi truy cập dữ liệu: Linh hoạt với các cấu trúc trả về
            const fetchedJob = response.job || response.data?.job || response;

            if (fetchedJob && fetchedJob._id) {
                setJob(fetchedJob);
                loadSimilarJobs(fetchedJob); 
                checkSavedStatus(fetchedJob._id);
            } else {
                setError('Công việc không tồn tại hoặc đã bị xóa.');
            }
        } catch (error) {
            console.error('Lỗi tải chi tiết công việc:', error);
            const errorMessage = apiService.formatErrorMessage?.(error) || 'Không thể tải thông tin công việc';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id, checkSavedStatus]);

    // 4. Hàm tải việc làm tương tự
    const loadSimilarJobs = async (currentJob) => {
        if (!currentJob || !currentJob.category) {
            setSimilarJobs([]);
            return;
        }

        try {
            const response = await apiService.getJobs({
                category: currentJob.category,
                limit: 4 // Lấy 4 kết quả để lọc lại còn 3
            });

            if (response.data?.jobs) {
                const filteredJobs = response.data.jobs
                    .filter(j => j._id !== currentJob._id)
                    .slice(0, 3);
                setSimilarJobs(filteredJobs);
            }
        } catch (error) {
            console.error('Lỗi tải việc làm tương tự:', error);
            setSimilarJobs([]);
        }
    };

    // 5. useEffect: Tải dữ liệu khi component mount hoặc ID thay đổi
    useEffect(() => {
        loadJobDetail();
        // Cuộn lên đầu trang khi component mount hoặc job ID thay đổi
        window.scrollTo(0, 0); 
    }, [loadJobDetail]);


    // 6. Xử lý logic nghiệp vụ
    const handleApply = async () => {
        if (!user) {
            alert('Vui lòng đăng nhập để ứng tuyển.');
            navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        if (!job || !job._id) return;

        try {
            await apiService.applyForJob({
                jobId: job._id,
                coverLetter: `Tôi quan tâm đến vị trí ${job.title} tại ${job.company?.name}. Tôi sẵn sàng gửi hồ sơ chi tiết.`
            });
            alert('✅ Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.');
        } catch (error) {
            const errorMessage = apiService.formatErrorMessage?.(error) || 'Ứng tuyển thất bại. Vui lòng thử lại.';
            console.error('Application error:', error);
            alert(`❌ Ứng tuyển thất bại: ${errorMessage}`);
        }
    };

    const handleSaveJob = async () => {
        if (!user) {
            alert('Vui lòng đăng nhập để lưu việc làm.');
            navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }

        if (!job || !job._id) return;

        try {
            if (isJobSaved) {
                await apiService.removeSavedJob(job._id);
                setIsJobSaved(false);
                alert('🗑️ Đã hủy lưu việc làm.');
            } else {
                await apiService.saveJob(job._id);
                setIsJobSaved(true);
                alert('❤️ Đã lưu việc làm thành công!');
            }
        } catch (error) {
            const action = isJobSaved ? 'hủy lưu' : 'lưu';
            const errorMessage = apiService.formatErrorMessage?.(error) || `Thao tác ${action} thất bại.`;
            console.error('Save job error:', error);
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleShare = () => {
        const jobUrl = window.location.href;
        navigator.clipboard.writeText(jobUrl).then(() => {
            alert('Đã copy link chia sẻ vào clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = jobUrl;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Đã copy link chia sẻ!');
        });
    };

    // 7. Render Loading/Error State
    if (loading) {
        return (
            <div className="job-detail-page">
                <Header />
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải thông tin công việc...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="job-detail-page">
                <Header />
                <div className="error-state">
                    <div className="error-icon">❌</div>
                    <h3>{error || 'Công việc không tìm thấy'}</h3>
                    <p>Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang tìm kiếm.</p>
                    <Link to="/jobs" className="btn-primary">Quay lại danh sách việc làm</Link>
                </div>
                <Footer />
            </div>
        );
    }

    // 8. Render Job Detail
    return (
        <div className="job-detail-page">
            <Header />

            <section className="job-detail">
                <div className="container">
                    <div className="job-detail-content">
                        {/* Main Content */}
                        <div className="job-main">
                            <div className="breadcrumb">
                                <Link to="/">Trang chủ</Link> &gt;
                                <Link to="/jobs">Tìm việc</Link> &gt;
                                <span>{job.title}</span>
                            </div>

                            <div className="job-header-detail">
                                <div className="job-title-section">
                                    <h1>{job.title}</h1>
                                    <div className="job-company-detail">{job.company?.name || 'Công ty không rõ'}</div>
                                    <div className="job-meta-detail">
                                        <span className="job-location">📍 {job.location}</span>
                                        <span className="job-salary">💰 {job.salary}</span>
                                        <span className="job-type">🕒 {job.jobType}</span>
                                        <span className="job-posted">
                                            📅 {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="job-actions-detail">
                                        {/* Chỉ hiển thị nút Ứng tuyển nếu người dùng là student */}
                                        {user?.userType === 'student' && (
                                            <button className="btn-apply-main" onClick={handleApply}>
                                                Ứng tuyển ngay
                                            </button>
                                        )}
                                        <button
                                            className={`btn-save-job ${isJobSaved ? 'saved' : ''}`}
                                            onClick={handleSaveJob}
                                        >
                                            {isJobSaved ? '❤️ Đã lưu' : '💚 Lưu việc làm'}
                                        </button>
                                        <button className="btn-share-job" onClick={handleShare}>
                                            📤 Chia sẻ
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="job-content">
                                <div className="content-section">
                                    <h3>📝 Mô tả công việc</h3>
                                    {/* Sử dụng div để hiển thị nội dung, giả định là văn bản thuần hoặc đã được format */}
                                    <div className="content-text" dangerouslySetInnerHTML={{ __html: job.description || 'Chưa có mô tả chi tiết.' }} />
                                </div>

                                {job.requirements && (
                                    <div className="content-section">
                                        <h3>✅ Yêu cầu công việc</h3>
                                        <div className="content-text" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                                    </div>
                                )}

                                {job.benefits && (
                                    <div className="content-section">
                                        <h3>🎁 Quyền lợi</h3>
                                        <div className="content-text" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                                    </div>
                                )}

                                <div className="content-section">
                                    <h3>🏢 Về công ty</h3>
                                    <div className="company-info">
                                        <div className="company-name">{job.company?.name || 'Công ty không rõ'}</div>
                                        <div className="company-contact">
                                            📧 {job.contactEmail || job.company?.email || 'Đang cập nhật'}
                                            {job.contactPhone && ` • 📞 ${job.contactPhone}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="job-sidebar">
                            <div className="sidebar-widget company-widget">
                                <h3>Thông tin tuyển dụng</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <strong>📍 Địa điểm:</strong>
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="info-item">
                                        <strong>💰 Mức lương:</strong>
                                        <span>{job.salary}</span>
                                    </div>
                                    <div className="info-item">
                                        <strong>🕒 Loại hình:</strong>
                                        <span>{job.jobType}</span>
                                    </div>
                                    <div className="info-item">
                                        <strong>📅 Đã đăng:</strong>
                                        <span>{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="info-item">
                                        <strong>⏳ Hạn nộp:</strong>
                                        <span>
                                            {job.applicationDeadline
                                                ? new Date(job.applicationDeadline).toLocaleDateString('vi-VN')
                                                : 'Không xác định'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-widget">
                                <h3>Việc làm tương tự</h3>
                                <div className="similar-jobs">
                                    {similarJobs.length > 0 ? (
                                        similarJobs.map(similarJob => (
                                            <JobCard key={similarJob._id} job={similarJob} compact={true} />
                                        ))
                                    ) : (
                                        <p className="no-similar-jobs">Không có việc làm tương tự</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="sidebar-widget safety-widget">
                                <h3>⚠️ Lưu ý an toàn</h3>
                                <div className="safety-tips">
                                    <p>• Không ứng trước tiền</p>
                                    <p>• Gặp mặt tại nơi công cộng</p>
                                    <p>• Xác minh thông tin công ty</p>
                                    <p>• Báo cáo việc làm đáng ngờ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default JobDetail;