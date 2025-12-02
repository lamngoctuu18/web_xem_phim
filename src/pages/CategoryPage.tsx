import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getMoviesByCategory,
  getMoviesByCountry,
  getMoviesByYear,
  getMovieListBySlug,
} from '../services/api';
import type { Movie, PaginatedResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import batLucGif from '../assets/batluccute.gif';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageTitle, setPageTitle] = useState('Danh Sách Phim');

  const baseSegment = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return (segments[0] || 'danh-sach') as 'danh-sach' | 'the-loai' | 'quoc-gia' | 'nam-phat-hanh';
  }, [location.pathname]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, baseSegment]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!category) return;

      try {
        setLoading(true);
        let data: PaginatedResponse<Movie>;

        if (baseSegment === 'quoc-gia') {
          data = await getMoviesByCountry(category, currentPage);
        } else if (baseSegment === 'nam-phat-hanh') {
          data = await getMoviesByYear(category, currentPage);
        } else if (baseSegment === 'the-loai') {
          data = await getMoviesByCategory(category, currentPage);
        } else {
          data = await getMovieListBySlug(category, { page: currentPage });
        }

        setMovies(data.items ?? []);
        setTotalPages(data.pagination.totalPages);
        const breadcrumbName = data.breadCrumb?.slice(-1)[0]?.name;
        const fallbackTitle = category
          ? category
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          : undefined;
        setPageTitle(breadcrumbName || data.titlePage || fallbackTitle || 'Danh Sách Phim');
      } catch (error) {
        console.error('Error fetching category movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    window.scrollTo(0, 0);
  }, [category, currentPage]);

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {pageTitle}
          </h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              {movies.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    {movies.map((movie) => (
                      <MovieCard key={movie._id} movie={movie} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-dark-lighter text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors"
                      >
                        Trước
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-primary text-white'
                                  : 'bg-dark-lighter text-white hover:bg-dark-light'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-dark-lighter text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary transition-colors"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <img src={batLucGif} alt="Không tìm thấy" className="h-32 w-auto mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Không tìm thấy phim nào trong danh mục này
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
