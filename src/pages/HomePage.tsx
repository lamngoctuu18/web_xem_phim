import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import MovieSlider from '../components/MovieSlider';
import SkeletonCard from '../components/SkeletonCard';
import AdvancedFilterBar from '../components/AdvancedFilterBar';
import { getHomeData, getMoviesByCategory } from '../services/api';
import type { Movie } from '../types/movie';

const HomePage = () => {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [singleMovies, setSingleMovies] = useState<Movie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch home data for hero and new movies
        const homeData = await getHomeData();
        const homeItems = homeData.items ?? [];
        setHeroMovies(homeItems.slice(0, 5));
        setNewMovies(homeItems.slice(0, 12));

        // Fetch different categories
        const [singleData, seriesData, animeData] = await Promise.all([
          getMoviesByCategory('phim-le'),
          getMoviesByCategory('phim-bo'),
          getMoviesByCategory('hoat-hinh'),
        ]);

        setSingleMovies(singleData.items.slice(0, 12));
        setSeriesMovies(seriesData.items.slice(0, 12));
        setAnimeMovies(animeData.items.slice(0, 12));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark">
        {/* Hero Skeleton */}
        <div className="h-[60vh] md:h-[75vh] bg-dark-lighter animate-pulse" />
        
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-12">
          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-12">
              <div className="h-8 bg-dark-lighter rounded w-48 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <HeroSection movies={heroMovies} />

      {/* Movie Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {newMovies.length > 0 && (
          <MovieSlider
            title="Phim Mới Cập Nhật"
            movies={newMovies}
            viewAllLink="/danh-sach/phim-moi-cap-nhat"
          />
        )}

        {singleMovies.length > 0 && (
          <MovieSlider
            title="Phim Lẻ"
            movies={singleMovies}
            viewAllLink="/danh-sach/phim-le"
          />
        )}

        {seriesMovies.length > 0 && (
          <MovieSlider
            title="Phim Bộ"
            movies={seriesMovies}
            viewAllLink="/danh-sach/phim-bo"
          />
        )}

        {animeMovies.length > 0 && (
          <MovieSlider
            title="Hoạt Hình"
            movies={animeMovies}
            viewAllLink="/danh-sach/hoat-hinh"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
