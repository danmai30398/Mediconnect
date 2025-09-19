-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 19, 2025 lúc 10:16 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `mediconnect_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `availability_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','confirmed','completed','rescheduled','cancelled_by_patient','cancelled_by_doctor','no_show') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `availability_id`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 3, 'pending', '2025-09-18 08:26:15', '2025-09-18 08:26:15'),
(3, 2, 4, 'confirmed', '2025-09-18 08:26:15', '2025-09-18 08:26:15'),
(4, 3, 5, 'cancelled_by_patient', '2025-09-18 08:26:15', '2025-09-19 06:43:01'),
(5, 4, 6, 'confirmed', '2025-09-18 08:26:15', '2025-09-18 08:26:15'),
(6, 1, 3, 'pending', '2025-09-18 08:26:58', '2025-09-18 08:26:58'),
(7, 2, 4, 'confirmed', '2025-09-18 08:26:58', '2025-09-18 08:26:58'),
(8, 3, 5, 'pending', '2025-09-18 08:26:58', '2025-09-18 08:26:58'),
(9, 4, 6, 'confirmed', '2025-09-18 08:26:58', '2025-09-18 08:26:58'),
(10, 1, 3, 'pending', '2025-09-18 08:27:19', '2025-09-18 08:27:19'),
(11, 2, 4, 'confirmed', '2025-09-18 08:27:19', '2025-09-18 08:27:19'),
(12, 3, 5, 'pending', '2025-09-18 08:27:19', '2025-09-18 08:27:19'),
(13, 4, 6, 'confirmed', '2025-09-18 08:27:19', '2025-09-18 08:27:19'),
(14, 1, 3, 'pending', '2025-09-18 08:29:44', '2025-09-18 08:29:44'),
(15, 2, 4, 'confirmed', '2025-09-18 08:29:44', '2025-09-18 08:29:44'),
(16, 3, 5, 'pending', '2025-09-18 08:29:44', '2025-09-18 08:29:44'),
(17, 4, 27, 'completed', '2025-09-18 08:29:44', '2025-09-19 07:18:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `availability_schedulings`
--

CREATE TABLE `availability_schedulings` (
  `availability_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `available_date` date NOT NULL,
  `available_time` time NOT NULL,
  `status` enum('available','booked','cancelled') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `availability_schedulings`
--

INSERT INTO `availability_schedulings` (`availability_id`, `doctor_id`, `available_date`, `available_time`, `status`) VALUES
(3, 2, '2025-09-16', '10:00:00', 'available'),
(4, 2, '2025-09-18', '14:00:00', 'available'),
(5, 2, '2025-09-19', '09:00:00', 'available'),
(6, 2, '2025-09-17', '15:00:00', 'available'),
(7, 2, '2025-09-16', '10:00:00', 'available'),
(8, 2, '2025-09-18', '14:00:00', 'available'),
(9, 2, '2025-09-19', '09:00:00', 'available'),
(10, 2, '2025-09-17', '15:00:00', 'available'),
(11, 2, '2025-09-16', '10:00:00', 'available'),
(12, 2, '2025-09-18', '14:00:00', 'available'),
(13, 2, '2025-09-19', '09:00:00', 'available'),
(14, 2, '2025-09-17', '15:00:00', 'available'),
(15, 2, '2025-09-16', '10:00:00', 'available'),
(16, 2, '2025-09-18', '14:00:00', 'available'),
(17, 2, '2025-09-19', '09:00:00', 'available'),
(18, 2, '2025-09-17', '15:00:00', 'available'),
(19, 2, '2025-09-16', '10:00:00', 'available'),
(20, 2, '2025-09-18', '14:00:00', 'available'),
(21, 2, '2025-09-19', '09:00:00', 'available'),
(22, 2, '2025-09-17', '15:00:00', 'available'),
(23, 2, '2025-09-16', '10:00:00', 'available'),
(24, 2, '2025-09-18', '14:00:00', 'available'),
(25, 2, '2025-09-19', '09:00:00', 'available'),
(26, 2, '2025-09-17', '15:00:00', 'available'),
(27, 1, '2025-09-19', '15:00:00', 'booked'),
(29, 1, '2025-09-19', '14:00:00', 'available');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `category_name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Tin tức y tế'),
(2, 'Hướng dẫn khám chữa bệnh'),
(3, 'Chia sẻ sức khỏe'),
(4, 'Khuyến mãi & Ưu đãi'),
(5, 'Tin tức y tế'),
(6, 'Hướng dẫn khám chữa bệnh'),
(7, 'Chia sẻ sức khỏe'),
(8, 'Khuyến mãi & Ưu đãi'),
(9, 'Tin tức y tế'),
(10, 'Hướng dẫn khám chữa bệnh'),
(11, 'Chia sẻ sức khỏe'),
(12, 'Khuyến mãi & Ưu đãi'),
(13, 'Tin tức y tế'),
(14, 'Hướng dẫn khám chữa bệnh'),
(15, 'Chia sẻ sức khỏe'),
(16, 'Khuyến mãi & Ưu đãi'),
(17, 'Tin tức y tế'),
(18, 'Hướng dẫn khám chữa bệnh'),
(19, 'Chia sẻ sức khỏe'),
(20, 'Khuyến mãi & Ưu đãi'),
(21, 'Tin tức y tế'),
(22, 'Hướng dẫn khám chữa bệnh'),
(23, 'Chia sẻ sức khỏe'),
(24, 'Khuyến mãi & Ưu đãi'),
(25, 'Tin tức y tế'),
(26, 'Hướng dẫn khám chữa bệnh'),
(27, 'Chia sẻ sức khỏe'),
(28, 'Khuyến mãi & Ưu đãi'),
(29, 'Tin tức y tế'),
(30, 'Hướng dẫn khám chữa bệnh'),
(31, 'Chia sẻ sức khỏe'),
(32, 'Khuyến mãi & Ưu đãi'),
(33, 'Tin tức y tế'),
(34, 'Hướng dẫn khám chữa bệnh'),
(35, 'Chia sẻ sức khỏe'),
(36, 'Khuyến mãi & Ưu đãi');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cities`
--

CREATE TABLE `cities` (
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `city_name` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cities`
--

INSERT INTO `cities` (`city_id`, `city_name`, `created_at`, `updated_at`) VALUES
(1, 'Hà Nội', NULL, NULL),
(2, 'Hồ Chí Minh', NULL, NULL),
(3, 'Đà Nẵng', NULL, NULL),
(4, 'Cần Thơ', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contact_messages`
--

CREATE TABLE `contact_messages` (
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('pending','processing','done','closed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contact_messages`
--

INSERT INTO `contact_messages` (`message_id`, `name`, `email`, `phone`, `message`, `status`, `created_at`) VALUES
(1, 'Nguyen Thi C', 'ntc@example.com', '0909123456', 'Tôi cần tư vấn về đặt lịch khám.', 'pending', '2025-09-18 15:29:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contents`
--

CREATE TABLE `contents` (
  `content_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contents`
--

INSERT INTO `contents` (`content_id`, `category_id`, `created_by`, `doctor_id`, `title`, `description`, `image`, `name`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, 'Hướng dẫn đặt lịch khám bệnh', 'Chi tiết cách bệnh nhân có thể đặt lịch thông qua hệ thống.', NULL, 'abc', '2025-09-18 08:26:58', '2025-09-18 08:26:58'),
(2, 1, 1, NULL, 'Hướng dẫn đặt lịch khám bệnh', 'Chi tiết cách bệnh nhân có thể đặt lịch thông qua hệ thống.', NULL, 'abc', '2025-09-18 08:27:19', '2025-09-18 08:27:19'),
(3, 1, 1, NULL, 'Hướng dẫn đặt lịch khám bệnh', 'Chi tiết cách bệnh nhân có thể đặt lịch thông qua hệ thống.', NULL, 'abc', '2025-09-18 08:29:44', '2025-09-18 08:29:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctors`
--

CREATE TABLE `doctors` (
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `doctors`
--

INSERT INTO `doctors` (`doctor_id`, `name`, `qualification`, `experience`, `phone`, `email`, `specialization`, `gender`, `dob`, `image`, `description`, `city_id`, `user_id`) VALUES
(1, 'Vy Dan', 'Y khoa', 5, '0987612345', 'dan@gmail.com', 'Y khoa', 'female', '1999-12-12', '/storage/avatars/4ALxVyZutABpD8srdyKE9q2z7XevLFfOHw3ijRQp.png', 'Y khoa', 3, 5),
(2, 'Dr. B', 'MBBS', 5, '0911000002', 'drb@example.com', 'Neurology', 'female', '1985-03-21', 'Doctor1.jpg', 'Neuro specialist', 1, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_records`
--

CREATE TABLE `medical_records` (
  `record_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `diagnosis` text NOT NULL,
  `notes` text DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medi_users`
--

CREATE TABLE `medi_users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `login_attempts` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `locked_until` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `medi_users`
--

INSERT INTO `medi_users` (`user_id`, `username`, `email`, `password`, `role_id`, `is_active`, `login_attempts`, `created_at`, `updated_at`, `locked_until`) VALUES
(1, 'doctor01', NULL, '$2y$10$aKZrzW.FjxpolB5y/Ey4oOdRp.i9s3snMSz2.qh4YQYxHxUZ72fii', 2, 1, 0, NULL, NULL, '2025-09-19 01:19:26'),
(2, 'doctor02', NULL, '$2y$12$xPrmcqMCtQuf.K4tk8ZgyOH5CBea6Y91Xg30rRTrkrjka/ZTXl3ki', 2, 1, 0, NULL, NULL, '2025-09-19 01:19:26'),
(3, 'patient01@gmail.com', 'patient01@gmail.com', '$2y$10$aKZrzW.FjxpolB5y/Ey4oOdRp.i9s3snMSz2.qh4YQYxHxUZ72fii', 3, 1, 0, NULL, '2025-09-19 06:32:40', NULL),
(4, 'admin@gmail.com', 'admin@gmail.com', '$2y$10$aKZrzW.FjxpolB5y/Ey4oOdRp.i9s3snMSz2.qh4YQYxHxUZ72fii', 1, 1, 0, NULL, '2025-09-19 02:51:43', NULL),
(5, 'dan', NULL, '$2y$10$aKZrzW.FjxpolB5y/Ey4oOdRp.i9s3snMSz2.qh4YQYxHxUZ72fii', 2, 1, 0, NULL, '2025-09-19 01:54:04', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_08_27_030001_create_roles_table', 1),
(2, '2025_08_27_030001_create_users_table', 1),
(3, '2025_08_27_030002_create_roles_table', 1),
(4, '2025_08_27_030003_create_medi_users_table', 1),
(5, '2025_08_27_030004_create_cities_table', 1),
(6, '2025_08_27_030005_create_doctors_table', 1),
(7, '2025_08_27_030006_create_patients_table', 1),
(8, '2025_08_27_030007_create_availability_schedulings_table', 1),
(9, '2025_08_27_030008_create_appointments_table', 1),
(10, '2025_08_27_030009_create_medical_records_table', 2),
(11, '2025_08_27_030010_create_categories_table', 1),
(12, '2025_08_27_030011_create_contents_table', 1),
(13, '2025_08_27_030012_create_contact_messages_table', 1),
(14, '2025_08_27_030013_create_cache_table', 3),
(15, '2025_08_27_030014_create_jobs_table', 3),
(16, '2025_08_27_030015_create_personal_access_tokens_table', 3),
(18, '2025_09_08_082537_add_timestamps_to_appointments_table', 1),
(20, '2025_09_14_024244_add_description_to_doctors_table', 1),
(21, '2025_09_09_124503_make_name_nullable_in_contents_table', 5),
(22, '2025_09_09_153323_add_timestamps_to_medi_users_table', 5),
(23, '2025_09_09_153330_add_timestamps_to_contents_table', 1),
(24, '2025_09_09_153337_add_timestamps_to_appointments_table', 1),
(25, '2025_09_09_172909_modify_doctors_description_nullable', 6),
(26, '2025_09_10_000001_add_is_active_to_medi_users_table', 6),
(27, '2025_09_10_000002_add_is_active_and_role_id_to_users_table', 6),
(28, '2025_09_10_000003_make_phone_nullable_on_patients_and_doctors', 6),
(29, '2025_09_10_000004_update_role_column_on_users_table', 6),
(30, '2025_09_10_000005_alter_contact_messages_status_enum', 6),
(31, '2025_09_10_140403_modify_doctors_table_allow_null_fields', 6),
(32, '2025_09_10_140642_fix_doctors_experience_nullable', 6),
(33, '2025_09_10_140723_fix_all_doctors_fields_nullable', 6),
(34, '2025_09_10_142746_fix_patients_address_nullable', 6),
(35, '2025_09_10_144023_add_email_to_medi_users_table', 6),
(36, '2025_09_10_162420_add_doctor_id_to_contents_table', 1),
(37, '2025_09_12_002055_create_notifications_table', 1),
(38, '2025_09_14_142059_update_gender_nullable_in_patients_table', 7),
(39, '2025_09_02_174255_create_notifications_table', 8),
(40, '2025_09_08_083104_update_notifications_table_add_more_types', 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('booking','reschedule','cancel','appointment_request','appointment_update','appointment_cancelled','appointment_rescheduled') NOT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `patient_id` bigint(20) UNSIGNED DEFAULT NULL,
  `doctor_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `appointment_id`, `type`, `message`, `is_read`, `created_at`, `updated_at`, `user_id`, `role_id`, `read_at`, `patient_id`, `doctor_id`) VALUES
(1, 7, 'booking', 'Đã xong 123123123', 1, '2025-09-19 05:13:08', '2025-09-19 07:16:57', 5, 2, '2025-09-19 07:16:57', 0, 0),
(2, NULL, 'appointment_update', 'Your appointment status has been updated to: Cancelled by Doctor', 0, '2025-09-19 06:08:07', '2025-09-19 06:08:07', 4, 1, NULL, NULL, NULL),
(3, NULL, 'appointment_update', 'Your appointment status has been updated to: Confirmed', 0, '2025-09-19 06:10:08', '2025-09-19 06:10:08', 4, 1, NULL, NULL, NULL),
(4, NULL, 'appointment_update', 'Your appointment status has been updated to: Completed', 0, '2025-09-19 06:10:19', '2025-09-19 06:10:19', 4, 1, NULL, NULL, NULL),
(5, NULL, 'appointment_update', 'Your appointment status has been updated to: Confirmed', 0, '2025-09-19 06:26:44', '2025-09-19 06:26:44', 4, 1, NULL, NULL, NULL),
(6, NULL, 'appointment_update', 'Your appointment status has been updated to: Completed', 0, '2025-09-19 07:18:08', '2025-09-19 07:18:08', 4, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `patients`
--

CREATE TABLE `patients` (
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `patients`
--

INSERT INTO `patients` (`patient_id`, `name`, `address`, `phone`, `dob`, `email`, `gender`, `image`, `user_id`) VALUES
(1, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(2, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(3, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(4, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(5, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(6, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(7, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(8, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(9, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(10, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(11, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(12, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(13, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(14, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(15, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(16, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(17, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(18, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(19, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(20, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(21, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(22, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(23, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(24, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(25, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(26, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(27, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(28, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(29, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(30, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(31, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(32, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(33, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(34, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(35, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(36, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4),
(37, 'John Smith', '123 Main Street, New York', '1234567890', '1990-05-10', 'john.smith@example.com', 'Male', NULL, 1),
(38, 'Emily Johnson', '456 Park Avenue, Los Angeles', '0987654321', '1992-07-15', 'emily.johnson@example.com', 'Female', NULL, 2),
(39, 'Michael Brown', '789 Broadway, Chicago', '1122334455', '1994-03-20', 'michael.brown@example.com', 'Male', NULL, 3),
(40, 'Sophia Davis', '321 Ocean Drive, Miami', '6677889900', '1996-09-25', 'sophia.davis@example.com', 'Female', NULL, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\MediUser', 1, 'auth_token', 'bfb92c5d1ddee693f71d1a13a215629a9766dabb555877e4b0ef27ee0f2b46f1', '[\"*\"]', '2025-09-18 08:52:40', NULL, '2025-09-18 08:52:33', '2025-09-18 08:52:40'),
(2, 'App\\Models\\MediUser', 5, 'auth_token', 'af050782007b7732db54c136abd6ee06d884f1494562b34675a028025578bf6b', '[\"*\"]', '2025-09-19 01:19:33', NULL, '2025-09-19 01:19:28', '2025-09-19 01:19:33'),
(3, 'App\\Models\\MediUser', 5, 'auth_token', 'de532d9083eccf317a20f32f9a4f59a12a7da2846ee0820b813cdc426132d0f7', '[\"*\"]', '2025-09-19 01:20:37', NULL, '2025-09-19 01:20:36', '2025-09-19 01:20:37'),
(4, 'App\\Models\\MediUser', 5, 'auth_token', 'f30b41044d0507908ac381355be5ca0ae759bd796d4c741abbfe4da106ea62d9', '[\"*\"]', '2025-09-19 01:54:10', NULL, '2025-09-19 01:54:04', '2025-09-19 01:54:10'),
(5, 'App\\Models\\MediUser', 5, 'auth_token', 'c7453b65e919857851a1cfd460b4ab412f2ab1b4f069363cc412801c780a9196', '[\"*\"]', '2025-09-19 02:31:57', NULL, '2025-09-18 19:15:24', '2025-09-19 02:31:57'),
(6, 'App\\Models\\MediUser', 5, 'auth_token', '2cb9f2763a422b6a8a6839ad753a12dcbf9ff83a1171246d8419b507500bdc50', '[\"*\"]', '2025-09-19 02:22:54', NULL, '2025-09-19 02:22:42', '2025-09-19 02:22:54'),
(7, 'App\\Models\\MediUser', 5, 'auth_token', '2ca19721b58db5cdf2ab1d996bf4b7ff76b27c9c9725b92b37a6b32aac2ffa60', '[\"*\"]', '2025-09-19 02:24:50', NULL, '2025-09-19 02:24:49', '2025-09-19 02:24:50'),
(8, 'App\\Models\\MediUser', 5, 'auth_token', '9944609b1fcbd3881a6080343111a6bb14b0e15d8e6ea0fbfdbd48fe7f8b8680', '[\"*\"]', NULL, NULL, '2025-09-19 02:26:03', '2025-09-19 02:26:03'),
(9, 'App\\Models\\MediUser', 5, 'auth_token', 'e32d9c44131eb87e63035c6aaa577b6ae84c3f879b8be87dbd1c6c4a8688172d', '[\"*\"]', NULL, NULL, '2025-09-19 02:32:03', '2025-09-19 02:32:03'),
(10, 'App\\Models\\MediUser', 5, 'auth_token', 'c08249110595dbcb9a2da0f235446015f2cf33c55fdce9b0ea9719e79bf60e21', '[\"*\"]', NULL, NULL, '2025-09-19 02:32:24', '2025-09-19 02:32:24'),
(11, 'App\\Models\\MediUser', 5, 'auth_token', 'd5bb4144d5a9551a2c4db365a218746ff0ef23e21a505122d8fe63c3dc3c9454', '[\"*\"]', NULL, NULL, '2025-09-19 02:35:10', '2025-09-19 02:35:10'),
(12, 'App\\Models\\MediUser', 5, 'auth_token', '35cb5616abfc856a99614eae3af29a4a79fe52dc10ddd7dc21eb37976cfdb2dc', '[\"*\"]', NULL, NULL, '2025-09-19 02:36:35', '2025-09-19 02:36:35'),
(13, 'App\\Models\\MediUser', 5, 'auth_token', 'a689aa3265a1bc6097bb3c4a67972999ea0bba3fe804456bb4c22da4c4f3d79a', '[\"*\"]', NULL, NULL, '2025-09-19 02:37:23', '2025-09-19 02:37:23'),
(14, 'App\\Models\\MediUser', 5, 'auth_token', '6cb9a7c85c54ccda9946b21f9ae076e736f6ccf58facb3eac6da7c3242e78713', '[\"*\"]', NULL, NULL, '2025-09-19 02:38:34', '2025-09-19 02:38:34'),
(15, 'App\\Models\\MediUser', 5, 'auth_token', '7710795a23327b7327ca1b62e7063922846a22414a4db98f40a583d735fbb17e', '[\"*\"]', '2025-09-19 02:39:56', NULL, '2025-09-19 02:39:17', '2025-09-19 02:39:56'),
(16, 'App\\Models\\MediUser', 5, 'auth_token', 'd358ae0765df26f4b5101e655eb74279d0895fe4245db3d892ac08fc25fd2d30', '[\"*\"]', NULL, NULL, '2025-09-19 02:44:41', '2025-09-19 02:44:41'),
(17, 'App\\Models\\MediUser', 5, 'auth_token', '23e05e078d15d470db3be292429da324e77476cc800f66a3df499db2d709d075', '[\"*\"]', NULL, NULL, '2025-09-19 02:45:11', '2025-09-19 02:45:11'),
(18, 'App\\Models\\MediUser', 5, 'auth_token', '3a94c86bf434b4f08761dd1a3b2d8968c5065a8513c7e40e39f83725d762e813', '[\"*\"]', NULL, NULL, '2025-09-19 02:45:26', '2025-09-19 02:45:26'),
(19, 'App\\Models\\MediUser', 4, 'auth_token', '4aee125e332144d0f6b90bfb7e143f33dd45ac69e31a4b175555019c184fbeb0', '[\"*\"]', NULL, NULL, '2025-09-19 02:51:43', '2025-09-19 02:51:43'),
(20, 'App\\Models\\MediUser', 5, 'auth_token', 'fd1f78c8b555e3e44718a08f9b7717b19512f8fa038b9912aaaf03f9adc142bf', '[\"*\"]', NULL, NULL, '2025-09-19 02:58:10', '2025-09-19 02:58:10'),
(21, 'App\\Models\\MediUser', 5, 'auth_token', '41f7e6d22699c442e236c81229464897bb0bf911cf88bb5bb5f0cfaa7af1f38b', '[\"*\"]', NULL, NULL, '2025-09-19 02:58:38', '2025-09-19 02:58:38'),
(22, 'App\\Models\\MediUser', 5, 'auth_token', '7e3af122915fde2e3f145ef1e35ae486690374d5e9de5d52bf8dcc1303b79a58', '[\"*\"]', '2025-09-19 03:00:15', NULL, '2025-09-19 02:59:56', '2025-09-19 03:00:15'),
(23, 'App\\Models\\MediUser', 5, 'auth_token', '928eaa3f39dc7104599af0c91b8de9fbb5bb60d0aefaa4095f80af16883a33a5', '[\"*\"]', NULL, NULL, '2025-09-19 03:00:13', '2025-09-19 03:00:13'),
(24, 'App\\Models\\MediUser', 5, 'auth_token', '36831e4a777ad997738bcd9aa357e1e80e785fa47d9f6cf0f1174c179e4a82b0', '[\"*\"]', '2025-09-19 03:00:38', NULL, '2025-09-19 03:00:24', '2025-09-19 03:00:38'),
(25, 'App\\Models\\MediUser', 5, 'auth_token', 'fee6c66868df53e6ccb35d7d2f6839dd15ad663c8be379cbc2dce1b606a7eb5f', '[\"*\"]', '2025-09-19 03:06:34', NULL, '2025-09-19 03:00:36', '2025-09-19 03:06:34'),
(26, 'App\\Models\\MediUser', 5, 'auth_token', 'b402b5978d1c1fc7de4c368c2e13b029eb9907bdb121dcc6bd7a1f740ff18f0e', '[\"*\"]', '2025-09-19 03:08:21', NULL, '2025-09-19 03:06:32', '2025-09-19 03:08:21'),
(27, 'App\\Models\\MediUser', 5, 'auth_token', 'acf22b5fe6fd77582aed99fd11d788f733b17e6418f437d27e1e162120dda5aa', '[\"*\"]', '2025-09-19 03:10:39', NULL, '2025-09-19 03:08:19', '2025-09-19 03:10:39'),
(28, 'App\\Models\\MediUser', 5, 'auth_token', 'f109cce541902fc65472c77a2c1ade77f81dea8f6925fb0528cd676e862b7a25', '[\"*\"]', '2025-09-19 03:13:59', NULL, '2025-09-19 03:10:37', '2025-09-19 03:13:59'),
(29, 'App\\Models\\MediUser', 5, 'auth_token', 'e705bd8ebfb339ce40bec173dbe9f7924b41f026a56895a43aec40a6f669c235', '[\"*\"]', NULL, NULL, '2025-09-19 03:13:53', '2025-09-19 03:13:53'),
(30, 'App\\Models\\MediUser', 5, 'auth_token', 'cf7477bffd71202c39d8e889d303b635e01359406c922b4cdbe206ff77133677', '[\"*\"]', NULL, NULL, '2025-09-19 03:13:54', '2025-09-19 03:13:54'),
(31, 'App\\Models\\MediUser', 5, 'auth_token', '6059d050895e944c1ba453d740b15904bfecf50bf79c18f0b49806f2e224282d', '[\"*\"]', NULL, NULL, '2025-09-19 03:13:54', '2025-09-19 03:13:54'),
(32, 'App\\Models\\MediUser', 5, 'auth_token', '533f466de64fe2f4ec36276e0b0672656670c3c1d3bc2c83704dae8583a62b2a', '[\"*\"]', NULL, NULL, '2025-09-19 03:13:55', '2025-09-19 03:13:55'),
(33, 'App\\Models\\MediUser', 5, 'auth_token', '4342a785644648a5664606421c8bb6313d49c1a1f03b902b7fad2d280937614d', '[\"*\"]', NULL, NULL, '2025-09-19 03:13:55', '2025-09-19 03:13:55'),
(34, 'App\\Models\\MediUser', 5, 'auth_token', '4c6744facc5cabaa6d554e7e9dcf021b5cb49ca9da4ffeca42fbaaa87a3fb500', '[\"*\"]', NULL, NULL, '2025-09-19 03:13:55', '2025-09-19 03:13:55'),
(35, 'App\\Models\\MediUser', 5, 'auth_token', 'a060797e9e961033dc1895926d546fb8137dca1bf257fa6a7d475e12ae73ff73', '[\"*\"]', '2025-09-19 03:17:14', NULL, '2025-09-19 03:13:56', '2025-09-19 03:17:14'),
(36, 'App\\Models\\MediUser', 5, 'auth_token', '9aaae7a620c3977f8515b4a777746f102afa77abf4e280e5a80172bd22ddb0c8', '[\"*\"]', NULL, NULL, '2025-09-19 03:17:12', '2025-09-19 03:17:12'),
(37, 'App\\Models\\MediUser', 5, 'auth_token', '41841b114224efe2b5f4cc7b73eb3c93f0b717594dfda22f2019b537faa1ae17', '[\"*\"]', '2025-09-19 03:23:37', NULL, '2025-09-19 03:23:25', '2025-09-19 03:23:37'),
(38, 'App\\Models\\MediUser', 5, 'auth_token', 'cd6813b029adadb668f3647d2cf333c6da54decae2f1af3cbbc8e6211d4b861f', '[\"*\"]', '2025-09-19 03:23:49', NULL, '2025-09-19 03:23:35', '2025-09-19 03:23:49'),
(39, 'App\\Models\\MediUser', 5, 'auth_token', 'ae7a07ceb2d11e0cc538cfa2e29d4d2d4b46793440dbb24d92474aaa66a255b8', '[\"*\"]', NULL, NULL, '2025-09-19 03:24:04', '2025-09-19 03:24:04'),
(40, 'App\\Models\\MediUser', 5, 'auth_token', 'dfc0be38dfd80c36e02775ef32a5b8899d28f16217b0b17493b6795d443aa784', '[\"*\"]', NULL, NULL, '2025-09-19 03:24:28', '2025-09-19 03:24:28'),
(41, 'App\\Models\\MediUser', 5, 'auth_token', '2eaf6e6a99deed367b80787ad244adcb32770b10875742bcd543f6f11702c797', '[\"*\"]', '2025-09-19 03:24:43', NULL, '2025-09-19 03:24:33', '2025-09-19 03:24:43'),
(42, 'App\\Models\\MediUser', 5, 'auth_token', 'a25e621a536be44458bc8773646e5df662a09b6d00d824060cb8f3adcb8d3371', '[\"*\"]', '2025-09-19 03:28:21', NULL, '2025-09-19 03:24:41', '2025-09-19 03:28:21'),
(43, 'App\\Models\\MediUser', 5, 'auth_token', '27717f5a3ea02def891dea8ad5282efc87beeaa2d13521ef19541366b052488a', '[\"*\"]', '2025-09-19 03:36:34', NULL, '2025-09-19 03:28:19', '2025-09-19 03:36:34'),
(44, 'App\\Models\\MediUser', 5, 'auth_token', 'cc64c6e3748dcc7ce876c09123d62880441a3cf5ed9bdcc9e7008440db579b04', '[\"*\"]', '2025-09-19 05:04:44', NULL, '2025-09-19 03:36:32', '2025-09-19 05:04:44'),
(45, 'App\\Models\\MediUser', 4, 'auth_token', '5a1296eeb3089fcba88e419f7113c83377ca65128e4e1657cc3fca21b242346d', '[\"*\"]', NULL, NULL, '2025-09-19 03:45:23', '2025-09-19 03:45:23'),
(46, 'App\\Models\\MediUser', 5, 'auth_token', '3c72525510c3b0c1d174f0c2fc167f6935a553db3a0e2a34b103a0b47900c954', '[\"*\"]', NULL, NULL, '2025-09-19 03:45:36', '2025-09-19 03:45:36'),
(47, 'App\\Models\\MediUser', 5, 'auth_token', '90efb3b2404e35524db215ca842d2d25209fd68d3e030065dce67e6482c2bac6', '[\"*\"]', NULL, NULL, '2025-09-19 03:45:44', '2025-09-19 03:45:44'),
(48, 'App\\Models\\MediUser', 5, 'auth_token', '4f6809c11e0ea31416db5bd18ab29a8a966d2974122300b69570f31916dffe2d', '[\"*\"]', NULL, NULL, '2025-09-19 03:46:37', '2025-09-19 03:46:37'),
(49, 'App\\Models\\MediUser', 5, 'auth_token', '88a975cfa8046013ce9cbeac8af02c5edfe3482c2011922a3fed511f1fd75d77', '[\"*\"]', NULL, NULL, '2025-09-19 03:46:44', '2025-09-19 03:46:44'),
(50, 'App\\Models\\MediUser', 5, 'auth_token', 'e5a1dca6c236c31cc0dad29c7ab758c60d1941b2729d24c8307ed56a00b0b461', '[\"*\"]', NULL, NULL, '2025-09-19 03:46:53', '2025-09-19 03:46:53'),
(51, 'App\\Models\\MediUser', 5, 'auth_token', 'c2dfa00f8618d95c8d40aaefa92e0ed7bb8471af88ad3235aa02ddd9bc7f5112', '[\"*\"]', NULL, NULL, '2025-09-19 03:50:27', '2025-09-19 03:50:27'),
(52, 'App\\Models\\MediUser', 5, 'auth_token', 'd683ae4c94097d3267fa6bbe82882af12f92328ceec892588b26c6238de0a2e5', '[\"*\"]', NULL, NULL, '2025-09-19 03:52:47', '2025-09-19 03:52:47'),
(53, 'App\\Models\\MediUser', 5, 'auth_token', '526b1e9bc3a349f5bb8d516b732c370bd3547f0f4f8a862a49df0669b05736ba', '[\"*\"]', '2025-09-19 07:59:03', NULL, '2025-09-19 04:06:42', '2025-09-19 07:59:03'),
(54, 'App\\Models\\MediUser', 5, 'auth_token', '1071f3a648024b85771a751ae2066618a576fc4e4fca5a9433327554212056b2', '[\"*\"]', NULL, NULL, '2025-09-19 04:11:50', '2025-09-19 04:11:50'),
(55, 'App\\Models\\MediUser', 5, 'auth_token', '4b3b8cb4ecd97c25be95d5d5cb3b0cfef55cddf1dab14186a59700f66f9740af', '[\"*\"]', NULL, NULL, '2025-09-19 04:13:47', '2025-09-19 04:13:47'),
(56, 'App\\Models\\MediUser', 5, 'auth_token', '3a18b8de4cbfc209ffbcba142329ecc656a8f4a658899bbe7e686f36657c37c6', '[\"*\"]', NULL, NULL, '2025-09-19 04:15:01', '2025-09-19 04:15:01'),
(57, 'App\\Models\\MediUser', 5, 'auth_token', '3fed796b5dc497f6e963b307a715038f99324161050b562ed7e7e11600d4e61d', '[\"*\"]', NULL, NULL, '2025-09-19 04:15:58', '2025-09-19 04:15:58'),
(58, 'App\\Models\\MediUser', 5, 'auth_token', 'a0c0023b7388b7b2afe7bac7dbab41560a544fcc74430aa2ce3e1a690f6c3de8', '[\"*\"]', NULL, NULL, '2025-09-19 04:17:14', '2025-09-19 04:17:14'),
(59, 'App\\Models\\MediUser', 5, 'auth_token', '8890633857cef538e68c8fcb9aaec995353e2f03237153c4aecd16420f9b1232', '[\"*\"]', NULL, NULL, '2025-09-19 04:18:57', '2025-09-19 04:18:57'),
(60, 'App\\Models\\MediUser', 5, 'auth_token', '9460e08db3c0251117839b900c1a4c61df606f0955e3af554bf5975e4ed6ac03', '[\"*\"]', NULL, NULL, '2025-09-19 04:20:08', '2025-09-19 04:20:08'),
(61, 'App\\Models\\MediUser', 5, 'auth_token', '98ccd21c651d3ca4359545825a996967a97a547107f53359dbf0dfcf9c72a379', '[\"*\"]', NULL, NULL, '2025-09-18 21:23:44', '2025-09-18 21:23:44'),
(62, 'App\\Models\\MediUser', 5, 'auth_token', '4295d316c0b37c39950d5b938f7a19d55d1d44d4d6a3e0988abaee77ef3de030', '[\"*\"]', '2025-09-18 21:27:50', NULL, '2025-09-18 21:24:09', '2025-09-18 21:27:50'),
(63, 'App\\Models\\MediUser', 5, 'auth_token', '88ab9f823323a222213648ff473ec26dc082d8d10a21655b69db351889977296', '[\"*\"]', NULL, NULL, '2025-09-19 04:32:28', '2025-09-19 04:32:28'),
(64, 'App\\Models\\MediUser', 5, 'auth_token', '05f5c218e26e7e4c38302b01183d76947f47a3347e5f1bf75b69fcdebc1aeab0', '[\"*\"]', NULL, NULL, '2025-09-18 21:40:28', '2025-09-18 21:40:28'),
(65, 'App\\Models\\MediUser', 5, 'auth_token', 'e21ca5362519e9a8d511e73a11f524f9fca7cd5bc86b051a2ae43408a316980f', '[\"*\"]', NULL, NULL, '2025-09-19 05:02:21', '2025-09-19 05:02:21'),
(66, 'App\\Models\\MediUser', 5, 'auth_token', '79f110ae498c95e103c78c568576f6d8f62dd56a430499902ccec27ac32f2039', '[\"*\"]', '2025-09-19 05:23:37', NULL, '2025-09-19 05:04:36', '2025-09-19 05:23:37'),
(67, 'App\\Models\\MediUser', 5, 'auth_token', 'dd953beeb50c4350d490abcf72254b8b37c8d3135ed9617078dddf23ca85a45e', '[\"*\"]', NULL, NULL, '2025-09-19 05:23:54', '2025-09-19 05:23:54'),
(68, 'App\\Models\\MediUser', 5, 'auth_token', '58fb494c4a6c400d9c4c4578d7a185f6fa5231830c881aff7713f1b813d4fe0e', '[\"*\"]', NULL, NULL, '2025-09-19 05:23:58', '2025-09-19 05:23:58'),
(69, 'App\\Models\\MediUser', 5, 'auth_token', 'baaeb00893d832ee916dca5bac197a616540d76a7e0fbeb0a94e7403e0442ae0', '[\"*\"]', '2025-09-19 05:24:39', NULL, '2025-09-19 05:24:19', '2025-09-19 05:24:39'),
(70, 'App\\Models\\MediUser', 5, 'auth_token', '498969c0e7a70f65e0f6caeb7e90e1262876667ef2ef96178cbfb256d30027ec', '[\"*\"]', '2025-09-19 05:31:05', NULL, '2025-09-19 05:24:36', '2025-09-19 05:31:05'),
(71, 'App\\Models\\MediUser', 5, 'auth_token', '15540a4479d5603c8280b12f50a8a8d5f9a67b7275014ab043c0af6145085d89', '[\"*\"]', NULL, NULL, '2025-09-19 05:31:23', '2025-09-19 05:31:23'),
(72, 'App\\Models\\MediUser', 5, 'auth_token', '60042129d36a3efae60bbc658bd32953cbd413c581215e217a1af46cdadf5c32', '[\"*\"]', NULL, NULL, '2025-09-19 05:31:30', '2025-09-19 05:31:30'),
(73, 'App\\Models\\MediUser', 5, 'auth_token', '53e50422e1596de974e8b2639150a8954e0fbd42f3908c8316e6942147079ff4', '[\"*\"]', NULL, NULL, '2025-09-19 05:31:39', '2025-09-19 05:31:39'),
(74, 'App\\Models\\MediUser', 5, 'auth_token', '0c95af73ea82227b1526b91a664a5368616273751bd59ab49bf72898f183e697', '[\"*\"]', NULL, NULL, '2025-09-19 05:32:15', '2025-09-19 05:32:15'),
(75, 'App\\Models\\MediUser', 5, 'auth_token', 'c4a1a1b22d17dd71a05c5a42590ca8e22478630c5ea21ad2de583340db96534c', '[\"*\"]', NULL, NULL, '2025-09-19 05:32:22', '2025-09-19 05:32:22'),
(76, 'App\\Models\\MediUser', 5, 'auth_token', '16b098b6fe7bf6f5a0a942481c330b5fbdb0159ee74d2d8263bdbe3834905494', '[\"*\"]', NULL, NULL, '2025-09-19 05:32:37', '2025-09-19 05:32:37'),
(77, 'App\\Models\\MediUser', 5, 'auth_token', '5812ef45ff1732331fc7dbd481e47e09600fedb2b3ad652986058471fea2e620', '[\"*\"]', '2025-09-19 05:35:34', NULL, '2025-09-19 05:33:53', '2025-09-19 05:35:34'),
(78, 'App\\Models\\MediUser', 5, 'auth_token', '750c69b7c614160a89f9362ffcc0603e66feb336b8dde1a66c87be163f5b0f8c', '[\"*\"]', NULL, NULL, '2025-09-19 05:37:50', '2025-09-19 05:37:50'),
(79, 'App\\Models\\MediUser', 5, 'auth_token', '7c18f1acb2e06bcf9257571a9a95fa46defa540bdde297470240bb3f2baa4e9b', '[\"*\"]', '2025-09-19 05:39:54', NULL, '2025-09-19 05:39:03', '2025-09-19 05:39:54'),
(80, 'App\\Models\\MediUser', 5, 'auth_token', '31faf31e0cae192570aa86c410763fb2e3fd73c9e309a8dbe06739d58455fe91', '[\"*\"]', '2025-09-19 05:50:53', NULL, '2025-09-19 05:39:52', '2025-09-19 05:50:53'),
(81, 'App\\Models\\MediUser', 4, 'auth_token', '1b143077eef74f1d9d38dde72c31fff2ae033e4fdc73a2b6c51975fab30d5f69', '[\"*\"]', NULL, NULL, '2025-09-19 05:55:35', '2025-09-19 05:55:35'),
(82, 'App\\Models\\MediUser', 4, 'auth_token', '5ea5d2a2bd4873996122c9872d31c6056bbce20df2a30eb75f106fa1a8bd5f1d', '[\"*\"]', NULL, NULL, '2025-09-19 05:56:06', '2025-09-19 05:56:06'),
(83, 'App\\Models\\MediUser', 4, 'auth_token', '4561708e42d967a0133c2496d3bc83e1905dbf53080c48a239e0cc8d7b03bda8', '[\"*\"]', '2025-09-19 05:56:16', NULL, '2025-09-19 05:56:11', '2025-09-19 05:56:16'),
(84, 'App\\Models\\MediUser', 5, 'auth_token', '5edcaa748f79f4d624955c364f2cc583a2189ba3fed7b6eaa9473fad76c134ca', '[\"*\"]', '2025-09-19 06:08:15', NULL, '2025-09-19 06:01:16', '2025-09-19 06:08:15'),
(85, 'App\\Models\\MediUser', 5, 'auth_token', 'b1c3bc2ab9dfaf7facae9c576fbadcf2ea0d4b080ca2625a08b12b8e9848e166', '[\"*\"]', '2025-09-19 06:08:17', NULL, '2025-09-19 06:01:24', '2025-09-19 06:08:17'),
(86, 'App\\Models\\MediUser', 5, 'auth_token', '01dc1733d727092eb51d5d7c7e400904c070ff9edb68dfb52df75ce068f85807', '[\"*\"]', '2025-09-19 06:09:10', NULL, '2025-09-19 06:08:48', '2025-09-19 06:09:10'),
(87, 'App\\Models\\MediUser', 5, 'auth_token', '5aac3a2e3e34fdda1230bffcec90421d7a730dc5a1d81319cdf3136234f04806', '[\"*\"]', '2025-09-19 06:11:13', NULL, '2025-09-19 06:08:54', '2025-09-19 06:11:13'),
(88, 'App\\Models\\MediUser', 5, 'auth_token', '8eca7209d67466806a6b39076d08953e095a7d0cf2c294915ffb73bf02886399', '[\"*\"]', NULL, NULL, '2025-09-19 06:15:31', '2025-09-19 06:15:31'),
(89, 'App\\Models\\MediUser', 5, 'auth_token', '1475c46e8a57db63b601d5b8ef044244c6adad43391d256737dca9396e58fe9b', '[\"*\"]', '2025-09-19 06:19:22', NULL, '2025-09-19 06:15:37', '2025-09-19 06:19:22'),
(90, 'App\\Models\\MediUser', 5, 'auth_token', 'b1dabc756bf72556df34fe256d8aa86980e319dd22ad18258a493160daaa8b18', '[\"*\"]', NULL, NULL, '2025-09-19 06:15:45', '2025-09-19 06:15:45'),
(91, 'App\\Models\\MediUser', 4, 'auth_token', '7cffb7ec6ef789cab030ef0e415b04f10cd0b958bdef2310caedf6fa156ddbf1', '[\"*\"]', '2025-09-19 06:19:12', NULL, '2025-09-19 06:19:06', '2025-09-19 06:19:12'),
(92, 'App\\Models\\MediUser', 5, 'auth_token', 'a7e85d69394a61312530c6f795fb8dcc5524479d7d474ff019c0348701c0e82c', '[\"*\"]', '2025-09-19 06:27:18', NULL, '2025-09-19 06:19:19', '2025-09-19 06:27:18'),
(93, 'App\\Models\\MediUser', 4, 'auth_token', '60a3831e7a53474309f8c9c60fa0352079269694398dd90eb2e1863567f6eeed', '[\"*\"]', '2025-09-19 06:31:38', NULL, '2025-09-19 06:30:49', '2025-09-19 06:31:38'),
(94, 'App\\Models\\MediUser', 3, 'auth_token', '16feadeb4da1f813e4f3e84b2d7632c00a89a9b092768263d0b6481aaa755986', '[\"*\"]', '2025-09-19 06:35:28', NULL, '2025-09-19 06:32:40', '2025-09-19 06:35:28'),
(95, 'App\\Models\\MediUser', 5, 'auth_token', '65e606a57df99a1a6396c4967916f774f708344951046e7b82bcf20ee29acb21', '[\"*\"]', '2025-09-19 06:41:16', NULL, '2025-09-19 06:39:19', '2025-09-19 06:41:16'),
(96, 'App\\Models\\MediUser', 3, 'auth_token', '9c2f49e61cbe7269725364d64142257894d99d2c4ed5fe1470699e20e2cdff39', '[\"*\"]', NULL, NULL, '2025-09-19 06:42:33', '2025-09-19 06:42:33'),
(97, 'App\\Models\\MediUser', 5, 'auth_token', '531b28bc7342405d19612a8d0b94b9afeecd1b60024fe2a1267cfc1c2a1c0881', '[\"*\"]', '2025-09-19 06:51:52', NULL, '2025-09-19 06:43:41', '2025-09-19 06:51:52'),
(98, 'App\\Models\\MediUser', 5, 'auth_token', 'ff70763c96b56be501b833c7e8f193b925fc26139e5931ae446342de81ea08b3', '[\"*\"]', '2025-09-19 07:16:57', NULL, '2025-09-19 06:43:48', '2025-09-19 07:16:57'),
(99, 'App\\Models\\MediUser', 5, 'auth_token', 'bc9521d07e63a9379d9364ebaff76b38423f7dcd146959c56bcaa1da53681f13', '[\"*\"]', '2025-09-19 07:17:53', NULL, '2025-09-19 07:17:33', '2025-09-19 07:17:53'),
(100, 'App\\Models\\MediUser', 5, 'auth_token', '95ce95ed787355713dc4b128414cefdd13ee52878b237a3ab6ca978dc530a377', '[\"*\"]', '2025-09-19 07:18:14', NULL, '2025-09-19 07:17:42', '2025-09-19 07:18:14'),
(101, 'App\\Models\\MediUser', 5, 'auth_token', '26e32b625c7773b34ed4e78fd3ee3537ca652f6d8aee19af8a0e763844fdc552', '[\"*\"]', '2025-09-19 07:28:39', NULL, '2025-09-19 07:20:35', '2025-09-19 07:28:39'),
(102, 'App\\Models\\MediUser', 5, 'auth_token', 'f7c60726bad5af6204993b6657bcc420bb57764d3b2cfa351a046cf6d28002ca', '[\"*\"]', '2025-09-19 07:37:56', NULL, '2025-09-19 07:20:43', '2025-09-19 07:37:56'),
(103, 'App\\Models\\MediUser', 3, 'auth_token', 'b3284bfc891c029568180d25d3e9dc4a3878765bf317d3c222c15ae3070ae93d', '[\"*\"]', NULL, NULL, '2025-09-19 07:50:30', '2025-09-19 07:50:30'),
(104, 'App\\Models\\MediUser', 4, 'auth_token', 'd80fc9ec683134a259566b904213fdd4e6082d1641f88390d3fc77ec6381f2f4', '[\"*\"]', '2025-09-19 07:50:56', NULL, '2025-09-19 07:50:46', '2025-09-19 07:50:56'),
(105, 'App\\Models\\MediUser', 5, 'auth_token', '39cf6c06c3b1aa6604031925eb30ba6592d0ebcbc702afe16d5e6d6d43d3d654', '[\"*\"]', NULL, NULL, '2025-09-19 07:51:04', '2025-09-19 07:51:04'),
(106, 'App\\Models\\MediUser', 5, 'auth_token', '3ae17b83a004fc67b11614e81c7ea44ebdd1d825401f258da2cd1a648391ddfe', '[\"*\"]', '2025-09-19 07:51:16', NULL, '2025-09-19 07:51:06', '2025-09-19 07:51:16'),
(107, 'App\\Models\\MediUser', 5, 'auth_token', '78ea8026be0e7e38b891f18a33056b16b28b70861a214c3cb109f1e32ea06f23', '[\"*\"]', '2025-09-19 07:51:18', NULL, '2025-09-19 07:51:13', '2025-09-19 07:51:18'),
(108, 'App\\Models\\MediUser', 5, 'auth_token', '3d2acd782570b4a7f930031c614bb85a19da67564201e9899aec24ade32a4f36', '[\"*\"]', '2025-09-19 07:52:06', NULL, '2025-09-19 07:51:36', '2025-09-19 07:52:06'),
(109, 'App\\Models\\MediUser', 5, 'auth_token', '1e819990e8cbd33938a7afc0594f8df918788f42444b6a14ed4753a62113501a', '[\"*\"]', NULL, NULL, '2025-09-19 07:52:02', '2025-09-19 07:52:02'),
(110, 'App\\Models\\MediUser', 5, 'auth_token', '2e7455738ac8592f30201b4cfb0ab1bfaa442920eda3a16ea61404928578a7c0', '[\"*\"]', NULL, NULL, '2025-09-19 07:52:11', '2025-09-19 07:52:11'),
(111, 'App\\Models\\MediUser', 5, 'auth_token', 'd9b5adcb281588a1517f4f9175d50ca22b1a27df171d8014798639f9f66393f8', '[\"*\"]', NULL, NULL, '2025-09-19 07:52:21', '2025-09-19 07:52:21'),
(112, 'App\\Models\\MediUser', 5, 'auth_token', '55fc14f65a6b5ac007b1f36f5c274f8e3b2d017af3c53da8ef5fbb12c5f474f0', '[\"*\"]', NULL, NULL, '2025-09-19 07:53:49', '2025-09-19 07:53:49'),
(113, 'App\\Models\\MediUser', 5, 'auth_token', 'a5cee6ed90cafcc8893c8aaf6766f2a9eca4f7d254fb84e99e416988f806e383', '[\"*\"]', '2025-09-19 07:56:02', NULL, '2025-09-19 07:55:29', '2025-09-19 07:56:02'),
(114, 'App\\Models\\MediUser', 5, 'auth_token', '3f85a21602b8e9cfeaf27e17fec0b8fb0e37ea061d7be5ee602a7f785ecc1f77', '[\"*\"]', NULL, NULL, '2025-09-19 07:55:58', '2025-09-19 07:55:58'),
(115, 'App\\Models\\MediUser', 5, 'auth_token', '92f4bf4bc319c45756bd5fadc55f0389d0d9a413bc9fa91f19476f57fabed2d6', '[\"*\"]', '2025-09-19 07:57:31', NULL, '2025-09-19 07:57:25', '2025-09-19 07:57:31'),
(116, 'App\\Models\\MediUser', 5, 'auth_token', 'af371f9328fb60f5894e4c0a25d096dd714ef219e8f08da337fb44842dc214e3', '[\"*\"]', '2025-09-19 07:57:42', NULL, '2025-09-19 07:57:36', '2025-09-19 07:57:42'),
(117, 'App\\Models\\MediUser', 5, 'auth_token', '7acdc587015172af971181aaee6f4d549c2bd4ddaca0e1b588d5459f8639d44e', '[\"*\"]', NULL, NULL, '2025-09-19 07:58:01', '2025-09-19 07:58:01'),
(118, 'App\\Models\\MediUser', 5, 'auth_token', 'db88316676c185b8c5ec83a7ad504903ebd18731a2a1da222b0ac2816bfc99ea', '[\"*\"]', NULL, NULL, '2025-09-19 07:58:07', '2025-09-19 07:58:07'),
(119, 'App\\Models\\MediUser', 4, 'auth_token', 'c555abecce645f1d592ff65427804cbf8cabdf22897a263605d84b3831dd2e69', '[\"*\"]', NULL, NULL, '2025-09-19 07:58:23', '2025-09-19 07:58:23'),
(120, 'App\\Models\\MediUser', 5, 'auth_token', '74959f7b39fa3855209d14e7f6d0d65aff3d0233e4d498066de454b5aec925d9', '[\"*\"]', NULL, NULL, '2025-09-19 07:58:30', '2025-09-19 07:58:30'),
(121, 'App\\Models\\MediUser', 5, 'auth_token', '9fe7873a5e96601afcff0193bbce79b48f0a29848cfc12491f37ed59ce64c2fd', '[\"*\"]', NULL, NULL, '2025-09-19 07:59:10', '2025-09-19 07:59:10'),
(122, 'App\\Models\\MediUser', 5, 'auth_token', '41fc7a48b71270760d49e36c3adcab250fa1c7185bafacaa042c002e164f141d', '[\"*\"]', NULL, NULL, '2025-09-19 07:59:30', '2025-09-19 07:59:30'),
(123, 'App\\Models\\MediUser', 5, 'auth_token', 'ffded3784652edd466f2e1a83653b9e4bce2341b24eb00910cd97b49073e6bfc', '[\"*\"]', NULL, NULL, '2025-09-19 07:59:46', '2025-09-19 07:59:46'),
(124, 'App\\Models\\MediUser', 4, 'auth_token', '6497c207313295e0a9d2cedd85e6c89f5d3c1432f9575dc478d52787136293e1', '[\"*\"]', '2025-09-19 08:00:14', NULL, '2025-09-19 08:00:09', '2025-09-19 08:00:14'),
(125, 'App\\Models\\MediUser', 5, 'auth_token', 'b3090d3d815d32e94d4b915be12ebd901df81009463da098a841808c6d4b50e5', '[\"*\"]', NULL, NULL, '2025-09-19 08:01:09', '2025-09-19 08:01:09'),
(126, 'App\\Models\\MediUser', 5, 'auth_token', '0e36dae7d38366e2c7479cb112219910dc4f7841a91c8932de5b7a7195f893d2', '[\"*\"]', '2025-09-19 08:03:21', NULL, '2025-09-19 08:02:00', '2025-09-19 08:03:21'),
(127, 'App\\Models\\MediUser', 5, 'auth_token', '60c9bd9497e14afce7323f4a7862caa296503d1c0ba7bc379a50b064c02043db', '[\"*\"]', '2025-09-19 08:04:15', NULL, '2025-09-19 08:03:27', '2025-09-19 08:04:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Doctor'),
(3, 'Patient');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `role` varchar(255) DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `idx_patient_id` (`patient_id`),
  ADD KEY `idx_availability_id` (`availability_id`);

--
-- Chỉ mục cho bảng `availability_schedulings`
--
ALTER TABLE `availability_schedulings`
  ADD PRIMARY KEY (`availability_id`),
  ADD KEY `idx_doctor_id` (`doctor_id`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`city_id`);

--
-- Chỉ mục cho bảng `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Chỉ mục cho bảng `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`content_id`),
  ADD KEY `idx_category_id` (`category_id`),
  ADD KEY `idx_created_by` (`created_by`),
  ADD KEY `idx_doctor_id` (`doctor_id`);

--
-- Chỉ mục cho bảng `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`doctor_id`),
  ADD KEY `idx_city_id` (`city_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `medical_records_appointment_id_foreign` (`appointment_id`);

--
-- Chỉ mục cho bảng `medi_users`
--
ALTER TABLE `medi_users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idx_role_id` (`role_id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_appointment_id_foreign` (`appointment_id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`),
  ADD KEY `notifications_role_id_foreign` (`role_id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `availability_schedulings`
--
ALTER TABLE `availability_schedulings`
  MODIFY `availability_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `cities`
--
ALTER TABLE `cities`
  MODIFY `city_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `message_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `contents`
--
ALTER TABLE `contents`
  MODIFY `content_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `doctors`
--
ALTER TABLE `doctors`
  MODIFY `doctor_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `record_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `medi_users`
--
ALTER TABLE `medi_users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointment_availability` FOREIGN KEY (`availability_id`) REFERENCES `availability_schedulings` (`availability_id`),
  ADD CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Các ràng buộc cho bảng `availability_schedulings`
--
ALTER TABLE `availability_schedulings`
  ADD CONSTRAINT `fk_availability_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

--
-- Các ràng buộc cho bảng `contents`
--
ALTER TABLE `contents`
  ADD CONSTRAINT `fk_contents_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_contents_creator` FOREIGN KEY (`created_by`) REFERENCES `medi_users` (`user_id`),
  ADD CONSTRAINT `fk_contents_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

--
-- Các ràng buộc cho bảng `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `fk_doctor_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`),
  ADD CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `medi_users` (`user_id`);

--
-- Các ràng buộc cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `medi_users`
--
ALTER TABLE `medi_users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `medi_users` (`user_id`);

--
-- Các ràng buộc cho bảng `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `fk_patient_user` FOREIGN KEY (`user_id`) REFERENCES `medi_users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
