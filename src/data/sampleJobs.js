// src/data/sampleJobs.js
export const SAMPLE_JOBS = {
  // DANH MỤC: PHỤC VỤ NHÀ HÀNG/QUÁN ĂN
  "phuc-vu-nha-hang": [
    {
      _id: "pv_nh_001",
      title: "Nhân viên phục vụ bàn - Nhà hàng Hải Sản Biển Đông",
      company: {
        _id: "comp_001",
        name: "Nhà hàng Hải Sản Biển Đông",
        logo: "/logos/seafood.png",
        description: "Nhà hàng hải sản tươi sống nổi tiếng tại Rạch Giá"
      },
      location: "Rạch Giá",
      address: "123 Đường Nguyễn Trung Trực, TP. Rạch Giá",
      category: "phuc-vu-nha-hang",
      jobType: "Bán thời gian",
      salary: "25,000 VNĐ/giờ",
      description: "Tìm kiếm nhân viên phục vụ năng động, nhiệt tình cho nhà hàng hải sản. Công việc bao gồm tiếp đón khách, ghi order, phục vụ thức ăn và dọn dẹp bàn.",
      requirements: [
        "Ưu tiên học sinh, sinh viên",
        "Thái độ thân thiện, niềm nở",
        "Có khả năng giao tiếp tốt",
        "Làm việc theo ca linh hoạt"
      ],
      benefits: [
        "Lương thưởng theo giờ",
        "Được đào tạo nghiệp vụ",
        "Tip từ khách hàng",
        "Cơ hội thăng tiến"
      ],
      schedule: "Ca sáng: 9h-14h, Ca chiều: 17h-22h",
      quantity: 3,
      experience: "Không yêu cầu kinh nghiệm",
      education: "Tốt nghiệp THPT trở lên",
      deadline: "2024-12-31",
      isFeatured: true,
      isUrgent: false,
      views: 245,
      applications: 12,
      createdAt: "2024-11-15T08:30:00Z",
      updatedAt: "2024-11-20T14:20:00Z"
    },
    {
      _id: "pv_nh_002",
      title: "Phục vụ quán cafe - The Coffee House Rạch Giá",
      company: {
        _id: "comp_002",
        name: "The Coffee House",
        logo: "/logos/coffee-house.png",
        description: "Chuỗi cafe phong cách hiện đại"
      },
      location: "Rạch Giá",
      address: "456 Đường Lê Lợi, Phường Vĩnh Thanh",
      category: "phuc-vu-nha-hang",
      jobType: "Bán thời gian",
      salary: "22,000 - 28,000 VNĐ/giờ",
      description: "Cần tuyển nhân viên phục vụ cho quán cafe tại Rạch Giá. Công việc: pha chế cơ bản, phục vụ khách, vệ sinh quán.",
      requirements: [
        "Tuổi từ 18-25",
        "Ngoại hình ưa nhìn",
        "Có tinh thần trách nhiệm",
        "Yêu thích môi trường cafe"
      ],
      benefits: [
        "Lương cứng + thưởng",
        "Được học pha chế",
        "Môi trường trẻ trung",
        "Đồng phục được cấp"
      ],
      schedule: "Linh hoạt 4-6h/ngày",
      quantity: 5,
      experience: "Ưu tiên có kinh nghiệm",
      education: "Tốt nghiệp THPT",
      deadline: "2024-12-25",
      isFeatured: true,
      isUrgent: true,
      views: 312,
      applications: 25,
      createdAt: "2024-11-10T10:15:00Z",
      updatedAt: "2024-11-18T09:45:00Z"
    },
    // Thêm 13 công việc khác cho danh mục này...
    {
      _id: "pv_nh_015",
      title: "Nhân viên phục vụ tiệc cưới - Trung tâm Hội nghị Sông Hậu",
      company: {
        _id: "comp_015",
        name: "Trung tâm Hội nghị Sông Hậu",
        logo: "/logos/songhau.png"
      },
      location: "Rạch Giá",
      address: "789 Đường 3/2, TP. Rạch Giá",
      category: "phuc-vu-nha-hang",
      jobType: "Theo ca",
      salary: "200,000 - 300,000 VNĐ/ca",
      description: "Phục vụ các sự kiện, tiệc cưới vào cuối tuần và tối.",
      requirements: ["Làm việc cuối tuần", "Có sức khỏe tốt"],
      benefits: ["Lương cao", "Thưởng sự kiện"],
      schedule: "Thứ 7, Chủ nhật và tối trong tuần",
      quantity: 10,
      isFeatured: false,
      isUrgent: false,
      views: 89,
      applications: 7
    }
  ],

  // DANH MỤC: BÁN HÀNG
  "ban-hang": [
    {
      _id: "bh_001",
      title: "Nhân viên bán hàng thời trang - Shop Zara Fake Rạch Giá",
      company: {
        _id: "comp_101",
        name: "Shop Thời trang TGDD",
        logo: "/logos/fashion.png"
      },
      location: "Rạch Giá",
      address: "Tầng 2, Vincom Rạch Giá",
      category: "ban-hang",
      jobType: "Bán thời gian",
      salary: "5,000,000 - 7,000,000 VNĐ/tháng",
      description: "Bán hàng thời trang, tư vấn khách hàng, sắp xếp sản phẩm.",
      requirements: [
        "Kỹ năng giao tiếp tốt",
        "Ngoại hình ưa nhìn",
        "Hiểu biết về thời trang"
      ],
      benefits: [
        "Hoa hồng cao",
        "Chiết khấu sản phẩm",
        "Đào tạo kỹ năng bán hàng"
      ],
      schedule: "Ca sáng/chiều",
      quantity: 4,
      isFeatured: true,
      isUrgent: true,
      views: 421,
      applications: 38
    },
    {
      _id: "bh_002",
      title: "Nhân viên bán điện thoại - Thế Giới Di Động Kiên Lương",
      company: {
        _id: "comp_102",
        name: "Thế Giới Di Động",
        logo: "/logos/tgdd.png"
      },
      location: "Kiên Lương",
      address: "TTTM Kiên Lương",
      category: "ban-hang",
      jobType: "Toàn thời gian",
      salary: "6,500,000 - 9,000,000 VNĐ/tháng",
      description: "Tư vấn bán điện thoại, phụ kiện công nghệ.",
      requirements: [
        "Am hiểu công nghệ",
        "Có kinh nghiệm bán hàng",
        "Kỹ năng thuyết phục"
      ],
      benefits: [
        "Lương thưởng cao",
        "Bảo hiểm đầy đủ",
        "Thưởng doanh số"
      ],
      schedule: "8h-17h hàng ngày",
      quantity: 3,
      isFeatured: true,
      isUrgent: false,
      views: 289,
      applications: 21
    },
    // Thêm 18 công việc khác cho danh mục này...
  ],

  // DANH MỤC: GIA SƯ
  "gia-su": [
    {
      _id: "gs_001",
      title: "Gia sư Toán lớp 10 - Học sinh trường THPT Nguyễn Trung Trực",
      company: {
        _id: "comp_201",
        name: "Gia sư Thông Minh",
        logo: "/logos/tutor.png"
      },
      location: "Rạch Giá",
      address: "Phường Vĩnh Bảo, TP. Rạch Giá",
      category: "gia-su",
      jobType: "Bán thời gian",
      salary: "80,000 - 120,000 VNĐ/buổi (90 phút)",
      description: "Dạy kèm Toán lớp 10 cho học sinh THPT, 3 buổi/tuần.",
      requirements: [
        "Sinh viên Sư phạm hoặc Toán học",
        "Điểm thi ĐH Toán từ 8.0 trở lên",
        "Có kinh nghiệm gia sư",
        "Nhiệt tình, kiên nhẫn"
      ],
      benefits: [
        "Lương ổn định",
        "Thời gian linh hoạt",
        "Được hỗ trợ tài liệu"
      ],
      schedule: "Tối 2-4-6 hoặc 3-5-7",
      quantity: 1,
      isFeatured: true,
      isUrgent: true,
      views: 156,
      applications: 9
    },
    {
      _id: "gs_002",
      title: "Gia sư Tiếng Anh giao tiếp cho người đi làm",
      company: {
        _id: "comp_202",
        name: "Trung tâm Anh ngữ Smart English",
        logo: "/logos/english.png"
      },
      location: "Rạch Sỏi",
      address: "45 Đường Lê Hồng Phong",
      category: "gia-su",
      jobType: "Bán thời gian",
      salary: "100,000 - 150,000 VNĐ/buổi",
      description: "Dạy tiếng Anh giao tiếp cơ bản cho nhân viên văn phòng.",
      requirements: [
        "IELTS 6.5+ hoặc TOEIC 800+",
        "Phát âm chuẩn",
        "Có kinh nghiệm giảng dạy"
      ],
      benefits: [
        "Lương cao",
        "Làm việc tại trung tâm",
        "Được training phương pháp"
      ],
      schedule: "Tối trong tuần hoặc cuối tuần",
      quantity: 2,
      isFeatured: false,
      isUrgent: false,
      views: 98,
      applications: 5
    },
    // Thêm 13 công việc khác cho danh mục này...
  ],

  // DANH MỤC: CÔNG NGHỆ THÔNG TIN
  "cong-nghe-thong-tin": [
    {
      _id: "cntt_001",
      title: "Thực tập sinh Lập trình Web - Công ty TNHH TechSolution KG",
      company: {
        _id: "comp_301",
        name: "Công ty TNHH TechSolution Kiên Giang",
        logo: "/logos/tech.png"
      },
      location: "Rạch Giá",
      address: "Tòa nhà FPT, Đường Mạc Cửu",
      category: "cong-nghe-thong-tin",
      jobType: "Thực tập",
      salary: "3,000,000 - 4,000,000 VNĐ/tháng",
      description: "Thực tập phát triển website với ReactJS/NodeJS.",
      requirements: [
        "Sinh viên CNTT năm 3,4",
        "Biết HTML, CSS, JavaScript cơ bản",
        "Có portfolio cá nhân",
        "Ham học hỏi"
      ],
      benefits: [
        "Được mentoring bởi senior",
        "Cơ hội được nhận vào làm chính thức",
        "Hỗ trợ chứng chỉ",
        "Môi trường startup năng động"
      ],
      schedule: "Full-time hoặc part-time",
      quantity: 3,
      isFeatured: true,
      isUrgent: true,
      views: 378,
      applications: 45
    },
    {
      _id: "cntt_002",
      title: "Nhân viên hỗ trợ IT part-time - Trường Đại học Kiên Giang",
      company: {
        _id: "comp_302",
        name: "Đại học Kiên Giang",
        logo: "/logos/university.png"
      },
      location: "Rạch Giá",
      address: "Số 320 Quốc lộ 61, Phường Vĩnh Hiệp",
      category: "cong-nghe-thong-tin",
      jobType: "Bán thời gian",
      salary: "30,000 VNĐ/giờ",
      description: "Hỗ trợ kỹ thuật máy tính, mạng, phần mềm cho giảng viên và sinh viên.",
      requirements: [
        "Kiến thức cơ bản về mạng, phần cứng",
        "Kỹ năng giải quyết vấn đề",
        "Thái độ nhiệt tình"
      ],
      benefits: [
        "Làm việc trong môi trường giáo dục",
        "Thời gian linh hoạt theo lịch học",
        "Kinh nghiệm thực tế"
      ],
      schedule: "Theo lịch đăng ký",
      quantity: 5,
      isFeatured: true,
      isUrgent: false,
      views: 210,
      applications: 32
    },
    // Thêm 18 công việc khác cho danh mục này...
  ],

  // DANH MỤC: GIAO HÀNG/VẬN CHUYỂN
  "giao-hang": [
    {
      _id: "gh_001",
      title: "Shipper part-time - GrabFood Rạch Giá",
      company: {
        _id: "comp_401",
        name: "Grab Việt Nam",
        logo: "/logos/grab.png"
      },
      location: "Rạch Giá",
      address: "Khu vực trung tâm thành phố",
      category: "giao-hang",
      jobType: "Tự do",
      salary: "25,000 - 50,000 VNĐ/đơn",
      description: "Giao đồ ăn, hàng hóa cho khách hàng qua ứng dụng Grab.",
      requirements: [
        "Có xe máy và bằng lái",
        "Smartphone có 3G/4G",
        "Biết sử dụng ứng dụng điện thoại",
        "Thành thạo đường phố Rạch Giá"
      ],
      benefits: [
        "Thu nhập không giới hạn",
        "Thời gian tự do",
        "Được hỗ trợ nhiệt tình",
        "Thưởng theo số đơn"
      ],
      schedule: "Tự do chọn ca",
      quantity: 20,
      isFeatured: true,
      isUrgent: true,
      views: 512,
      applications: 89
    },
    {
      _id: "gh_002",
      title: "Nhân viên giao báo - Báo Kiên Giang",
      company: {
        _id: "comp_402",
        name: "Báo Kiên Giang",
        logo: "/logos/newspaper.png"
      },
      location: "Toàn tỉnh Kiên Giang",
      address: "Số 12 Lý Thường Kiệt, TP. Rạch Giá",
      category: "giao-hang",
      jobType: "Bán thời gian",
      salary: "4,500,000 VNĐ/tháng + phụ cấp",
      description: "Giao báo buổi sáng cho các hộ gia đình đăng ký.",
      requirements: [
        "Dậy sớm được (4h30-5h sáng)",
        "Có phương tiện đi lại",
        "Trung thực, có trách nhiệm"
      ],
      benefits: [
        "Lương ổn định",
        "Xong việc sớm",
        "Phụ cấp xăng xe",
        "Được nghỉ Chủ nhật"
      ],
      schedule: "Sáng 5h-7h30 hàng ngày",
      quantity: 8,
      isFeatured: false,
      isUrgent: false,
      views: 134,
      applications: 12
    },
    // Thêm 13 công việc khác cho danh mục này...
  ],

  // DANH MỤC: KẾ TOÁN/TÀI CHÍNH
  "ke-toan-tai-chinh": [
    {
      _id: "kt_001",
      title: "Thực tập sinh kế toán - Công ty TNHH Thương mại Minh Phát",
      company: {
        _id: "comp_501",
        name: "Công ty TNHH Thương mại Minh Phát",
        logo: "/logos/accounting.png"
      },
      location: "Rạch Sỏi",
      address: "Khu công nghiệp Rạch Sỏi",
      category: "ke-toan-tai-chinh",
      jobType: "Thực tập",
      salary: "2,500,000 VNĐ/tháng",
      description: "Hỗ trợ kế toán viên nhập liệu, kiểm tra hóa đơn, chứng từ.",
      requirements: [
        "Sinh viên năm cuối chuyên ngành Kế toán",
        "Biết sử dụng phần mềm kế toán MISA",
        "Cẩn thận, tỉ mỉ",
        "Có thể làm part-time"
      ],
      benefits: [
        "Được đào tạo thực tế",
        "Cơ hội làm việc chính thức",
        "Giấy chứng nhận thực tập",
        "Hỗ trợ tốt nghiệp"
      ],
      schedule: "Làm buổi sáng hoặc buổi chiều",
      quantity: 2,
      isFeatured: true,
      isUrgent: true,
      views: 187,
      applications: 23
    },
    // Thêm 14 công việc khác cho danh mục này...
  ],

  // DANH MỤC: TIẾP THỊ/MARKETING
  "marketing": [
    {
      _id: "mk_001",
      title: "Nhân viên Marketing Online part-time - Công ty Du lịch Mekong",
      company: {
        _id: "comp_601",
        name: "Công ty Du lịch Mekong",
        logo: "/logos/tourism.png"
      },
      location: "Rạch Giá",
      address: "22 Đường Mạc Cửu",
      category: "marketing",
      jobType: "Bán thời gian",
      salary: "4,000,000 - 6,000,000 VNĐ/tháng",
      description: "Quản lý fanpage Facebook, viết content du lịch, chạy quảng cáo.",
      requirements: [
        "Có kinh nghiệm quản lý fanpage",
        "Kỹ năng viết content tốt",
        "Biết sử dụng Canva cơ bản",
        "Yêu thích du lịch"
      ],
      benefits: [
        "Được đi famtrip miễn phí",
        "Môi trường sáng tạo",
        "Thưởng theo hiệu quả chiến dịch"
      ],
      schedule: "Linh hoạt, có thể làm remote",
      quantity: 2,
      isFeatured: true,
      isUrgent: false,
      views: 245,
      applications: 31
    },
    // Thêm 19 công việc khác cho danh mục này...
  ],

  // DANH MỤC: XÂY DỰNG
  "xay-dung": [
    {
      _id: "xd_001",
      title: "Phụ xây dựng part-time - Công trình chung cư Hùng Vương",
      company: {
        _id: "comp_701",
        name: "Công ty CP Xây dựng Kiên Giang",
        logo: "/logos/construction.png"
      },
      location: "Rạch Giá",
      address: "Dự án chung cư Hùng Vương, Phường Vĩnh Lạc",
      category: "xay-dung",
      jobType: "Theo ca",
      salary: "200,000 - 300,000 VNĐ/ngày",
      description: "Hỗ trợ công nhân chính trong các công việc phụ tại công trường.",
      requirements: [
        "Có sức khỏe tốt",
        "Chịu được áp lực công việc",
        "Tuân thủ an toàn lao động",
        "Cẩn thận, tỉ mỉ"
      ],
      benefits: [
        "Lương ngày",
        "Được cấp bảo hộ lao động",
        "Ăn trưa tại chỗ",
        "Làm theo hợp đồng ngắn hạn"
      ],
      schedule: "7h-17h (nghỉ trưa 1.5h)",
      quantity: 10,
      isFeatured: false,
      isUrgent: true,
      views: 156,
      applications: 42
    },
    // Thêm 14 công việc khác cho danh mục này...
  ],

  // DANH MỤC: SẢN XUẤT/CHẾ BIẾN
  "san-xuat": [
    {
      _id: "sx_001",
      title: "Công nhân chế biến thủy sản - Công ty Vĩnh Hoàn Chi nhánh Kiên Giang",
      company: {
        _id: "comp_801",
        name: "Công ty CP Vĩnh Hoàn",
        logo: "/logos/fishery.png"
      },
      location: "Kiên Lương",
      address: "Khu công nghiệp Kiên Lương",
      category: "san-xuat",
      jobType: "Theo ca",
      salary: "6,500,000 - 8,000,000 VNĐ/tháng",
      description: "Chế biến, phân loại, đóng gói sản phẩm thủy sản xuất khẩu.",
      requirements: [
        "Sức khỏe tốt",
        "Chịu được lạnh",
        "Cẩn thận, nhanh nhẹn",
        "Tuân thủ vệ sinh an toàn thực phẩm"
      ],
      benefits: [
        "Lương thưởng ổn định",
        "Được đào tạo bài bản",
        "Bảo hiểm đầy đủ",
        "Ăn ca tại nhà máy"
      ],
      schedule: "Ca sáng: 6h-14h, Ca chiều: 14h-22h",
      quantity: 50,
      isFeatured: true,
      isUrgent: true,
      views: 489,
      applications: 156
    },
    // Thêm 25 công việc khác cho danh mục này...
  ],

  // DANH MỤC: DỊCH VỤ KHÁCH HÀNG
  "dich-vu-khach-hang": [
    {
      _id: "dvkh_001",
      title: "Telesales part-time - Ngân hàng Vietcombank Chi nhánh Kiên Giang",
      company: {
        _id: "comp_901",
        name: "Ngân hàng Vietcombank",
        logo: "/logos/bank.png"
      },
      location: "Rạch Giá",
      address: "Số 1 Đường 3/2",
      category: "dich-vu-khach-hang",
      jobType: "Bán thời gian",
      salary: "5,000,000 VNĐ/tháng + hoa hồng",
      description: "Gọi điện tư vấn sản phẩm thẻ tín dụng, vay vốn cho khách hàng.",
      requirements: [
        "Giọng nói dễ nghe, chuẩn",
        "Kỹ năng giao tiếp tốt",
        "Chịu được áp lực",
        "Biết sử dụng máy tính"
      ],
      benefits: [
        "Hoa hồng không giới hạn",
        "Được đào tạo sản phẩm",
        "Môi trường làm việc chuyên nghiệp",
        "Làm việc trong ngân hàng"
      ],
      schedule: "Sáng 8h-12h hoặc chiều 13h-17h",
      quantity: 8,
      isFeatured: true,
      isUrgent: true,
      views: 321,
      applications: 67
    },
    // Thêm 17 công việc khác cho danh mục này...
  ],

  // DANH MỤC: Y TẾ/CHĂM SÓC SỨC KHỎE
  "y-te": [
    {
      _id: "yt_001",
      title: "Trợ lý y tá part-time - Bệnh viện Đa khoa Kiên Giang",
      company: {
        _id: "comp_1001",
        name: "Bệnh viện Đa khoa Kiên Giang",
        logo: "/logos/hospital.png"
      },
      location: "Rạch Giá",
      address: "Số 10 Lý Thường Kiệt",
      category: "y-te",
      jobType: "Bán thời gian",
      salary: "30,000 VNĐ/giờ",
      description: "Hỗ trợ y tá trong công tác chăm sóc bệnh nhân, sắp xếp hồ sơ.",
      requirements: [
        "Sinh viên Y, Dược",
        "Có kiến thức y tế cơ bản",
        "Nhân hậu, yêu nghề",
        "Chịu được áp lực"
      ],
      benefits: [
        "Kinh nghiệm thực tế quý giá",
        "Làm trong môi trường y tế",
        "Được hướng dẫn bởi bác sĩ",
        "Giấy chứng nhận thực tập"
      ],
      schedule: "Ca sáng/chiều/tối linh hoạt",
      quantity: 6,
      isFeatured: true,
      isUrgent: false,
      views: 198,
      applications: 34
    },
    // Thêm 11 công việc khác cho danh mục này...
  ]
};

// Hàm để lấy tất cả công việc
export const getAllSampleJobs = () => {
  const allJobs = [];
  Object.values(SAMPLE_JOBS).forEach(categoryJobs => {
    allJobs.push(...categoryJobs);
  });
  return allJobs;
};

// Hàm lấy công việc theo danh mục
export const getJobsByCategory = (categoryId) => {
  return SAMPLE_JOBS[categoryId] || [];
};

// Hàm lấy công việc nổi bật
export const getFeaturedJobs = (limit = 6) => {
  const allJobs = getAllSampleJobs();
  return allJobs
    .filter(job => job.isFeatured)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

// Hàm tìm kiếm công việc
export const searchJobs = (keyword, location, category) => {
  let results = getAllSampleJobs();
  
  if (keyword) {
    const searchLower = keyword.toLowerCase();
    results = results.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.company.name.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (location) {
    results = results.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  if (category) {
    results = results.filter(job => job.category === category);
  }
  
  return results;
};