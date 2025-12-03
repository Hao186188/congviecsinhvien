// src/services/jobService.js
import { getAllSampleJobs, getFeaturedJobs, searchJobs } from '../data/sampleJobs';

export const jobService = {
  // Lấy tất cả công việc
  getAllJobs: async () => {
    return {
      success: true,
      data: {
        jobs: getAllSampleJobs()
      }
    };
  },

  // Lấy công việc nổi bật
  getFeaturedJobs: async () => {
    return {
      success: true,
      data: {
        jobs: getFeaturedJobs(8)
      }
    };
  },

  // Tìm kiếm công việc
  searchJobs: async (filters) => {
    const { keyword, location, category } = filters;
    const results = searchJobs(keyword, location, category);
    return {
      success: true,
      data: {
        jobs: results
      }
    };
  },

  // Lấy công việc theo ID
  getJobById: async (jobId) => {
    const allJobs = getAllSampleJobs();
    const job = allJobs.find(job => job._id === jobId);
    return {
      success: !!job,
      data: {
        job: job || null
      }
    };
  }
};