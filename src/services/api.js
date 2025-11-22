const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.currentUser = localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser')) 
      : null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  removeToken() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Tùy chọn: Xóa các item khác nếu cần
  }

  /**
   * Hàm request trung tâm xử lý mọi gọi API
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    // Cấu hình headers mặc định
    const headers = {
      ...options.headers,
    };

    // Tự động thêm Authorization header nếu có token
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Xử lý Body và Content-Type
    let body = options.body;

    // Kiểm tra nếu body là FormData (để upload file)
    if (body instanceof FormData) {
      // KHÔNG set Content-Type, để trình duyệt tự set multipart/form-data kèm boundary
    } else if (body && typeof body === 'object') {
      // Nếu là object thường, chuyển thành JSON và set header
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }

    const config = {
      ...options,
      headers,
      body,
    };

    try {
      const response = await fetch(url, config);

      // Xử lý trường hợp Token hết hạn hoặc không hợp lệ (401)
      if (response.status === 401) {
        this.removeToken();
        // Tùy chọn: Redirect về trang login
        if (window.location.pathname !== '/login') {
             window.location.href = '/login';
        }
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }

      // Xử lý response body
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Trích xuất thông báo lỗi từ server (thường là field 'message' hoặc 'error')
        const errorMessage = data?.message || data?.error || `Lỗi HTTP! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error(`API request failed [${endpoint}]:`, error);
      throw error;
    }
  }

  // ========== AUTH METHODS ==========
  async register(userData) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });

    if (result.token) { // Giả sử backend trả về trực tiếp { token, user }
      this.setToken(result.token);
      this.setCurrentUser(result.user);
    } else if (result.data && result.data.token) { // Hoặc cấu trúc { data: { token, user } }
      this.setToken(result.data.token);
      this.setCurrentUser(result.data.user);
    }

    return result;
  }

  async login(credentials) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    // Xử lý linh hoạt cấu trúc trả về của Backend
    const token = result.token || result.data?.token;
    const user = result.user || result.data?.user;

    if (token) {
      this.setToken(token);
      this.setCurrentUser(user);
    }

    return result;
  }

  async logout() {
    // Nếu backend có endpoint logout để hủy token
    try {
        if (this.token) {
            await this.request('/auth/logout', { method: 'POST' });
        }
    } catch (error) {
        console.warn('Logout server failed, cleaning local only');
    } finally {
        this.removeToken();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: passwordData,
    });
  }

  // ========== JOB METHODS ==========
  async getJobs(params = {}) {
    // Lọc bỏ các params null/undefined/rỗng
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/jobs?${queryString}`);
  }

  async getJob(id) {
    return this.request(`/jobs/${id}`);
  }

  async getFeaturedJobs() {
    return this.request('/jobs/featured');
  }

  async getEmployerJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs/employer/my-jobs?${queryString}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: jobData,
    });
  }

  async updateJob(id, jobData) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: jobData,
    });
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== APPLICATION METHODS ==========
  async applyForJob(applicationData) {
    // applicationData thường bao gồm jobId, coverLetter, v.v.
    return this.request('/applications', {
      method: 'POST',
      body: applicationData,
    });
  }

  async getMyApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/applications/student/my-applications?${queryString}`);
  }

  async getEmployerApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/applications/employer/job-applications?${queryString}`);
  }

  async updateApplicationStatus(applicationId, statusData) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: statusData, // VD: { status: 'accepted' }
    });
  }

  async getApplicationStatistics() {
    return this.request('/applications/employer/statistics');
  }

  async withdrawApplication(applicationId) {
    return this.request(`/applications/${applicationId}`, {
      method: 'DELETE',
    });
  }

  // ========== USER METHODS (File Uploads) ==========
  async getUserProfile(userId = null) {
    const endpoint = userId ? `/users/profile/${userId}` : '/users/profile';
    return this.request(endpoint);
  }

  async uploadAvatar(formData) {
    // Đã sửa: Sử dụng this.request để tận dụng xử lý Token và Error
    // FormData sẽ được xử lý tự động trong hàm request
    return this.request('/users/upload-avatar', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadResume(formData) {
    return this.request('/users/upload-resume', {
      method: 'POST',
      body: formData,
    });
  }

  async getSavedJobs() {
    return this.request('/users/saved-jobs');
  }

  async saveJob(jobId) {
    return this.request(`/users/saved-jobs/${jobId}`, {
      method: 'POST',
    });
  }

  async removeSavedJob(jobId) {
    return this.request(`/users/saved-jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getRecommendedJobs() {
    return this.request('/users/recommended-jobs');
  }

  // ========== COMPANY METHODS ==========
  async getCompanyProfile(companyId) {
    return this.request(`/companies/${companyId}`);
  }

  async updateCompanyProfile(companyId, companyData) {
    // Hỗ trợ cả JSON và FormData (nếu update logo công ty)
    return this.request(`/companies/${companyId}`, {
      method: 'PUT',
      body: companyData,
    });
  }

  // ========== UTILITY METHODS ==========
  async healthCheck() {
    return this.request('/health');
  }

  // Helper: Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Helper: Check user roles
  isEmployer() {
    return this.currentUser?.userType === 'employer' || this.currentUser?.role === 'employer';
  }

  isStudent() {
    return this.currentUser?.userType === 'student' || this.currentUser?.role === 'student';
  }

  isAdmin() {
    return this.currentUser?.userType === 'admin' || this.currentUser?.role === 'admin';
  }

  // Get current user data safely
  getCurrentUserData() {
    return this.currentUser;
  }
    // ========== EXTRA METHODS YOU REQUESTED ==========

  async getEmployerJobs() {
    return this.request('/jobs/employer/my-jobs');
  }

  async getEmployerApplications() {
    return this.request('/applications/employer/job-applications');
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: jobData,
    });
  }

  async updateApplicationStatus(applicationId, statusData) {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: statusData,
    });
  }

}

// Create singleton instance
const apiService = new ApiService();
export default apiService;