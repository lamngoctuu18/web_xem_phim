import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovieDetail } from '../services/api';
import type { MovieDetail } from '../types/movie';
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import Hls from 'hls.js';
import { useWatchHistory } from '../hooks/useWatchHistory';

const WatchPage = () => {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);
  const [qualityOptions, setQualityOptions] = useState<Array<{ id: number; label: string }>>([]);
  const [selectedQuality, setSelectedQuality] = useState<'auto' | number>('auto');
  const { addToHistory } = useWatchHistory();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getMovieDetail(slug);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  const currentServer = movie?.episodes?.[currentServerIndex];
  const currentEpisode = currentServer?.server_data.find((ep) => ep.slug === episodeSlug);
  const currentEpisodeIndex = currentServer?.server_data.findIndex((ep) => ep.slug === episodeSlug) ?? -1;
  const prevEpisode = currentEpisodeIndex > 0 ? currentServer?.server_data[currentEpisodeIndex - 1] : null;
  const nextEpisode =
    currentEpisodeIndex >= 0 && currentEpisodeIndex < (currentServer?.server_data.length ?? 0) - 1
      ? currentServer?.server_data[currentEpisodeIndex + 1]
      : null;

  useEffect(() => {
    if (movie && currentEpisode) {
      addToHistory(movie, currentEpisode.slug, currentEpisode.name);
    }
  }, [movie, currentEpisode, addToHistory]);

  const qualitySelectorOptions = useMemo(() => {
    if (qualityOptions.length === 0) return [];
    return qualityOptions.map((option) => ({
      id: option.id,
      label: option.label,
    }));
  }, [qualityOptions]);

  useEffect(() => {
    setSelectedQuality('auto');
    setQualityOptions([]);

    const videoElement = videoRef.current;
    hlsInstanceRef.current?.destroy();
    hlsInstanceRef.current = null;

    if (!currentEpisode?.link_m3u8 || !videoElement) {
      if (videoElement) {
        videoElement.removeAttribute('src');
        videoElement.load();
      }
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, autoStartLoad: true });
      hlsInstanceRef.current = hls;
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(currentEpisode.link_m3u8 as string);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        const levels = (data.levels || []).map((level: any, index: number) => ({
          id: index,
          label:
            level.name ||
            (level.height ? `${level.height}p` : level.bitrate ? `${Math.round(level.bitrate / 1000)} kbps` : `Mức ${index + 1}`),
        }));
        setQualityOptions(levels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setSelectedQuality(data.level === -1 ? 'auto' : data.level);
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = currentEpisode.link_m3u8;
      videoElement.load();
    } else if (currentEpisode.link_embed) {
      // handled via iframe fallback render, nothing to configure for video element
    }

    return () => {
      hlsInstanceRef.current?.destroy();
      hlsInstanceRef.current = null;
    };
  }, [currentEpisode?.link_m3u8, currentEpisode?.link_embed, currentEpisode?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
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

  const handleQualityChange = (value: 'auto' | number) => {
    setSelectedQuality(value);

    if (!hlsInstanceRef.current) return;

    hlsInstanceRef.current.currentLevel = value === 'auto' ? -1 : value;
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-black rounded-xl overflow-hidden"
            >
              <div className="relative pt-[56.25%]">
                {currentEpisode?.link_m3u8 ? (
                  <>
                    <video
                      ref={videoRef}
                      controls
                      controlsList="nodownload"
                      className="absolute top-0 left-0 w-full h-full bg-black"
                      preload="metadata"
                    >
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                    {/* Skip Controls */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-32 opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <button
                        onClick={handleSkipBackward}
                        className="bg-dark/50 hover:bg-primary/80 backdrop-blur-sm text-white p-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 pointer-events-auto"
                        aria-label="Tua lùi 10 giây"
                      >
                        <FiSkipBack size={20} />
                      </button>
                      <button
                        onClick={handleSkipForward}
                        className="bg-dark/50 hover:bg-primary/80 backdrop-blur-sm text-white p-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 pointer-events-auto"
                        aria-label="Tua tiến 10 giây"
                      >
                        <FiSkipForward size={20} />
                      </button>
                    </div>
                    {qualitySelectorOptions.length > 0 && (
                      <div className="absolute top-4 right-4 z-10 bg-dark/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-white text-sm flex items-center gap-2">
                        <span className="uppercase text-xs tracking-wider text-gray-300">Chất lượng</span>
                        <select
                          value={selectedQuality === 'auto' ? 'auto' : String(selectedQuality)}
                          onChange={(event) => {
                            const value = event.target.value === 'auto' ? 'auto' : Number(event.target.value);
                            handleQualityChange(value);
                          }}
                          className="bg-transparent border-none text-white font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="auto" className="bg-dark text-white">Tự động</option>
                          {qualitySelectorOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-dark text-white">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                ) : currentEpisode?.link_embed ? (
                  <iframe
                    src={currentEpisode.link_embed}
                    title={currentEpisode.name}
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                    <p>Không có link phim khả dụng</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Movie Info */}
            <div className="bg-dark-lighter rounded-xl p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {movie.name}
              </h1>
              <p className="text-gray-400 mb-4">
                {currentEpisode?.name || 'Đang xem'}
              </p>

              {/* Server Selection */}
              {movie.episodes && movie.episodes.length > 1 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Chọn server:</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.episodes.map((server, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentServerIndex(index)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          index === currentServerIndex
                            ? 'bg-primary text-white'
                            : 'bg-dark-light text-gray-300 hover:bg-dark'
                        }`}
                      >
                        {server.server_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {prevEpisode && (
                  <Link
                    to={`/xem-phim/${movie.slug}/${prevEpisode.slug}`}
                    className="flex items-center gap-2 bg-dark-light hover:bg-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    <FiChevronLeft size={20} />
                    Tập trước
                  </Link>
                )}
                {nextEpisode && (
                  <Link
                    to={`/xem-phim/${movie.slug}/${nextEpisode.slug}`}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors ml-auto"
                  >
                    Tập tiếp theo
                    <FiChevronRight size={20} />
                  </Link>
                )}
              </div>
            </div>

            {/* Episodes List */}
            {currentServer && (
              <div className="bg-dark-lighter rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Danh sách tập - {currentServer.server_name}
                </h2>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-96 overflow-y-auto">
                  {currentServer.server_data.map((episode) => (
                    <Link
                      key={episode.slug}
                      to={`/xem-phim/${movie.slug}/${episode.slug}`}
                      className={`text-center py-3 rounded-lg transition-all duration-300 font-semibold text-sm ${
                        episode.slug === episodeSlug
                          ? 'bg-primary text-white'
                          : 'bg-dark-light text-white hover:bg-dark border border-white/10 hover:border-primary'
                      }`}
                    >
                      {episode.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
