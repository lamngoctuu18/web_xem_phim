import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FiHeart, FiClock, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Phim Lẻ', path: '/danh-sach/phim-le' },
    { name: 'Phim Bộ', path: '/danh-sach/phim-bo' },
    { name: 'TV Shows', path: '/danh-sach/tv-shows' },
    { name: 'Hoạt Hình', path: '/danh-sach/hoat-hinh' },
  ];

  const countries = [
    { name: 'Hàn Quốc', path: '/quoc-gia/han-quoc' },
    { name: 'Trung Quốc', path: '/quoc-gia/trung-quoc' },
    { name: 'Nhật Bản', path: '/quoc-gia/nhat-ban' },
    { name: 'Âu Mỹ', path: '/quoc-gia/au-my' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-dark via-dark-lighter to-dark-light border-t border-white/10 mt-20 overflow-hidden">
      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-primary text-4xl font-bold group-hover:scale-110 transition-transform">🎬</span>
              <span className="text-3xl font-bold text-white">
                My<span className="text-primary">Movie</span>
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Nền tảng xem phim trực tuyến hàng đầu với hàng nghìn bộ phim chất lượng cao, 
              cập nhật liên tục mỗi ngày. Trải nghiệm giải trí đỉnh cao cùng MyMovie.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-primary p-3 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <FaFacebook size={20} className="text-white" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary p-3 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <FaTwitter size={20} className="text-white" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary p-3 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <FaYoutube size={20} className="text-white" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary p-3 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                <FaInstagram size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Danh Mục
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-red-500" />
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quốc Gia
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-red-500" />
            </h3>
            <ul className="space-y-3">
              {countries.map((country) => (
                <li key={country.path}>
                  <Link
                    to={country.path}
                    className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Liên Kết
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-red-500" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/yeu-thich" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <FiHeart size={16} />
                  Yêu Thích
                </Link>
              </li>
              <li>
                <Link to="/lich-su" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <FiClock size={16} />
                  Lịch Sử
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <FiMail size={16} />
                  Liên Hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} <span className="text-white font-semibold">MyMovie</span>. All rights reserved. 
              <span className="text-gray-500"> | </span>
              <span className="text-primary">Powered by Ophim API</span>
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều Khoản</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Chính Sách</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
