import { Link } from 'react-router-dom';
import { PawPrint, Github, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-forest-100 bg-forest-900 text-forest-100">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-600 text-white">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-700 text-white">
              Animal Species Recognition System
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-forest-200">
            AI-Powered Wildlife Species Identification using EfficientNet-B0 and Computer Vision.
          </p>
        </div>

        <div>
          <p className="section-eyebrow text-teal-300">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="text-forest-200 transition hover:text-white">Home</Link></li>
            <li><Link to="/recognize" className="text-forest-200 transition hover:text-white">Recognize</Link></li>
            <li><Link to="/model" className="text-forest-200 transition hover:text-white">Deep Learning Model</Link></li>
            <li><Link to="/history" className="text-forest-200 transition hover:text-white">History</Link></li>
            <li><Link to="/dashboard" className="text-forest-200 transition hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <p className="section-eyebrow text-teal-300">Built with</p>
          <ul className="mt-4 space-y-2 text-sm text-forest-200">
            <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-teal-300" /> EfficientNet-B0 · TensorFlow · Keras</li>
            <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-teal-300" /> OpenCV · NumPy · FastAPI</li>
            <li className="flex items-center gap-2"><Leaf className="h-4 w-4 text-teal-300" /> React · Recharts · Tailwind</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-forest-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-forest-300 sm:flex-row">
          <p>© {new Date().getFullYear()} Animal Species Recognition System</p>
          <p className="flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" /> AI-Powered Wildlife Species Identification
          </p>
        </div>
      </div>
    </footer>
  );
}
