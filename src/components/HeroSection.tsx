import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { FiPlay, FiInfo } from 'react-icons/fi';

interface HeroSectionProps {
  movies: Movie[];
}

const buildImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://img.ophim.live/uploads/movies/${url}`;
};

const HeroSection: React.FC<HeroSectionProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  const previewMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    const result: Movie[] = [];
    for (let i = 0; i < Math.min(3, movies.length); i += 1) {
      result.push(movies[(currentIndex + i) % movies.length]);
    }
    return result;
  }, [movies, currentIndex]);

  const ease = [0.16, 1, 0.3, 1] as const;

  const sceneVariants: Variants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: 0.6, ease },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  const backgroundVariants: Variants = {
    initial: { scale: 1.1, opacity: 0, filter: 'blur(20px)' },
    enter: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.4, ease },
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      filter: 'blur(15px)',
      transition: { duration: 0.5, ease },
    },
  };

  const gradientOverlayVariants: Variants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { delay: 0.2, duration: 0.8, ease },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const lightSweepVariants: Variants = {
    initial: { x: '-160%', skewX: -25, opacity: 0 },
    enter: {
      x: '160%',
      opacity: 0.6,
      transition: { delay: 0.6, duration: 1.2, ease: 'easeInOut' },
    },
    exit: { opacity: 0 },
  };


  const infoVariants: Variants = {
    initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
    enter: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 1.65, duration: 0.55, ease },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  const descriptionVariants: Variants = {
    initial: { opacity: 0, y: 25, filter: 'blur(10px)' },
    enter: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 1.95, duration: 0.6, ease },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
  };

  const ctaVariants: Variants = {
    initial: (_index: number) => ({ opacity: 0, y: 30, scale: 0.9 }),
    enter: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: 2.15 + index * 0.12, duration: 0.55, ease },
    }),
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const cardBlueprint = [
    {
      delay: 0.9,
      initial: { x: 150, y: 10, rotate: -7, scale: 0.9, filter: 'blur(10px)' },
      final: { x: 0, y: 0, rotate: -4, scale: 1.05, filter: 'blur(0px)' },
    },
    {
      delay: 1.05,
      initial: { x: 30, y: 120, rotate: 5, scale: 0.85, filter: 'blur(8px)' },
      final: { x: 0, y: 10, rotate: 2, scale: 1, filter: 'blur(0px)' },
    },
    {
      delay: 1.2,
      initial: { x: -30, y: -120, rotate: -2, scale: 0.86, filter: 'blur(8px)' },
      final: { x: 0, y: -10, rotate: 4, scale: 0.98, filter: 'blur(0px)' },
    },
    {
      delay: 1.35,
      initial: { x: 120, y: -110, rotate: -10, scale: 0.82, filter: 'blur(10px)' },
      final: { x: 0, y: -18, rotate: -6, scale: 0.95, filter: 'blur(0px)' },
    },
  ];

  const cardVariants: Variants = {
    initial: (index: number) => {
      const blueprint = cardBlueprint[index] || cardBlueprint[cardBlueprint.length - 1];
      return {
        opacity: 0,
        ...blueprint.initial,
      };
    },
    enter: (index: number) => {
      const blueprint = cardBlueprint[index] || cardBlueprint[cardBlueprint.length - 1];
      return {
        opacity: 1,
        ...blueprint.final,
        transition: {
          duration: 0.75,
          ease,
          delay: blueprint.delay,
        },
      };
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 60,
      rotate: -12,
      filter: 'blur(10px)',
      transition: { duration: 0.3, ease },
    },
  };


  const infoBadges = [
    currentMovie.year && { id: 'year', label: currentMovie.year },
    currentMovie.quality && { id: 'quality', label: currentMovie.quality, accent: true },
    currentMovie.lang && { id: 'lang', label: currentMovie.lang },
    currentMovie.tmdb?.vote_average && {
      id: 'vote',
      label: `⭐ ${currentMovie.tmdb.vote_average.toFixed(1)}`,
    },
  ].filter(Boolean) as Array<{ id: string; label: string; accent?: boolean }>;

  const isTrailerOnly = currentMovie.status === 'trailer' || !currentMovie.episode_current || currentMovie.episode_current === 'Trailer';
  const hasTrailer = !!currentMovie.trailer_url;

  const details = [
    currentMovie.status && {
      label: 'Trạng thái',
      value: currentMovie.status === 'completed' ? 'Hoàn thành' : 
             currentMovie.status === 'ongoing' ? 'Đang chiếu' : 
             currentMovie.status === 'trailer' ? 'Sắp chiếu' : 
             currentMovie.status,
    },
    currentMovie.country?.length && {
      label: 'Quốc gia',
      value: currentMovie.country.map((item) => item.name).join(', '),
    },
    currentMovie.category?.length && {
      label: 'Thể loại',
      value: currentMovie.category.map((item) => item.name).join(', '),
    },
    currentMovie.director?.length && {
      label: 'Đạo diễn',
      value: currentMovie.director.join(', '),
    },
    currentMovie.time && { label: 'Thời lượng', value: currentMovie.time },
    currentMovie.imdb?.vote_average && {
      label: 'IMDb',
      value: `${currentMovie.imdb.vote_average.toFixed(1)}${
        currentMovie.imdb.vote_count ? ` (${currentMovie.imdb.vote_count} lượt)` : ''
      }`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const detailsVariants: Variants = {
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    enter: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: 2.05,
        duration: 0.6,
        ease,
        staggerChildren: 0.08,
      },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
  };

  const detailItemVariants: Variants = {
    initial: { opacity: 0, y: 12 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease },
    },
  };

  return (
    <div className="relative h-[80vh] md:h-[90vh] lg:h-[95vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.slug}
          variants={sceneVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${buildImageUrl(currentMovie.poster_url || currentMovie.thumb_url)})`,
            }}
            variants={backgroundVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          />
          <motion.div
            className="absolute inset-0"
            variants={gradientOverlayVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-transparent to-dark" />
          </motion.div>
          <div className="absolute inset-0 hero-film-grain pointer-events-none" />
          <motion.div
            className="absolute -top-20 left-8 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease }}
          />
          <motion.div
            className="absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-red-500/20 blur-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ delay: 1, duration: 1.4, ease }}
          />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-end pb-16 md:pb-20">
            <div className="relative max-w-4xl space-y-4">
              <motion.div
                className="absolute top-0 left-0 h-full w-[120%] -translate-x-16 pointer-events-none"
                variants={lightSweepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <div className="h-full w-48 bg-gradient-to-r from-white/10 via-white/40 to-transparent blur-2xl" />
              </motion.div>

              <motion.h1
                className="relative z-10 text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.8, ease }}
              >
                {currentMovie.name}
              </motion.h1>

              <motion.div
                className="relative z-10 flex items-center gap-3 text-sm md:text-base flex-wrap"
                variants={infoVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                {infoBadges.map((badge) => (
                  <span
                    key={badge.id}
                    className={`px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider text-xs md:text-sm ${
                      badge.accent
                        ? 'bg-gradient-to-r from-primary to-red-500 text-white'
                        : 'bg-white/20 backdrop-blur-sm text-gray-100'
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </motion.div>

              <motion.p
                className="relative z-10 text-gray-200 text-sm md:text-base max-w-3xl leading-relaxed font-light"
                variants={descriptionVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                {currentMovie.content?.replace(/<[^>]*>/g, '') || 'Nội dung đang được cập nhật...'}
              </motion.p>

              {details.length > 0 && (
                <motion.dl
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-200"
                  variants={detailsVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                >
                  {details.map(({ label, value }) => (
                    <motion.div key={label} variants={detailItemVariants} className="flex items-center gap-2">
                      <dt className="text-xs text-gray-400 font-medium whitespace-nowrap">{label}:</dt>
                      <dd className="font-semibold text-white/95 truncate">{value}</dd>
                    </motion.div>
                  ))}
                </motion.dl>
              )}

              <div className="relative z-10 flex flex-wrap gap-4 pt-2">
                <motion.div variants={ctaVariants} custom={0} initial="initial" animate="enter" exit="exit">
                  {isTrailerOnly && hasTrailer ? (
                    <a
                      href={currentMovie.trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-cta-primary relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-primary to-red-500 text-white font-bold px-8 md:px-10 py-3.5 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <FiPlay size={24} />
                      Xem Trailer
                    </a>
                  ) : (
                    <Link
                      to={`/phim/${currentMovie.slug}`}
                      className="hero-cta-primary relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-primary to-red-500 text-white font-bold px-8 md:px-10 py-3.5 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <FiPlay size={24} />
                      Xem Ngay
                    </Link>
                  )}
                </motion.div>
                <motion.div variants={ctaVariants} custom={1} initial="initial" animate="enter" exit="exit">
                  <Link
                    to={`/phim/${currentMovie.slug}`}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-bold px-8 md:px-10 py-3.5 rounded-xl border-2 border-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <FiInfo size={24} />
                    Chi Tiết
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Animated Preview Cards */}
          <div className="hidden lg:flex absolute bottom-16 right-14 gap-6 pointer-events-none perspective-[1200px]">
            <AnimatePresence mode="popLayout">
              {previewMovies.slice(0, 4).map((movie, index) => (
                <motion.div
                  key={`${movie.slug}-${index}`}
                  custom={index}
                  variants={cardVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="relative"
                >
                  <div
                    className={`hero-floating-card relative w-40 h-64 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl transition-transform duration-500 ${
                      index === 0 ? 'scale-[1.08]' : index === 1 ? 'scale-[0.98]' : 'scale-95'
                    }`}
                    style={{ animationDelay: `${3 + index * 0.2}s` }}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={buildImageUrl(movie.poster_url || movie.thumb_url)}
                        alt={movie.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-semibold line-clamp-2 drop-shadow-lg">
                        {movie.name}
                      </p>
                      <span className="text-xs text-gray-300">{movie.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-dark/50 backdrop-blur-sm px-4 py-2 rounded-full">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentIndex ? 'w-10 bg-gradient-to-r from-primary to-red-500 shadow-lg shadow-primary/50' : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
