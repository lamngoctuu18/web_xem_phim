import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
}

const MovieSlider: React.FC<MovieSliderProps> = ({ title, movies, viewAllLink }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-primary hover:text-primary-light transition-colors font-semibold text-sm md:text-base"
          >
            Xem tất cả →
          </a>
        )}
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 24,
          },
        }}
        className="movie-slider"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSlider;
