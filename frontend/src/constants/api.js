/**
 * API Constants - Hằng số API
 * Cấu hình tập trung cho các endpoint API và settings
 */

export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000", // URL gốc của API
    TIMEOUT: 10000, // 10 giây - thời gian timeout cho request
    CACHE_BUSTING: true // Bật cache busting để luôn lấy dữ liệu mới
};

export const API_ENDPOINTS = {
    // Xác thực - Authentication
    LOGIN: '/api/login', // Đăng nhập
    LOGOUT: '/api/logout', // Đăng xuất
    ME: '/api/me', // Lấy thông tin user hiện tại
    CHANGE_PASSWORD: '/api/change-password', // Đổi mật khẩu
    
    // Dashboard - Bảng điều khiển
    DASHBOARD_STATS: '/api/dashboard/stats', // Thống kê tổng quan
    RECENT_ACTIVITIES: '/api/dashboard/recent-activities', // Hoạt động gần đây
    NOTIFICATIONS: '/api/dashboard/notifications', // Thông báo
    
    // Users - Tài khoản người dùng
    USERS: '/api/users', // Tạo, xem, sửa, xóa tài khoản
    USER_PROFILES: '/api/user_profiles', // Hồ sơ cá nhân của người dùng

    // Doctors - Bác sĩ
    DOCTORS: '/api/doctors', // Tạo, xem, sửa, xóa thông tin bác sĩ
    DOCTOR_SPECIALIZATIONS: '/api/doctors/specializations', // Chuyên khoa y tế
    DOCTOR_APPOINTMENTS: '/api/doctor/appointments', // Lịch hẹn khám bệnh

    // Patients - Bệnh nhân
    PATIENTS: '/api/patients', // Tạo, xem, sửa, xóa hồ sơ bệnh nhân
    PATIENT_APPOINTMENTS: '/api/patient/appointments', // Lịch hẹn khám bệnh

    // Contents - Nội dung y tế
    CONTENTS: '/api/contents', // Tạo, xem, sửa, xóa bài viết y tế

    // Categories - Danh mục y tế
    CATEGORIES: '/api/categories', // Tạo, xem, sửa, xóa danh mục

    // Cities - Thành phố
    CITIES: '/api/cities', // Tạo, xem, sửa, xóa danh sách thành phố

    // Appointments - Lịch hẹn khám bệnh
    APPOINTMENTS: '/api/appointments', // Tạo, xem, sửa, xóa lịch hẹn

    // Contact Messages - Tin nhắn liên hệ
    CONTACT_MESSAGES: '/api/contact-messages', // Tạo, xem, sửa, xóa tin nhắn

    // Availabilities - Lịch trống của bác sĩ
    AVAILABILITIES: '/api/availabilities' // Tạo, xem, sửa, xóa lịch trống
};

// Các phương thức HTTP được sử dụng trong ứng dụng
export const HTTP_METHODS = {
    GET: 'GET',     // Lấy dữ liệu
    POST: 'POST',   // Tạo mới
    PUT: 'PUT',     // Cập nhật toàn bộ
    DELETE: 'DELETE', // Xóa
    PATCH: 'PATCH'  // Cập nhật một phần
};

// Các header HTTP chuẩn cho từng loại request
export const HTTP_HEADERS = {
    JSON: {
        'Content-Type': 'application/json', // Gửi dữ liệu JSON
        'Accept': 'application/json'        // Nhận dữ liệu JSON
    },
    FORM_DATA: {
        'Accept': 'application/json'        // Chỉ nhận JSON, không set Content-Type (browser tự set)
    }
};

// Các key lưu trữ trong localStorage
export const STORAGE_KEYS = {
    USER: 'MediUser',   // Thông tin user đã đăng nhập
    TOKEN: 'MediToken'  // Token xác thực
};

// Các tùy chọn cache cho request
export const CACHE_OPTIONS = {
    NO_STORE: 'no-store',   // Không lưu cache
    NO_CACHE: 'no-cache'    // Không sử dụng cache
};



