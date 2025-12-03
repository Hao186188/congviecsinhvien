import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
// Thêm import helper để định dạng thời gian
import { formatTimeAgo } from '../utils/date'; 

function JobCard({ job, compact = false, showActions = true, isSaved = false }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Thêm state cho trạng thái loading và trạng thái lưu
    const [isSaving, setIsSaving] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isJobSaved, setIsJobSaved] = useState(isSaved);

    // Xử lý chuyển hướng đến trang chi tiết
    const handleJobClick = useCallback(() => {
        // Bổ sung kiểm tra an toàn: Đảm bảo job._id tồn tại
        if (!job || !job._id) {
            console.error("Job ID is missing for navigation.");
            alert("Không thể chuyển hướng: ID công việc bị thiếu.");
            return;
        }
        navigate(`/jobs/${job._id}`);
    }, [navigate, job]); // Thêm job vào dependency array thay vì chỉ job._id

    // Xử lý ứng tuyển nhanh
    const handleQuickApply = async (e) => {
        e.stopPropagation();
        
        if (!user) {
            alert('Vui lòng đăng nhập để ứng tuyển.');
            navigate('/login?redirect=' + window.location.pathname);
            return;
        }

        if (isApplying || !job || !job._id) return;
        setIsApplying(true);

        try {
            await apiService.applyForJob({
                jobId: job._id,
                // Đảm bảo coverLetter hợp lệ (dài hơn)
                coverLetter: `Tôi quan tâm đến vị trí ${job.title} tại ${job.company?.name}. Tôi sẵn sàng gửi hồ sơ chi tiết sau.`
            });
            alert('✅ Ứng tuyển thành công! Nhà tuyển dụng sẽ xem xét hồ sơ của bạn.');
        } catch (error) {
            // Đảm bảo apiService.formatErrorMessage tồn tại
            const errorMessage = apiService.formatErrorMessage ? apiService.formatErrorMessage(error) : 'Ứng tuyển thất bại. Vui lòng thử lại sau.';
            console.error('Quick apply error:', error);
            alert(`❌ Ứng tuyển thất bại: ${errorMessage}`);
        } finally {
            setIsApplying(false);
        }
    };

    // Xử lý lưu/bỏ lưu việc làm
    const handleSaveJob = async (e) => {
        e.stopPropagation();
        
        if (!user) {
            alert('Vui lòng đăng nhập để lưu việc làm.');
            navigate('/login?redirect=' + window.location.pathname);
            return;
        }

        if (isSaving || !job || !job._id) return;
        setIsSaving(true);

        try {
            if (isJobSaved) {
                // Giả định apiService.removeSavedJob(jobId) tồn tại
                await apiService.removeSavedJob(job._id);
                setIsJobSaved(false);
                alert('🗑️ Đã hủy lưu việc làm.');
            } else {
                // Giả định apiService.saveJob(jobId) tồn tại
                await apiService.saveJob(job._id);
                setIsJobSaved(true);
                alert('❤️ Đã lưu việc làm thành công!');
            }
        } catch (error) {
             const action = isJobSaved ? 'hủy lưu' : 'lưu';
             const errorMessage = apiService.formatErrorMessage ? apiService.formatErrorMessage(error) : `Thao tác ${action} thất bại.`;
            console.error('Save job error:', error);
            alert(`❌ ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Chuẩn bị các giá trị dự phòng
    const postedTime = job?.createdAt ? formatTimeAgo(job.createdAt) : 'Mới đăng';
    const postDateFull = job?.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'Không rõ ngày';
    const jobDescription = job?.description || 'Không có mô tả chi tiết.';
    
    // Kiểm tra cơ bản nếu đối tượng job không tồn tại hoặc không có ID
    if (!job || !job._id) return null;


    if (compact) {
        // ... (JSX cho compact mode, giữ nguyên)
        return (
            <div className="job-card-compact" onClick={handleJobClick}>
                <div className="job-card-header">
                    <div className="job-title">{job.title || 'Không có tiêu đề'}</div>
                    {job.isFeatured && <div className="job-badge">Nổi bật</div>}
                </div>
                <div className="job-company">{job.company?.name || 'Công ty ẩn danh'}</div>
                <div className="job-meta">
                    <span>💰 {job.salary || 'Thỏa thuận'}</span>
                    <span>📍 {job.location || 'Kiên Giang'}</span>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="job-card" 
            onClick={handleJobClick}
            style={{ cursor: 'pointer' }}
        >
             {/* ... (JSX cho chế độ mặc định, giữ nguyên) ... */}
            <div className="job-card-header">
                <div>
                    <div className="job-title">**{job.title || 'Không có tiêu đề'}**</div>
                    <div className="job-company">{job.company?.name || 'Công ty ẩn danh'}</div>
                </div>
                {job.isFeatured && <div className="job-badge">Nổi bật</div>}
            </div>
            
            <div className="job-meta">
                <div className="job-meta-item">📍 {job.location || 'Kiên Giang'}</div>
                <div className="job-meta-item">💰 {job.salary || 'Thỏa thuận'}</div>
                <div className="job-meta-item">🕒 {job.jobType || 'Bán thời gian'}</div>
                <div className="job-meta-item">
                    ⏰ {postedTime}
                </div>
            </div>
            
            <div className="job-description">
                {jobDescription.length > 100 
                    ? `${jobDescription.substring(0, 100)}...` 
                    : jobDescription
                }
            </div>
            
            <div className="job-tags">
                <span className="job-tag">{job.category || 'Chưa phân loại'}</span>
                {job.skills && job.skills.slice(0, 2).map((skill, index) => (
                    <span key={index} className="job-tag">{skill}</span>
                ))}
            </div>
            
            {showActions && (
                <div className="job-card-footer">
                    <div className="job-posted">
                        Đăng ngày {postDateFull}
                    </div>
                    <div className="job-actions">
                        <button 
                            className={`btn-save ${isJobSaved ? 'saved' : ''}`} 
                            onClick={handleSaveJob}
                            disabled={isSaving}
                        >
                            {isSaving ? '...' : isJobSaved ? '❤️ Đã lưu' : '💚 Lưu'}
                        </button>
                        <button 
                            className="btn-apply" 
                            onClick={handleQuickApply}
                            disabled={isApplying}
                        >
                            {isApplying ? 'Đang ứng tuyển...' : 'Ứng tuyển'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JobCard;