/**
 * API Service Layer - Lớp dịch vụ API
 * Tập trung các API calls để giảm code trùng lặp
 * Duy trì chức năng giống hệt code hiện tại
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

// Helper function để lấy auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('MediToken') || '';
    return {
        'Authorization': `Bearer ${token}`, // Token xác thực
        'Content-Type': 'application/json', // Loại nội dung JSON
        'Accept': 'application/json' // Chấp nhận response JSON
    };
};

// Helper function để tạo URL với cache busting
const getCacheBustingUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}?t=${Date.now()}`; // Thêm timestamp để tránh cache
};

export const apiService = {
    // ===== XÁC THỰC - AUTHENTICATION =====
    login: async (credentials) => {
        // Đăng nhập với email/username và password
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        return response;
    },

    logout: async () => {
        // Đăng xuất - xóa token khỏi server
        const token = localStorage.getItem('MediToken') || '';
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response;
    },

    getMe: async () => {
        // Lấy thông tin user hiện tại từ token
        const response = await fetch(`${API_BASE_URL}/api/me`, {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    changePassword: async (passwordData) => {
        // Đổi mật khẩu user hiện tại
        const response = await fetch(`${API_BASE_URL}/api/change-password`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(passwordData)
        });
        return response;
    },

    // ===== DASHBOARD =====
    getDashboardStats: async () => {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, { 
            cache: "no-store" 
        });
        return response.json();
    },

    getRecentActivities: async () => {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/recent-activities`, { 
            cache: "no-store" 
        });
        return response.json();
    },

    getNotifications: async () => {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/notifications`, { 
            cache: "no-store",
            headers: { "Authorization": `Bearer ${localStorage.getItem('MediToken') || ''}` }
        });
        return response.json();
    },

    // ===== USERS =====
    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    createUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return response;
    },

    updateUser: async (userId, userData) => {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return response;
    },

    deleteUser: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    createUserProfile: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/create-profile`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return response;
    },

    unlockUser: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/unlock`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return response;
    },

    // ===== DOCTORS =====
    getDoctors: async () => {
        const response = await fetch(getCacheBustingUrl('/api/doctors'));
        return response.json();
    },

    getDoctor: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`);
        return response.json();
    },

    createDoctor: async (doctorData) => {
        const token = localStorage.getItem('MediToken') || '';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Không set Content-Type cho FormData, browser sẽ tự set
        if (!(doctorData instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(`${API_BASE_URL}/api/doctors`, {
            method: 'POST',
            headers: headers,
            body: doctorData instanceof FormData ? doctorData : JSON.stringify(doctorData)
        });
        return response;
    },

    updateDoctor: async (doctorId, doctorData) => {
        const token = localStorage.getItem('MediToken') || '';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Không set Content-Type cho FormData, browser sẽ tự set
        if (!(doctorData instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`, {
            method: 'POST',
            headers: headers,
            body: doctorData instanceof FormData ? doctorData : JSON.stringify(doctorData)
        });
        return response;
    },

    deleteDoctor: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    getDoctorSpecializations: async () => {
        const response = await fetch(`${API_BASE_URL}/api/doctors/specializations`);
        return response.json();
    },

    getDoctorAppointments: async () => {
        const response = await fetch(getCacheBustingUrl('/api/doctor/appointments'), {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    // ===== PATIENTS =====
    getPatients: async () => {
        const response = await fetch(`${API_BASE_URL}/api/patients`, {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    getPatient: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}`, {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    createPatient: async (patientData) => {
        const token = localStorage.getItem('MediToken') || '';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Không set Content-Type cho FormData, browser sẽ tự set
        if (!(patientData instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(`${API_BASE_URL}/api/patients`, {
            method: 'POST',
            headers: headers,
            body: patientData instanceof FormData ? patientData : JSON.stringify(patientData)
        });
        return response;
    },

    updatePatient: async (patientId, patientData) => {
        const token = localStorage.getItem('MediToken') || '';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Không set Content-Type cho FormData, browser sẽ tự set
        if (!(patientData instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}`, {
            method: 'POST',
            headers: headers,
            body: patientData instanceof FormData ? patientData : JSON.stringify(patientData)
        });
        return response;
    },

    deletePatient: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    uploadPatientImage: async (patientId, formData) => {
        const token = localStorage.getItem('MediToken') || '';
        const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}/upload-image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return response;
    },

    updatePatientProfile: async (patientId, profileData) => {
        const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        return response;
    },

    getPatientAppointments: async () => {
        const response = await fetch(`${API_BASE_URL}/api/patient/appointments`, {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    // ===== CONTENTS =====
    getContents: async () => {
        const response = await fetch(getCacheBustingUrl('/api/contents'));
        return response.json();
    },

    getContent: async (contentId) => {
        const response = await fetch(`${API_BASE_URL}/api/contents/${contentId}`);
        return response.json();
    },

    createContent: async (contentData) => {
        const response = await fetch(`${API_BASE_URL}/api/contents`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(contentData)
        });
        return response;
    },

    updateContent: async (contentId, contentData) => {
        const response = await fetch(`${API_BASE_URL}/api/contents/${contentId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(contentData)
        });
        return response;
    },

    deleteContent: async (contentId) => {
        const response = await fetch(`${API_BASE_URL}/api/contents/${contentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    uploadContentImage: async (contentId, formData) => {
        const response = await fetch(`${API_BASE_URL}/api/contents/${contentId}/upload-image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('MediToken') || ''}` },
            body: formData
        });
        return response;
    },

    // ===== CATEGORIES =====
    getCategories: async () => {
        const response = await fetch(getCacheBustingUrl('/api/categories'));
        return response.json();
    },

    getCategory: async (categoryId) => {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`);
        return response.json();
    },

    createCategory: async (categoryData) => {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return response;
    },

    updateCategory: async (categoryId, categoryData) => {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return response;
    },

    deleteCategory: async (categoryId) => {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    // ===== CITIES =====
    getCities: async () => {
        const response = await fetch(getCacheBustingUrl('/api/cities'));
        return response.json();
    },

    getCity: async (cityId) => {
        const response = await fetch(`${API_BASE_URL}/api/cities/${cityId}`);
        return response.json();
    },

    createCity: async (cityData) => {
        const response = await fetch(`${API_BASE_URL}/api/cities`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(cityData)
        });
        return response;
    },

    updateCity: async (cityId, cityData) => {
        const response = await fetch(`${API_BASE_URL}/api/cities/${cityId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(cityData)
        });
        return response;
    },

    deleteCity: async (cityId) => {
        const response = await fetch(`${API_BASE_URL}/api/cities/${cityId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    // ===== APPOINTMENTS =====
    getAppointments: async () => {
        const response = await fetch(`${API_BASE_URL}/api/appointments`, {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    getAppointment: async (appointmentId) => {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
            headers: getAuthHeaders()
        });
        return response.json();
    },

    createAppointment: async (appointmentData) => {
        const response = await fetch(`${API_BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(appointmentData)
        });
        return response;
    },

    updateAppointment: async (appointmentId, appointmentData) => {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(appointmentData)
        });
        return response;
    },

    deleteAppointment: async (appointmentId) => {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    // ===== CONTACT MESSAGES =====
    getContactMessages: async () => {
        const response = await fetch(`${API_BASE_URL}/api/contact-messages`);
        return response.json();
    },

    getContactMessage: async (messageId) => {
        const response = await fetch(`${API_BASE_URL}/api/contact-messages/${messageId}`);
        return response.json();
    },

    updateContactMessageStatus: async (messageId, status) => {
        const response = await fetch(`${API_BASE_URL}/api/contact-messages/${messageId}/status`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return response;
    },

    deleteContactMessage: async (messageId) => {
        const response = await fetch(`${API_BASE_URL}/api/contact-messages/${messageId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        return response;
    },

    // ===== AVAILABILITIES =====
    getAvailabilities: async (doctorId = null, date = null) => {
        let url = `${API_BASE_URL}/api/availabilities`;
        const params = new URLSearchParams();
        if (doctorId) params.append('doctor_id', doctorId);
        if (date) params.append('date', date);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        return response.json();
    },

    createAvailability: async (availabilityData) => {
        const response = await fetch(`${API_BASE_URL}/api/availabilities`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(availabilityData)
        });
        return response;
    },

    deleteAvailability: async (availabilityId) => {
        const response = await fetch(`${API_BASE_URL}/api/availabilities/${availabilityId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return response;
    },

    // ===== REGISTRATION =====
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/api/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response;
    },

    // ===== FORGOT PASSWORD =====
    forgotPassword: async (emailData) => {
        const response = await fetch(`${API_BASE_URL}/api/user_profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });
        return response;
    }
};

export default apiService;



