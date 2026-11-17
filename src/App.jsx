import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import IPOAnalysisPage from './pages/IPOAnalysisPage';
import NewsAnalysisPage from './pages/NewsAnalysisPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ipo" element={<IPOAnalysisPage />} />
            <Route path="/news" element={<NewsAnalysisPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
