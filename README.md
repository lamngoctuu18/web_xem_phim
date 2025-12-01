# Web Xem Phim

Một ứng dụng web đơn giản để xem phim trực tuyến, được xây dựng bằng React, TypeScript và Vite.

## Mô tả

Dự án này là một trang web xem phim trực tuyến cho phép người dùng duyệt, tìm kiếm, xem chi tiết phim, thêm vào danh sách yêu thích và theo dõi lịch sử xem. Ứng dụng sử dụng API để lấy dữ liệu phim và hiển thị giao diện thân thiện với người dùng.

## Tính năng

- **Trang chủ**: Hiển thị các phim nổi bật, slider phim.
- **Danh mục**: Lọc phim theo thể loại, quốc gia, năm phát hành.
- **Tìm kiếm**: Tìm kiếm phim theo từ khóa.
- **Chi tiết phim**: Xem thông tin chi tiết, diễn viên, trailer.
- **Xem phim**: Phát phim trực tuyến.
- **Yêu thích**: Thêm/xóa phim khỏi danh sách yêu thích.
- **Lịch sử**: Theo dõi lịch sử xem phim.
- **Responsive**: Giao diện tương thích với mobile và desktop.

## Công nghệ sử dụng

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **Linting**: ESLint
- **Icons**: (Giả sử sử dụng các icon, có thể thêm nếu cần)
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router (giả sử có trong code)
- **API**: Axios hoặc Fetch API (từ file api.ts)

## Cài đặt

1. Clone repository:
   ```bash
   git clone https://github.com/lamngoctuu18/web_xem_phim.git
   cd web_xem_phim
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

## Chạy dự án

Để chạy dự án ở chế độ development:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu được cấu hình).

## Build sản xuất

Để build dự án cho production:
```bash
npm run build
```

Để preview build:
```bash
npm run preview
```

## Cấu trúc dự án

```
web_xem_phim/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons
│   ├── components/         # Reusable components (Navbar, MovieCard, etc.)
│   ├── hooks/              # Custom hooks (useFavorites, useWatchHistory)
│   ├── pages/              # Page components (HomePage, MovieDetailPage, etc.)
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── tmp_*.json              # Sample data files
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── eslint.config.js        # ESLint config
└── tsconfig*.json          # TypeScript configs
```

## API

Dự án sử dụng API từ nguồn bên ngoài để lấy dữ liệu phim. Chi tiết cấu hình API trong file `src/services/api.ts`.

## Dữ liệu mẫu

Các file `tmp_*.json` chứa dữ liệu mẫu cho development và testing.

## Đóng góp

Nếu bạn muốn đóng góp cho dự án:
1. Fork repository
2. Tạo branch mới: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Tạo Pull Request

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub hoặc liên hệ qua email.
