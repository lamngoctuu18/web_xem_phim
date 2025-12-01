import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

const HISTORY_KEY = 'myMovie_history';
const MAX_HISTORY = 50;

interface HistoryEntry {
  movie: Movie;
  episodeSlug: string;
  episodeName: string;
  watchedAt: number;
}

export const useWatchHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading watch history:', error);
      }
    }
  }, []);

  const addToHistory = (movie: Movie, episodeSlug: string, episodeName: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (entry) => !(entry.movie._id === movie._id && entry.episodeSlug === episodeSlug)
      );
      const updated = [
        { movie, episodeSlug, episodeName, watchedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (movieId: string, episodeSlug: string) => {
    setHistory((prev) => {
      const updated = prev.filter(
        (entry) => !(entry.movie._id === movieId && entry.episodeSlug === episodeSlug)
      );
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
