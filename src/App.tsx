import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchPage from './pages/WatchPage';
import CategoryPage from './pages/CategoryPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Navbar />
        <Toast />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tim-kiem" element={<SearchPage />} />
            <Route path="/phim/:slug" element={<MovieDetailPage />} />
            <Route path="/xem-phim/:slug/:episodeSlug" element={<WatchPage />} />
            <Route path="/danh-sach/:category" element={<CategoryPage />} />
            <Route path="/the-loai/:category" element={<CategoryPage />} />
            <Route path="/quoc-gia/:category" element={<CategoryPage />} />
            <Route path="/nam-phat-hanh/:category" element={<CategoryPage />} />
            <Route path="/yeu-thich" element={<FavoritesPage />} />
            <Route path="/lich-su" element={<HistoryPage />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
