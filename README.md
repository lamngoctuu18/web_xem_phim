# Web Xem Phim ▸ React + TypeScript Movie Streaming UI

Web Xem Phim là giao diện xem phim hiện đại, tối ưu cho trải nghiệm duyệt và xem phim trực tuyến trên mọi thiết bị. Ứng dụng được xây dựng bằng React + TypeScript, tận dụng Vite để có tốc độ phát triển siêu nhanh và Tailwind CSS để thiết kế giao diện dark mode tinh tế.

<div align="center">

| 🚀 Trạng thái | ✅ Production-ready | `npm run build` |
|--------------|--------------------|-----------------|

</div>

## 📋 Mục lục

- [✨ Điểm nổi bật](#-điểm-nổi-bật)
- [🧱 Kiến trúc & luồng dữ liệu](#-kiến-trúc--luồng-dữ-liệu)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Yêu cầu & Cài đặt](#️-yêu-cầu--cài-đặt)
- [▶️ Các lệnh npm](#️-các-lệnh-npm)
- [🗂️ Cấu trúc thư mục](#️-cấu-trúc-thư-mục)
- [🔌 Tích hợp API Ophim](#-tích-hợp-api-ophim)
- [💡 Ghi chú phát triển](#-ghi-chú-phát-triển)
- [🤝 Đóng góp](#-đóng-góp)

## ✨ Điểm nổi bật

- **UI giàu trải nghiệm**: Hero banner, slider động, skeleton loading, hiệu ứng motion mượt với Framer Motion và Swiper.
- **Tương tác người dùng**: Lưu phim yêu thích, lịch sử xem (localStorage), toast thông báo thân thiện.
- **Bộ lọc thông minh**: Dropdown thể loại/quốc gia/năm, tìm kiếm với gợi ý nhanh và delay debounce.
- **Trang chi tiết phong phú**: Trailer, danh sách tập, diễn viên, từ khóa liên quan, ảnh hậu trường.
- **Trình phát tương thích**: Sẵn sàng tích hợp HLS.js và React Player để stream mượt với nhiều nguồn.
- **Dark mode by design**: Tailwind CSS tùy biến theme màu đậm, responsive từ mobile tới desktop.

## 🧱 Kiến trúc & luồng dữ liệu

```
React Router (routes/pages)
│
├─ pages/             → Home, Category, Detail, Search, Watch, Favorites, History
├─ components/        → HeroSection, MovieCard, Navbar, Tooltip, Toast, MovieSlider...
├─ hooks/
│   ├─ useFavorites   → Quản lý danh sách yêu thích (localStorage + toast)
│   └─ useWatchHistory→ Ghi nhận lịch sử xem phim
├─ services/api.ts    → Axios client gọi Ophim API (đồng bộ hóa pagination)
└─ types/movie.ts     → Định nghĩa type TypeScript cho dữ liệu phim
```

1. **Dữ liệu** được lấy từ Ophim API thông qua `services/api.ts`, có cơ chế normalize pagination.
2. **State** trong trang và component dùng React Hooks + TypeScript đảm bảo an toàn kiểu dữ liệu.
3. **UI** render sử dụng Tailwind CSS + Framer Motion + Swiper tạo trải nghiệm mượt.
4. **Persistence**: Favorites & history được lưu localStorage qua custom hooks.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5, React Router DOM 7
- **UI/UX**: Tailwind CSS 3, Framer Motion 12, Swiper 12, Floating UI, React Icons
- **Streaming**: HLS.js, React Player
- **HTTP**: Axios với cấu hình timeout/error handling riêng
- **Tooling**: Vite 7, ESLint 9, Tailwind + PostCSS, TypeScript project references

## ⚙️ Yêu cầu & Cài đặt

```bash
# 1. Clone repository
git clone https://github.com/lamngoctuu18/web_xem_phim.git
cd web_xem_phim

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env (tùy chọn)
# Vite hỗ trợ biến môi trường dạng VITE_*
cp .env.example .env.local  # nếu muốn override cấu hình API
```

> Mặc định ứng dụng trỏ tới `https://ophim1.com/v1/api` (cấu hình trong `src/services/api.ts`). Bạn có thể thay đổi bằng biến môi trường `VITE_API_URL` và cập nhật axios client khi cần.

## ▶️ Các lệnh npm

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Khởi chạy Vite dev server (mặc định cổng 5173). |
| `npm run build` | Biên dịch TypeScript + build production.`dist/` sinh ra bundle tối ưu. |
| `npm run preview` | Chạy thử bản build production trên local. |
| `npm run lint` | Chạy ESLint với cấu hình TypeScript full strict. |

## 🗂️ Cấu trúc thư mục

```
src/
├─ assets/              # Logo, gif động hỗ trợ UI (loading, search, stickers)
├─ components/          # Thành phần UI tái sử dụng (Navbar, MovieSlider, Tooltip...)
├─ hooks/               # Custom hooks (favorites, history)
├─ pages/               # Các trang chính (Home, Category, Detail, Watch, Search...)
├─ services/            # Lớp gọi API Ophim, normalize dữ liệu
├─ types/               # Định nghĩa interface/type TypeScript
├─ App.tsx              # Định tuyến và layout gốc
└─ main.tsx             # Điểm vào React + cấu hình Provider

tmp_*.json              # Bộ dữ liệu mẫu để mock nội dung khi dev offline
vite.config.ts          # Cấu hình Vite + alias
tailwind.config.js      # Cấu hình theme Tailwind, màu dark
tsconfig*.json          # Chia nhỏ cấu hình TS cho app/node
```

## 🔌 Tích hợp API Ophim

- **Endpoint chính**: `https://ophim1.com/v1/api`
- `getHomeData` lấy phim nổi bật, danh sách mới cập nhật.
- `getMovieListBySlug`, `getMoviesByCategory/Country/Year` hỗ trợ phân trang tự động.
- `searchMovies` cho phép tìm kiếm keyword + pagination.
- `getMovieDetail`, `getMovieImages`, `getMoviePeoples`, `getMovieKeywords` tập hợp dữ liệu chi tiết.
- Mỗi response được normalize để có `pagination.totalPages`, phù hợp với UI phân trang tùy biến.

## 💡 Ghi chú phát triển

- **Tailwind**: Các màu `bg-dark`, `bg-dark-lighter`, `text-primary` được định nghĩa trong `tailwind.config.js`.
- **Responsive**: Layout tối ưu cho mobile trước, slider và hero co giãn mượt nhờ Swiper.
- **Thông báo**: React Toastify được cấu hình trong `components/Toast.tsx` (đừng quên render `<Toast />` ở `App.tsx`).
- **Tooltip**: `components/Tooltip.tsx` sử dụng Floating UI + Framer Motion để hiển thị mượt.
- **Skeleton**: `SkeletonCard` tạo placeholder khi chờ dữ liệu.
- **Video Player**: Trang xem phim (`WatchPage`) sẵn sàng thay đổi nguồn HLS hoặc iframe tùy nhà cung cấp.

## 🤝 Đóng góp

1. Fork repository & tạo branch từ `master`.
2. Giữ phong cách code với ESLint & Prettier (cấu hình có sẵn).
3. Commit theo chuẩn nhỏ gọn, có ý nghĩa.
4. Tạo Pull Request mô tả chi tiết thay đổi kèm ảnh GIF (nếu liên quan UI).

---

> Web Xem Phim hướng tới trải nghiệm xem phim trực tuyến đẹp mắt và tiện lợi cho cộng đồng. Nếu bạn có ý tưởng hoặc muốn tích hợp thêm nguồn dữ liệu mới, đừng ngần ngại mở issue hoặc PR! ❤️
