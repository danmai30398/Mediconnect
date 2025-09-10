import React, { useState, useEffect } from "react";
import { Dropdown, Badge, ListGroup } from "react-bootstrap";
import { apiService } from "./services/apiService";

/**
 * Component NotificationBell - Hiển thị thông báo realtime
 * Tự động refresh mỗi 30 giây để cập nhật thông báo mới
 * Hiển thị số lượng thông báo chưa đọc trên icon chuông
 */
function NotificationBell() {
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [show, setShow] = useState(false); // Trạng thái hiển thị dropdown

    /**
     * Tải danh sách thông báo từ API
     * Sử dụng apiService để đơn giản hóa code
     */
    const loadNotifications = async () => {
        try {
            const data = await apiService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Lỗi khi tải thông báo:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
        // Tự động refresh mỗi 30 giây để cập nhật thông báo mới
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval); // Cleanup khi component unmount
    }, []);

    /**
     * Format thời gian hiển thị thân thiện (ví dụ: "2 phút trước", "1 giờ trước")
     * Chuyển đổi timestamp thành định dạng dễ đọc
     */
    const formatTime = (timeString) => {
        if (!timeString) return 'Thời gian không xác định';
        
        const time = new Date(timeString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        // Hiển thị thời gian tương đối dựa trên khoảng cách
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        if (diffInDays < 7) return `${diffInDays} ngày trước`;
        
        // Nếu quá 7 ngày thì hiển thị ngày tháng cụ thể
        return time.toLocaleDateString('vi-VN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'primary',
            'confirmed': 'success',
            'cancelled_by_patient': 'danger',
            'cancelled_by_doctor': 'danger',
            'rescheduled': 'warning',
            'completed': 'success'
        };
        return colors[status] || 'info';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'pending': 'fas fa-calendar-plus',
            'confirmed': 'fas fa-check-circle',
            'cancelled_by_patient': 'fas fa-calendar-times',
            'cancelled_by_doctor': 'fas fa-calendar-times',
            'rescheduled': 'fas fa-calendar-alt',
            'completed': 'fas fa-check-double'
        };
        return icons[status] || 'fas fa-calendar';
    };

    return (
        <Dropdown show={show} onToggle={setShow} align="end">
            <Dropdown.Toggle 
                as="button" 
                variant="link" 
                className="position-relative p-2 text-decoration-none"
                style={{ border: 'none', background: 'none' }}
            >
                <i className="fas fa-bell fa-lg text-muted"></i>
                {notifications.length > 0 && (
                    <Badge 
                        bg="danger" 
                        className="position-absolute top-0 start-100 translate-middle rounded-pill"
                        style={{ fontSize: '0.7rem', minWidth: '18px', height: '18px' }}
                    >
                        {notifications.length}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu 
                className="shadow-lg border-0" 
                style={{ 
                    minWidth: '350px', 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    marginTop: '8px'
                }}
            >
                <Dropdown.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">🔔 Latest Notifications</span>
                    <small className="text-muted">{notifications.length} new</small>
                </Dropdown.Header>
                <Dropdown.Divider />
                
                {loading ? (
                    <Dropdown.ItemText className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Loading notifications...</div>
                    </Dropdown.ItemText>
                ) : notifications.length === 0 ? (
                    <Dropdown.ItemText className="text-center py-3 text-muted">
                        <i className="fas fa-bell-slash fa-2x mb-2"></i>
                        <div>No new notifications</div>
                    </Dropdown.ItemText>
                ) : (
                    notifications.map((notification, index) => (
                        <Dropdown.Item 
                            key={index} 
                            className="py-2 px-3"
                            style={{ borderBottom: index < notifications.length - 1 ? '1px solid #f8f9fa' : 'none' }}
                        >
                            <div className="d-flex align-items-start">
                                <div className={`me-3 mt-1`}>
                                    <i className={`${getStatusIcon(notification.type.split('_')[1])} text-${getStatusColor(notification.type.split('_')[1])}`}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-medium text-dark mb-1" style={{ fontSize: '0.9rem' }}>
                                        {notification.message}
                                    </div>
                                    <small className="text-muted">
                                        {formatTime(notification.time)}
                                    </small>
                                </div>
                            </div>
                        </Dropdown.Item>
                    ))
                )}
                
                {notifications.length > 0 && (
                    <>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                            className="text-center text-primary fw-medium"
                            onClick={() => window.location.href = '/admin/appointments'}
                        >
                            View All Appointments
                        </Dropdown.Item>
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default NotificationBell;





