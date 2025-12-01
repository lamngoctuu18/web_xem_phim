import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiTrash2, FiXCircle } from 'react-icons/fi';
import { useWatchHistory } from '../hooks/useWatchHistory';

const HistoryPage = () => {
  const { history, removeFromHistory, clearHistory } = useWatchHistory();

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FiClock className="text-primary text-3xl" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Lịch Sử Xem
              </h1>
              <span className="text-gray-400 text-lg">({history.length})</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <FiXCircle size={20} />
                Xóa Tất Cả
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiClock className="text-gray-600 text-6xl mb-4" />
              <p className="text-gray-400 text-xl mb-6">
                Bạn chưa xem phim nào
              </p>
              <Link
                to="/"
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Khám phá phim
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <motion.div
                  key={`${entry.movie._id}-${entry.episodeSlug}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-lighter rounded-xl p-4 flex items-center gap-4 hover:bg-dark-light transition-colors group"
                >
                  <Link
                    to={`/xem-phim/${entry.movie.slug}/${entry.episodeSlug}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={`https://img.ophim.live/uploads/movies/${entry.movie.thumb_url}`}
                      alt={entry.movie.name}
                      className="w-24 h-36 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/xem-phim/${entry.movie.slug}/${entry.episodeSlug}`}
                      className="text-white font-bold text-lg hover:text-primary transition-colors block truncate"
                    >
                      {entry.movie.name}
                    </Link>
                    <p className="text-gray-400 text-sm mt-1">
                      {entry.episodeName}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {formatTime(entry.watchedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromHistory(entry.movie._id, entry.episodeSlug)}
                    className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Xóa khỏi lịch sử"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;
