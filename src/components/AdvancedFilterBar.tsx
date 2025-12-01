import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCategories, getCountries, getYears } from '../services/api';
import type { FilterItem, YearItem } from '../types/movie';
import { FiFilm, FiGlobe, FiCalendar, FiChevronDown, FiX, FiRefreshCw } from 'react-icons/fi';

interface SelectedFilter {
  type: 'category' | 'country' | 'year';
  slug: string;
  name: string;
}

const AdvancedFilterBar = () => {
  const [categories, setCategories] = useState<FilterItem[]>([]);
  const [countries, setCountries] = useState<FilterItem[]>([]);
  const [years, setYears] = useState<YearItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilter[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryData, countryData, yearData] = await Promise.all([
          getCategories(),
          getCountries(),
          getYears(),
        ]);
        setCategories(categoryData);
        setCountries(countryData);
        setYears(yearData.slice().sort((a, b) => b.year - a.year));
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (type: 'category' | 'country' | 'year', slug: string, name: string) => {
    setSelectedFilters((prev) => {
      const filtered = prev.filter((f) => f.type !== type);
      return [...filtered, { type, slug, name }];
    });
    setActiveDropdown(null);
    handleNavigateToFilter({ type, slug, name });
  };

  const handleRemoveFilter = (index: number) => {
    const removed = selectedFilters[index];
    setSelectedFilters(selectedFilters.filter((_, i) => i !== index));
    if (removed && removed.type) {
      navigate('/');
    }
  };

  const handleResetFilters = () => {
    setSelectedFilters([]);
    setActiveDropdown(null);
    navigate('/');
  };

  const handleNavigateToFilter = (filter: SelectedFilter) => {
    const pathMap = {
      category: '/the-loai',
      country: '/quoc-gia',
      year: '/nam-phat-hanh',
    };
    navigate(`${pathMap[filter.type]}/${filter.slug}`);
  };

  const filterButtons = [
    {
      id: 'category',
      label: 'Thể loại',
      icon: <FiFilm size={18} />,
      items: categories.map(c => ({ slug: c.slug, name: c.name })),
      type: 'category' as const,
    },
    {
      id: 'country',
      label: 'Quốc gia',
      icon: <FiGlobe size={18} />,
      items: countries.map(c => ({ slug: c.slug, name: c.name })),
      type: 'country' as const,
    },
    {
      id: 'year',
      label: 'Năm',
      icon: <FiCalendar size={18} />,
      items: years.map(y => ({ slug: String(y.year), name: String(y.year) })),
      type: 'year' as const,
    },
  ];

  return (
    <div
      className="w-full flex flex-col items-center gap-4 mt-12 relative z-20"
      ref={dropdownRef}
    >
      {/* Filter Bar */}
      <div className="w-full max-w-5xl bg-dark-lighter/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {filterButtons.map((filter) => {
            const isActive = selectedFilters.some((f) => f.type === filter.type);
            return (
              <div key={filter.id} className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === filter.id ? null : filter.id)}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border ${
                  activeDropdown === filter.id
                    ? 'bg-gradient-to-r from-primary to-red-500 text-white shadow-lg shadow-primary/50 scale-105 border-transparent'
                    : isActive
                      ? 'bg-dark text-white border-primary/60 shadow-lg shadow-primary/30'
                      : 'bg-dark-light/50 text-gray-300 hover:bg-dark-light hover:text-white border-white/5 hover:border-primary/50'
                }`}
              >
                <span className={activeDropdown === filter.id || isActive ? 'text-white' : 'text-primary'}>
                  {filter.icon}
                </span>
                <span>{filter.label}</span>
                <FiChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    activeDropdown === filter.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {activeDropdown === filter.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[600px] max-w-[90vw] bg-dark-lighter/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar"
                  >
                    <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {filter.items.slice(0, 30).map((item) => {
                        const isSelected = selectedFilters.some(
                          f => f.type === filter.type && f.slug === item.slug
                        );
                        return (
                          <button
                            key={item.slug}
                            onClick={() => handleFilterSelect(filter.type, item.slug, item.name)}
                            className={`group relative px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                              isSelected
                                ? 'bg-gradient-to-r from-primary to-red-500 text-white shadow-lg shadow-primary/50'
                                : 'bg-dark-light/50 text-gray-300 hover:bg-primary/20 hover:text-white border border-white/5 hover:border-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105'
                            }`}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            );
          })}

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 bg-dark-light/50 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/30"
          >
            <FiRefreshCw size={16} className="text-primary" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Selected Filters Tags */}
      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {selectedFilters.map((filter, index) => (
              <motion.div
                key={`${filter.type}-${filter.slug}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-2 bg-gradient-to-r from-primary to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
              >
                <button
                  onClick={() => handleNavigateToFilter(filter)}
                  className="hover:underline"
                >
                  {filter.name}
                </button>
                <button
                  onClick={() => handleRemoveFilter(index)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  aria-label="Remove filter"
                >
                  <FiX size={14} />
                </button>
              </motion.div>
            ))}
            <button
              onClick={() => setSelectedFilters([])}
              className="flex items-center gap-2 bg-dark-lighter/80 hover:bg-dark-light text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <FiX size={14} />
              Xóa tất cả
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #e50914, #b20710);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ff0a16, #e50914);
        }
      `}</style>
    </div>
  );
};

export default AdvancedFilterBar;
