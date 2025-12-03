import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { JOB_CATEGORIES, getAllLocationsFlat } from '../data/kienGiang';
import { getAllSampleJobs } from '../data/sampleJobs'; // Đảm bảo import đúng
import "./JobListing.css";

function JobListing() {
  const API_URL = "https://parttime-job-backend.onrender.com/api/jobs";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [salary, setSalary] = useState(Number(searchParams.get("salary") || 0));
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [useMockData, setUseMockData] = useState(false);

  // Lấy dữ liệu tĩnh
  const allLocations = getAllLocationsFlat();
  const allCategories = JOB_CATEGORIES;

  // Hàm lấy dữ liệu mẫu
  const loadMockJobs = useCallback(() => {
    try {
      const allSampleJobs = getAllSampleJobs();
      console.log("Loading mock jobs:", allSampleJobs.length, "jobs found");
      console.log("First mock job:", allSampleJobs[0]); // Xem job đầu tiên
      
      if (allSampleJobs.length > 0) {
        setJobs(allSampleJobs);
        setFilteredJobs(allSampleJobs);
        setUseMockData(true);
      } else {
        console.error("No mock jobs found!");
        setError("Không có dữ liệu công việc");
      }
    } catch (error) {
      console.error("Error loading mock jobs:", error);
      setError("Lỗi khi tải dữ liệu mẫu");
    }
  }, []);

  // Hàm trích xuất số từ chuỗi lương
  const extractSalary = useCallback((salaryString) => {
    if (!salaryString) return 0;
    const normalized = salaryString.toLowerCase().replace(/[vnđ/giờ\s.]/g, '');
    const matches = normalized.match(/(\d+,\d+|\d+)/g); 
    if (matches && matches.length > 0) {
      return parseInt(matches[0].replace(/,/g, ''), 10);
    }
    return 0;
  }, []);

  // Gọi API lấy danh sách việc làm
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log("Fetching jobs from API...");
        const res = await fetch(API_URL, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log("API Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API Response data:", data);
        
        if (data.data && data.data.jobs && data.data.jobs.length > 0) {
          console.log(`Loaded ${data.data.jobs.length} jobs from API`);
          setJobs(data.data.jobs);
        } else {
          console.log("API returned empty data, using mock data");
          loadMockJobs();
        }
      } catch (err) {
        console.error("Lỗi khi tải việc làm từ API:", err.message);
        console.log("Falling back to mock data");
        loadMockJobs();
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [loadMockJobs]);

  // LOGIC LỌC & SẮP XẾP (Client-side)
  useEffect(() => {
    console.log("Filtering jobs... Current jobs:", jobs.length);
    
    let result = [...jobs];

    // Lọc theo Tìm kiếm chung
    if (searchTerm) {
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo Địa điểm
    if (location) {
      result = result.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Lọc theo Loại hình công việc
    if (jobType) {
      result = result.filter((job) => job.jobType === jobType);
    }

    // Lọc theo Mức lương tối thiểu
    if (salary > 0) {
      result = result.filter((job) => {
        const jobSalary = extractSalary(job.salary);
        return jobSalary >= salary;
      });
    }

    // Lọc theo Danh mục
    if (selectedCategories.length > 0) {
      result = result.filter((job) =>
        selectedCategories.includes(job.category)
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        break;
      case "salary_high":
        result.sort((a, b) => extractSalary(b.salary) - extractSalary(a.salary));
        break;
      case "salary_low":
        result.sort((a, b) => extractSalary(a.salary) - extractSalary(b.salary));
        break;
      default: // newest
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
    }

    console.log("Filtered results:", result.length);
    setFilteredJobs(result);
  }, [searchTerm, location, jobType, salary, sortBy, selectedCategories, jobs, extractSalary]);
  
  // Xử lý thay đổi Checkbox Category
  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories(prev =>
      prev.includes(categoryValue)
        ? prev.filter(c => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Component tạm để test
  const TestJobCard = ({ job }) => {
    if (!job) return null;
    
    return (
      <div className="job-card-test" style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>{job.title || 'Không có tiêu đề'}</h3>
        <p style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Công ty:</strong> {job.company?.name || 'Chưa có thông tin'}
        </p>
        <p style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Địa điểm:</strong> {job.location || 'Chưa có địa điểm'}
        </p>
        <p style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Lương:</strong> {job.salary || 'Thỏa thuận'}
        </p>
        <p style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Loại:</strong> {job.jobType || 'Bán thời gian'}
        </p>
        <p style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Danh mục:</strong> {job.category || 'Khác'}
        </p>
        <button 
          onClick={() => navigate(`/jobs/${job._id}`)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Xem chi tiết
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="job-listing-page">
        <Header />
        <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p>Đang tải danh sách việc làm...</p>
          <p>Nếu đang chờ quá lâu, vui lòng refresh trang</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="job-listing-page">
      <Header />
      
      {/* Job Search Section */}
      <section className="job-search-section">
        <div className="container">
          <div className="search-filters">
            <h1>
              Tìm {filteredJobs.length > 0 ? filteredJobs.length : '0'} Việc Làm Bán Thời Gian
              {useMockData && <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}></span>}
            </h1>

            <form className="filter-row" onSubmit={handleSearch}>
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Tìm kiếm việc làm, công ty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Tất cả địa điểm</option>
                  {allLocations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">Tất cả loại hình</option>
                  <option value="Bán thời gian">Bán thời gian</option>
                  <option value="Toàn thời gian">Toàn thời gian</option>
                  <option value="Thực tập">Thực tập</option>
                </select>
              </div>
              <button type="submit" className="btn-search">
                Tìm kiếm
              </button>
            </form>

            <div className="advanced-filters">
              <div className="filter-group">
                <label>Mức lương tối thiểu (VNĐ):</label>
                <select
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                >
                  <option value="0">Tất cả mức lương</option>
                  <option value="15000">15,000 / giờ</option>
                  <option value="20000">20,000 / giờ</option>
                  <option value="25000">25,000 / giờ</option>
                  <option value="30000">30,000 / giờ</option>
                  <option value="5000000">5,000,000 / tháng</option>
                </select>
              </div>
              
              <button 
                className="btn-reset" 
                onClick={() => {
                  setSearchTerm('');
                  setLocation('');
                  setJobType('');
                  setSalary(0);
                  setSelectedCategories([]);
                  setSortBy('newest');
                  navigate('/jobs');
                }}
              >
                Xóa Bộ Lọc
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Results */}
      <section className="job-results">
        <div className="container">
          <div className="results-header">
            <h2>Kết quả: {filteredJobs.length} công việc</h2>
            <div className="sort-options">
              <label>Sắp xếp:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="salary_high">Lương cao nhất</option>
                <option value="salary_low">Lương thấp nhất</option>
              </select>
            </div>
          </div>

          <div className="jobs-container">
            {/* Sidebar */}
            <div className="jobs-sidebar">
              <div className="sidebar-widget">
                <h3>Lọc theo danh mục</h3>
                <div className="category-filters">
                  {allCategories.map((category) => {
                    const count = jobs.filter(job => job.category === category.value).length;
                    return (
                      <label className="category-filter" key={category.value}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.value)}
                          onChange={() => handleCategoryChange(category.value)}
                        />
                        {category.icon} {category.title} ({count})
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="sidebar-widget">
                <h3>Việc làm nổi bật</h3>
                <div className="featured-jobs-sidebar">
                  {jobs
                    .filter(job => job.isFeatured)
                    .slice(0, 3)
                    .map((job) => (
                      <div 
                        className="featured-job" 
                        key={job._id}
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h4>{job.title}</h4>
                        <p>{job.company?.name}</p>
                        <span className="featured-salary">{job.salary}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Job List */}
            <div className="jobs-list">
              {error && (
                <div className="error-message" style={{
                  padding: '20px',
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}
              
              {filteredJobs.length > 0 ? (
                <>
                  <div style={{ marginBottom: '20px', color: '#666' }}>
                    Hiển thị {filteredJobs.length} công việc
                    {useMockData && ' (dữ liệu mẫu)'}
                  </div>
                  
                  {/* Sử dụng TestJobCard thay vì JobCard để test */}
                  {filteredJobs.map((job) => (
                    <TestJobCard key={job._id} job={job} />
                  ))}
                </>
              ) : (
                <div className="no-results" style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="no-results-icon" style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                  <h3>Không tìm thấy công việc nào phù hợp</h3>
                  <p>Hãy thử điều chỉnh bộ lọc tìm kiếm của bạn</p>
                  <p>Tổng số công việc trong hệ thống: {jobs.length}</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setLocation('');
                      setJobType('');
                      setSalary(0);
                      setSelectedCategories([]);
                    }}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '20px'
                    }}
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default JobListing;