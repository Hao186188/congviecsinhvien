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
      console.log(`🔄 API Call: ${config.method || 'GET'} ${url}`);
      if (body && !(body instanceof FormData)) {
        console.log('📦 Request Data:', body);
      }

      const response = await fetch(url, config);

      // Xử lý trường hợp Token hết hạn hoặc không hợp lệ (401)
      if (response.status === 401) {
        this.removeToken();
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

      console.log(`📨 Response [${response.status}]:`, data);

      if (!response.ok) {
        // Trích xuất thông báo lỗi từ server
        const errorMessage = data?.message || data?.error || `HTTP Error ${response.status}`;
        
        // Tạo error object với thông tin chi tiết
        const error = new Error(errorMessage);
        error.response = { data, status: response.status };
        error.status = response.status;
        
        // Thêm validation errors nếu có
        if (data.errors) {
          error.validationErrors = data.errors;
        }
        
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`❌ API request failed [${endpoint}]:`, error);
      throw error;
    }
  }

  // ========== AUTH METHODS ==========
  async register(userData) {
    try {
      const result = await this.request('/auth/register', {
        method: 'POST',
        body: userData,
      });

      // Xử lý linh hoạt cấu trúc trả về
      const token = result.token || result.data?.token;
      const user = result.user || result.data?.user;

      if (token && user) {
        this.setToken(token);
        this.setCurrentUser(user);
        return { success: true, data: { user, token } };
      }

      return { success: false, message: result.message || 'Đăng ký thất bại' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Đăng ký thất bại' 
      };
    }
  }

  async login(credentials) {
    try {
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      // Xử lý linh hoạt cấu trúc trả về
      const token = result.token || result.data?.token;
      const user = result.user || result.data?.user;

      if (token && user) {
        this.setToken(token);
        this.setCurrentUser(user);
        return { success: true, data: { user, token } };
      }

      return { success: false, message: result.message || 'Đăng nhập thất bại' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Đăng nhập thất bại' 
      };
    }
  }

  async logout() {
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
    try {
      const result = await this.request('/auth/me');
      if (result.success) {
        this.setCurrentUser(result.data.user);
      }
      return result;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
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
    console.log('🟡 [API] Creating job with data:', jobData);
    try {
      const result = await this.request('/jobs', {
        method: 'POST',
        body: jobData,
      });
      console.log('🟢 [API] Job creation response:', result);
      return result;
    } catch (error) {
      console.error('❌ [API] Job creation failed:', error);
      throw error;
    }
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
    return this.request('/applications', {
      method: 'POST',
      body: applicationData,
    });
  }

  async getStudentApplications(params = {}) {
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
      body: statusData,
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

  // ========== USER METHODS ==========
  async getUserProfile(userId = null) {
    const endpoint = userId ? `/users/profile/${userId}` : '/users/profile';
    return this.request(endpoint);
  }

  async uploadAvatar(formData) {
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
    return !!this.token && !!this.currentUser;
  }

  // Helper: Check user roles
  isEmployer() {
    return this.currentUser?.userType === 'employer';
  }

  isStudent() {
    return this.currentUser?.userType === 'student';
  }

  isAdmin() {
    return this.currentUser?.userType === 'admin';
  }

  // Get current user data safely
  getCurrentUserData() {
    return this.currentUser;
  }

  // Helper: Format error message for display
  formatErrorMessage(error) {
    if (error.validationErrors) {
      // Format validation errors
      return Object.values(error.validationErrors)
        .map(err => err.message || err)
        .join('\n');
    }
    return error.message || 'Có lỗi xảy ra';
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;