import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, useRef } from 'react';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiHeart, FiClock } from 'react-icons/fi';
import searchGif from '../assets/search.gif';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories, getCountries, getYears, searchMovies } from '../services/api';
import type { FilterItem, YearItem, Movie } from '../types/movie';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryItems, setCategoryItems] = useState<FilterItem[]>([]);
  const [countryItems, setCountryItems] = useState<FilterItem[]>([]);
  const [yearItems, setYearItems] = useState<YearItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categories, countries, years] = await Promise.all([
          getCategories(),
          getCountries(),
          getYears(),
        ]);
        setCategoryItems(categories);
        setCountryItems(countries);
        setYearItems(years.slice().sort((a, b) => b.year - a.year));
      } catch (error) {
        console.error('Error fetching navbar filters:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchMovies(searchQuery.trim(), 1);
          setSearchResults(results.items.slice(0, 5));
          setShowSearchDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearchDropdown(false);
    }
  };

  const handleSearchResultClick = (slug: string) => {
    navigate(`/phim/${slug}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const menuItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Phim Lẻ', path: '/danh-sach/phim-le' },
    { name: 'Phim Bộ', path: '/danh-sach/phim-bo' },
    { name: 'TV Shows', path: '/danh-sach/tv-shows' },
    { name: 'Hoạt Hình', path: '/danh-sach/hoat-hinh' },
  ];

  const dropdownConfig = useMemo(
    () => [
      {
        id: 'category',
        label: 'Thể loại',
        items: categoryItems,
        buildLink: (slug: string) => `/the-loai/${slug}`,
      },
      {
        id: 'country',
        label: 'Quốc gia',
        items: countryItems,
        buildLink: (slug: string) => `/quoc-gia/${slug}`,
      },
      {
        id: 'year',
        label: 'Năm',
        items: yearItems.map((item) => ({ _id: String(item.year), name: String(item.year), slug: String(item.year) })),
        buildLink: (slug: string) => `/nam-phat-hanh/${slug}`,
      },
    ],
    [categoryItems, countryItems, yearItems]
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/10" ref={dropdownRef}>
      <div className="container mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-primary text-3xl font-bold">🎬</span>
            <span className="text-3xl font-bold text-white">
              My<span className="text-primary">Movie</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {dropdownConfig.map((dropdown) => (
              <div key={dropdown.id} className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === dropdown.id ? null : dropdown.id))
                  }
                  className={`flex items-center gap-1 font-medium text-gray-300 hover:text-primary transition-colors duration-300 ${
                    activeDropdown === dropdown.id ? 'text-primary' : ''
                  }`}
                >
                  {dropdown.label}
                  <FiChevronDown
                    className={`transition-transform duration-300 ${
                      activeDropdown === dropdown.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === dropdown.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-3 w-64 max-h-80 overflow-y-auto rounded-xl bg-dark-lighter/95 backdrop-blur border border-white/10 shadow-2xl custom-scrollbar"
                    >
                      <div className="grid grid-cols-1 gap-2 p-4">
                        {dropdown.items.slice(0, 30).map((item) => (
                          <Link
                            key={`navbar-${dropdown.id}-${item.slug}`}
                            to={dropdown.buildLink(item.slug)}
                            onClick={() => setActiveDropdown(null)}
                            className="text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Favorite, History, and Search */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link
              to="/yeu-thich"
              className="text-gray-300 hover:text-primary transition-colors duration-300"
              aria-label="Yêu thích"
            >
              <FiHeart size={22} />
            </Link>

            <Link
              to="/lich-su"
              className="text-gray-300 hover:text-primary transition-colors duration-300"
              aria-label="Lịch sử"
            >
              <FiClock size={22} />
            </Link>

            <form onSubmit={handleSearch} className="flex items-center relative gap-2">
              {isSearchFocused && (
                <img src={searchGif} alt="Search" className="h-10 w-auto" />
              )}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    searchResults.length > 0 && setShowSearchDropdown(true);
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  className="bg-dark-lighter text-white pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-48 lg:w-56 xl:w-64 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  <FiSearch size={20} />
                </button>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {showSearchDropdown && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-dark-lighter/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {searchResults.map((movie) => (
                        <button
                          key={movie._id}
                          onClick={() => handleSearchResultClick(movie.slug)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-left"
                        >
                          <img
                            src={`https://img.ophim.live/uploads/movies/${movie.thumb_url}`}
                            alt={movie.name}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{movie.name}</p>
                            <p className="text-gray-400 text-xs">{movie.year} • {movie.quality}</p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full p-3 text-primary hover:bg-white/10 transition-colors text-sm font-semibold border-t border-white/10"
                      >
                        Xem tất cả kết quả →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading indicator */}
                {isSearching && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-lighter border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm phim..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-dark text-white pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <FiSearch size={20} />
                  </button>
                </div>
              </form>

              {/* Mobile Menu Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 hover:text-primary transition-colors duration-300 font-medium py-2"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                to="/yeu-thich"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                <FiHeart size={20} />
                <span>Yêu Thích</span>
              </Link>

              <Link
                to="/lich-su"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                <FiClock size={20} />
                <span>Lịch Sử</span>
              </Link>

              <div className="border-t border-white/10 pt-4">
                {dropdownConfig.map((dropdown) => (
                  <details key={`mobile-${dropdown.id}`} className="mb-4">
                    <summary className="text-white font-semibold mb-2 cursor-pointer hover:text-primary transition-colors list-none flex items-center justify-between">
                      <span>{dropdown.label}</span>
                      <FiChevronDown className="transition-transform" />
                    </summary>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {dropdown.items.slice(0, 12).map((item) => (
                        <Link
                          key={`mobile-${dropdown.id}-${item.slug}`}
                          to={dropdown.buildLink(item.slug)}
                          onClick={() => setIsMenuOpen(false)}
                          className="bg-dark hover:bg-primary text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
