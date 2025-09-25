import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Modal, Form, Toast, ToastContainer, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiService } from "./services/apiService";

/**
 * Component AdminContents - Quản lý nội dung y tế trong hệ thống
 * Tính năng: Tạo, xem, sửa, xóa bài viết y tế, upload ảnh minh họa
 */
function AdminContents() {
    const navigate = useNavigate();
    
    // State quản lý dữ liệu component
    const [items, setItems] = useState([]); // Danh sách nội dung từ API
    const [form, setForm] = useState({ 
        title: "", // Tiêu đề bài viết
        description: "", // Mô tả nội dung
        category_id: "", // ID danh mục
        doctor_id: "" // ID bác sĩ tác giả
    });
    const [categories, setCategories] = useState([]); // Danh sách danh mục
    const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
    const [editingId, setEditingId] = useState(null); // ID nội dung đang chỉnh sửa
    const [showToast, setShowToast] = useState(false); // Trạng thái hiển thị toast
    const [toastText, setToastText] = useState(""); // Nội dung thông báo toast
    const [toastVariant, setToastVariant] = useState("success"); // Loại toast (success/error)
    const [imageFile, setImageFile] = useState(null); // File ảnh được chọn
    const [imagePreview, setImagePreview] = useState(null); // Preview ảnh
    const [imageKey, setImageKey] = useState(0); // Key để reset file input
    const [forceReload, setForceReload] = useState(0); // Force reload data
    const fileInputRef = useRef(null); // Ref cho file input

    /**
     * Function chung cho force reload dữ liệu
     * Reset cache và reload danh sách nội dung
     */
    const forceReloadData = () => {
        setForceReload(prev => prev + 1); // Trigger reload
        setImageKey(prev => prev + 1); // Reset file input
    };

    /**
     * Tải dữ liệu nội dung, danh mục và bác sĩ từ API
     * Sử dụng Promise.all để tải song song, tối ưu performance
     */
    const load = async () => {
        try {
            const [contents, cats, docs] = await Promise.all([
                apiService.getContents(), // Lấy danh sách nội dung
                apiService.getCategories(), // Lấy danh sách danh mục
                apiService.getDoctors(), // Lấy danh sách bác sĩ
            ]);
            
            setItems(contents); // Cập nhật danh sách nội dung
            setCategories(cats); // Cập nhật danh sách danh mục
            setDoctors(docs); // Cập nhật danh sách bác sĩ
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // Tải dữ liệu khi component mount
    useEffect(() => { load(); }, []);

    /**
     * Xử lý khi user chọn file ảnh
     * Tạo preview ảnh để hiển thị trước khi upload
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Lưu file được chọn
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result); // Tạo preview
            reader.readAsDataURL(file); // Đọc file thành base64
        }
    };

    /**
     * Reset form về trạng thái ban đầu
     * Xóa tất cả dữ liệu và reset file input
     */
    const resetForm = () => {
        setForm({ title: "", name: "", description: "", category_id: "", doctor_id: "" }); // Reset form data
        setImageFile(null); // Xóa file ảnh
        setImagePreview(null); // Xóa preview ảnh
        setEditingId(null); // Reset editing ID
        setImageKey(prev => prev + 1); // Force reload image input
        
        // Reset file input element
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const submit = async (e) => {
        try {
            e.preventDefault();
            
            // Validation cơ bản
            if (!form.title.trim()) {
                setToastVariant("danger");
                setToastText("Title is required");
                setShowToast(true);
                return;
            }
            
            if (!form.description.trim()) {
                setToastVariant("danger");
                setToastText("Content is required");
                setShowToast(true);
                return;
            }
            
            if (!form.category_id) {
                setToastVariant("danger");
                setToastText("Category is required");
                setShowToast(true);
                return;
            }
            
            // Nếu có ảnh mới và đang edit, upload ảnh riêng trước
            if (imageFile && editingId) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                
                const imageRes = await apiService.uploadContentImage(editingId, imageFormData);
                
                if (imageRes.ok) {
                    // Force reload để hiển thị ảnh mới
                    forceReloadData();
                    // Reload data để lấy ảnh mới
                    load();
                } else {
                    console.error('Image upload failed');
                }
            }
            
            // Gửi JSON cho update, FormData cho create
            let res;
            
            if (editingId) {
                // Update: gửi JSON
                res = await apiService.updateContent(editingId, {
                    title: form.title,
                    name: form.name || '',
                    description: form.description,
                    category_id: form.category_id,
                    doctor_id: form.doctor_id || null,
                });
            } else {
                // Create: gửi FormData
                const formData = new FormData();
                formData.append('title', form.title);
                formData.append('name', form.name || '');
                formData.append('description', form.description);
                formData.append('category_id', form.category_id);
                if (form.doctor_id && form.doctor_id !== '') {
                    formData.append('doctor_id', form.doctor_id);
                }
                
                // Chỉ gửi ảnh nếu có file mới được chọn
                if (imageFile) {
                    formData.append('image', imageFile);
                }
                
                res = await apiService.createContent(formData);
            }

            if (res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    await res.json();
                    setToastVariant("success");
                    setToastText(editingId ? "Updated successfully" : "Created successfully");
                    setShowToast(true);
                    closeModal();
                    forceReloadData(); // Force reload
                    load();
                } else {
                    console.error('Server returned non-JSON response:', await res.text());
                    setToastVariant("danger");
                    setToastText("Server returned invalid data format");
                    setShowToast(true);
                }
            } else {
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await res.json();
                    console.error('Error response:', errorData);
                    setToastVariant("danger");
                    setToastText("Operation failed: " + (errorData.message || 'Unknown error'));
                    setShowToast(true);
                } else {
                    const errorText = await res.text();
                    console.error('Server returned non-JSON error:', errorText);
                    setToastVariant("danger");
                    setToastText("Server returned invalid error format");
                    setShowToast(true);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setToastVariant("danger");
            setToastText("An error occurred: " + error.message);
            setShowToast(true);
        }
    };

    const edit = (item) => {
        setForm({
            title: item.title || "",
            name: item.name || "",
            description: item.description || "",
            category_id: item.category_id || "",
            doctor_id: item.doctor_id || "",
        });
        setImageFile(null);
        setImagePreview(item.image_url || null);
        setEditingId(item.content_id);
        setShowModal(true);
    };

    const remove = async (id) => {
        if (!window.confirm("Delete article?")) return;
        try {
            const res = await apiService.deleteContent(id);
            if (res.ok) {
                setToastVariant("success");
                setToastText("Deleted successfully");
                setShowToast(true);
                load();
            } else {
                setToastVariant("danger");
                setToastText("Delete failed");
                setShowToast(true);
            }
        } catch (error) {
            setToastVariant("danger");
            setToastText("An error occurred");
            setShowToast(true);
        }
    };

    return (
        <div className="container-fluid py-4 px-4" style={{ marginTop: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">Medical Content Management</h2>
                <div>
                    <Button variant="outline-secondary" onClick={() => navigate('/admin/categories')} className="me-2">
                        <i className="fas fa-tags me-2"></i>Manage Categories
                    </Button>
                    <Button variant="primary" onClick={openModal}>
                        <i className="fas fa-plus me-2"></i>Create New Article
                    </Button>
                </div>
            </div>

            <Row key={forceReload}>
                {items.map(item => (
                    <Col key={`${item.content_id}-${forceReload}`} md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            {item.image_url && (
                                <Card.Img 
                                    key={`${item.content_id}-${imageKey}-${forceReload}-${Date.now()}-${Math.random()}`}
                                    variant="top" 
                                    src={`${item.image_url}&f=${forceReload}&k=${imageKey}&t=${Date.now()}`}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            <Card.Body className="d-flex flex-column p-4">
                                <Card.Title className="text-truncate fw-bold text-dark mb-2">
                                    {item.title}
                                </Card.Title>
                                <div className="mb-2">
                                    <span className="badge bg-primary me-2">{item.category?.category_name || 'Uncategorized'}</span>
                                </div>
                                <Card.Text className="text-muted small mb-2">
                                    <i className="fas fa-user me-1"></i>
                                    {(() => {
                                        const doctor = doctors.find(d => d.doctor_id === item.doctor_id);
                                        return doctor ? doctor.name : (item.creator?.display_name || item.creator?.username || 'Unknown Author');
                                    })()}
                                </Card.Text>
                                {item.description && (
                                    <Card.Text className="flex-grow-1">
                                        {item.description.length > 100 
                                            ? `${item.description.substring(0, 100)}...` 
                                            : item.description
                                        }
                                    </Card.Text>
                                )}
                                <div className="mt-auto">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => edit(item)}
                                    >
                                        <i className="fas fa-edit me-1"></i>Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => remove(item.content_id)}
                                    >
                                        <i className="fas fa-trash me-1"></i>Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Edit Article' : 'Create New Article'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={submit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter article title"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Article Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter article name (optional)"
                                value={form.name || ''}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category *</Form.Label>
                            <Form.Select
                                value={form.category_id}
                                onChange={e => setForm({ ...form, category_id: e.target.value })}
                                required
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(c => (
                                    <option key={c.category_id} value={c.category_id}>
                                        {c.category_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Author Doctor *</Form.Label>
                            <Form.Select
                                value={form.doctor_id}
                                onChange={e => setForm({ ...form, doctor_id: e.target.value })}
                                required
                            >
                                <option value="">-- Select Doctor --</option>
                                {doctors.map(d => (
                                    <option key={d.doctor_id} value={d.doctor_id}>
                                        {d.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                ref={fileInputRef}
                                key={`file-input-${imageKey}`}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                        className="img-thumbnail"
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter article content"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast 
                    bg={toastVariant} 
                    onClose={() => setShowToast(false)} 
                    show={showToast} 
                    delay={3000} 
                    autohide
                >
                    <Toast.Body className="text-white">
                        {toastText}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default AdminContents;


