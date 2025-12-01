import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useFavorites } from '../hooks/useFavorites';
import MovieCard from '../components/MovieCard';

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <FiHeart className="text-primary text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Phim Yêu Thích
            </h1>
            <span className="text-gray-400 text-lg">({favorites.length})</span>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiHeart className="text-gray-600 text-6xl mb-4" />
              <p className="text-gray-400 text-xl mb-6">
                Bạn chưa có phim yêu thích nào
              </p>
              <Link
                to="/"
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Khám phá phim
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((movie) => (
                <div key={movie._id} className="relative group">
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => removeFavorite(movie._id)}
                    className="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Xóa khỏi yêu thích"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FavoritesPage;
