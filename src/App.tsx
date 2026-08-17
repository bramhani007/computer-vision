import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OfflineBanner } from '@/components/BackendStatus';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import Home from '@/pages/Home';
import Recognize from '@/pages/Recognize';
import DeepLearningModel from '@/pages/DeepLearningModel';
import History from '@/pages/History';
import Dashboard from '@/pages/Dashboard';

function App() {
  const { status } = useBackendHealth();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recognize" element={<Recognize />} />
            <Route path="/model" element={<DeepLearningModel />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <OfflineBanner status={status} />
      </div>
    </BrowserRouter>
  );
}

export default App;
