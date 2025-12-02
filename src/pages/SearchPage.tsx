import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchMovies } from '../services/api';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import batLucGif from '../assets/batluccute.gif';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setMovies([]);
        setTotalResults(0);
        return;
      }

      try {
        setLoading(true);
        const results = await searchMovies(query);
        setMovies(results.items ?? []);
        setTotalResults(results.pagination.totalItems);
      } catch (error) {
        console.error('Error searching movies:', error);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Kết quả tìm kiếm
          </h1>
          {query && (
            <p className="text-gray-400 mb-8">
              Tìm kiếm cho: <span className="text-primary font-semibold">"{query}"</span>
              {!loading && ` - ${totalResults} kết quả`}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-20">
              <img src={batLucGif} alt="Không tìm thấy" className="h-32 w-auto mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                Không tìm thấy kết quả nào cho "{query}"
              </p>
              <Link
                to="/"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Quay về trang chủ
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                Nhập từ khóa để tìm kiếm phim
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
