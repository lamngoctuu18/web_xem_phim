import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Movie } from '../types/movie';
import { useFavorites } from '../hooks/useFavorites';
import { FiHeart } from 'react-icons/fi';

interface MovieCardProps {
  movie: Movie;
}

const buildImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://img.ophim.live/uploads/movies/${url}`;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer"
    >
      <Link to={`/phim/${movie.slug}`}>
        <div className="relative overflow-hidden rounded-xl shadow-lg shadow-black/40">
          <img
            src={buildImageUrl(movie.thumb_url || movie.poster_url)}
            alt={movie.name}
            className="w-full h-[320px] object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              <button 
                onClick={handleFavoriteClick}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
                  isMovieFavorite 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-dark-light/90 hover:bg-dark text-white border border-white/20'
                }`}
              >
                <FiHeart className={isMovieFavorite ? 'fill-white' : ''} size={18} />
                {isMovieFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                Xem Ngay
              </button>
            </div>
          </div>

          {/* Favorite Badge (Always Visible) */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
              isMovieFavorite
                ? 'bg-red-500 text-white scale-110'
                : 'bg-dark-light/80 text-white hover:bg-dark-light border border-white/20'
            }`}
            aria-label={isMovieFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          >
            <FiHeart className={isMovieFavorite ? 'fill-white' : ''} size={16} />
          </button>

          {/* Quality Badge */}
          <div className="absolute top-2 left-14 bg-primary px-2 py-1 rounded text-xs font-bold">
            {movie.quality}
          </div>

          {/* Language Badge */}
          <div className="absolute top-2 right-2 bg-dark-lighter/90 px-2 py-1 rounded text-xs font-semibold">
            {movie.lang}
          </div>

          {/* Episode Badge */}
          {movie.episode_current && (
            <div className="absolute bottom-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              {movie.episode_current}
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-white font-semibold text-sm group-hover:text-primary transition-colors duration-300">
            {movie.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-400 text-xs">{movie.year}</span>
            {movie.tmdb?.vote_average && (
              <span className="text-yellow-400 text-xs flex items-center gap-1">
                ⭐ {movie.tmdb.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
