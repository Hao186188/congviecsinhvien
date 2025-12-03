// Đường dẫn cần tạo: /frontend/src/utils/date.js

export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Không rõ';
    
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} năm trước`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} tháng trước`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} ngày trước`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} giờ trước`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} phút trước`;
    
    return 'Vừa xong';
};