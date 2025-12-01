import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Movie } from '../types/movie';

const FAVORITES_KEY = 'myMovie_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav._id === movie._id);
      if (exists) return prev;
      const updated = [...prev, movie];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      toast.success(`Đã thêm "${movie.name}" vào yêu thích ❤️`);
      return updated;
    });
  };

  const removeFavorite = (movieId: string) => {
    setFavorites((prev) => {
      const movie = prev.find((fav) => fav._id === movieId);
      const updated = prev.filter((fav) => fav._id !== movieId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      if (movie) {
        toast.info(`Đã xóa "${movie.name}" khỏi yêu thích 💔`);
      }
      return updated;
    });
  };

  const isFavorite = (movieId: string) => {
    return favorites.some((fav) => fav._id === movieId);
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie._id)) {
      removeFavorite(movie._id);
    } else {
      addFavorite(movie);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
