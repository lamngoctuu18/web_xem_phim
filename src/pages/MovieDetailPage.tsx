import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovieDetail, getMovieImages, getMoviePeoples, getMovieKeywords } from '../services/api';
import type {
  MovieDetail,
  MovieImage,
  MovieKeyword,
  MoviePeople,
} from '../types/movie';
import { FiPlay, FiClock, FiCalendar, FiStar, FiHeart } from 'react-icons/fi';
import { useFavorites } from '../hooks/useFavorites';

const MovieDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullContent, setShowFullContent] = useState(false);
  const [backdrops, setBackdrops] = useState<MovieImage[]>([]);
  const [cast, setCast] = useState<MoviePeople[]>([]);
  const [keywords, setKeywords] = useState<MovieKeyword[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const buildImageUrl = (url?: string | null, isFromTMDB = false) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (isFromTMDB) {
      return `https://image.tmdb.org/t/p/original${url}`;
    }
    return `https://img.ophim.live/uploads/movies/${url}`;
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getMovieDetail(slug);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const fetchExtras = async () => {
      try {
        const [imageData, peopleData, keywordData] = await Promise.all([
          getMovieImages(slug).catch(() => null),
          getMoviePeoples(slug).catch(() => null),
          getMovieKeywords(slug).catch(() => null),
        ]);

        if (!isMounted) return;

        setBackdrops(imageData?.images?.filter((img) => img.type === 'backdrop') ?? []);
        setCast(peopleData?.peoples ?? []);
        setKeywords(keywordData?.keywords ?? []);
      } catch (error) {
        console.error('Error fetching extra movie data:', error);
      }
    };

    fetchExtras();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-20">
        <div className="h-[500px] bg-dark-lighter animate-pulse" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Không tìm thấy phim</h2>
          <Link to="/" className="text-primary hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const firstEpisode = movie.episodes?.[0]?.server_data?.[0];
  const content = movie.content?.replace(/<[^>]*>/g, '') || 'Nội dung đang được cập nhật...';

  return (
    <div className="min-h-screen bg-dark pt-16">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${buildImageUrl(movie.poster_url || movie.thumb_url)})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent" />
        </div>

        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-shrink-0 mx-auto md:mx-0"
            >
              <img
                src={buildImageUrl(movie.poster_url || movie.thumb_url)}
                alt={movie.name}
                className="w-40 sm:w-48 md:w-56 lg:w-64 rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 space-y-3 md:space-y-4 text-center md:text-left"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-shadow break-words">
                {movie.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 break-words">{movie.origin_name}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-sm">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <FiCalendar className="text-primary" />
                  <span className="text-white">{movie.year}</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <FiClock className="text-primary" />
                  <span className="text-white">{movie.time}</span>
                </div>
                {movie.tmdb?.vote_average && (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-semibold">
                      {movie.tmdb.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-primary px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {movie.quality}
                </span>
                <span className="bg-blue-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {movie.lang}
                </span>
                <span className="bg-green-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {movie.episode_current}
                </span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {movie.category?.map((cat) => (
                  <span
                    key={cat.id}
                    className="border border-white/30 px-2.5 py-1 rounded-full text-xs sm:text-sm text-white hover:border-primary hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              {/* Watch Button */}
              {firstEpisode && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    to={`/xem-phim/${movie.slug}/${firstEpisode.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-400 hover:from-primary-dark hover:to-red-500 text-white font-bold px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm sm:text-base"
                  >
                    <FiPlay size={20} />
                    Xem Phim
                  </Link>
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`inline-flex items-center justify-center gap-2 font-bold px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm sm:text-base ${
                      isFavorite(movie._id)
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <FiHeart size={24} className={isFavorite(movie._id) ? 'fill-current' : ''} />
                    {isFavorite(movie._id) ? 'Đã Thích' : 'Yêu Thích'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trailer */}
            {movie.trailer_url && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
                <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={movie.trailer_url.includes('youtube.com') || movie.trailer_url.includes('youtu.be') 
                      ? movie.trailer_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                      : movie.trailer_url}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Nội dung phim</h2>
              <p className={`text-gray-300 leading-relaxed ${!showFullContent && 'line-clamp-6'}`}>
                {content}
              </p>
              {content.length > 300 && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-primary hover:text-primary-light mt-2 font-semibold"
                >
                  {showFullContent ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>

            {backdrops.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Hình ảnh</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {backdrops.slice(0, 6).map((image, index) => (
                    <div
                      key={`${image.file_path}-${index}`}
                      className="relative w-full pt-[56.25%] overflow-hidden rounded-xl border border-white/10"
                    >
                      <img
                        src={buildImageUrl(image.file_path, true)}
                        alt={`Backdrop ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Episodes */}
            {movie.episodes && movie.episodes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Danh sách tập</h2>
                {movie.episodes.map((server, serverIndex) => (
                  <div key={serverIndex} className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      {server.server_name}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {server.server_data.map((episode) => (
                        <Link
                          key={episode.slug}
                          to={`/xem-phim/${movie.slug}/${episode.slug}`}
                          className="bg-dark-lighter hover:bg-primary border border-white/10 hover:border-primary text-white text-center py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
                        >
                          {episode.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-dark-lighter rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">Thông tin</h3>
              
              {movie.status && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Trạng thái</p>
                  <p className="text-white font-semibold">{movie.status}</p>
                </div>
              )}

              {movie.country && movie.country.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Quốc gia</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.country.map((c) => (
                      <span key={c.id} className="text-white font-semibold">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.director && movie.director.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Đạo diễn</p>
                  <p className="text-white">{movie.director.join(', ')}</p>
                </div>
              )}

              {movie.actor && movie.actor.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Diễn viên</p>
                  <p className="text-white">{movie.actor.join(', ')}</p>
                </div>
              )}
            </div>

            {cast.length > 0 && (
              <div className="bg-dark-lighter rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">Diễn viên nổi bật</h3>
                <div className="space-y-3">
                  {cast.slice(0, 8).map((person) => (
                    <div key={person.tmdb_people_id} className="flex items-center gap-3">
                      {person.profile_path ? (
                        <img
                          src={buildImageUrl(person.profile_path, true)}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-dark-light flex items-center justify-center text-primary font-semibold">
                          {person.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold leading-tight">{person.name}</p>
                        <p className="text-xs text-gray-400">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {keywords.length > 0 && (
              <div className="bg-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Từ khóa liên quan</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.slice(0, 12).map((keyword) => (
                    <span
                      key={keyword.tmdb_keyword_id}
                      className="bg-dark-light text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10"
                    >
                      {keyword.name_vn || keyword.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
