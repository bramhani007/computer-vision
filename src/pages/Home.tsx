import { Link } from 'react-router-dom';
import {
  ScanSearch, LayoutDashboard, BrainCircuit, ShieldCheck, Gauge, History, PawPrint, ArrowRight, Leaf, Cpu, Database, Camera,
} from 'lucide-react';
import BackendStatus from '@/components/BackendStatus';
import { useBackendHealth } from '@/hooks/useBackendHealth';

const HERO_IMG = 'https://images.pexels.com/photos/17880557/pexels-photo-17880557.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const features = [
  { Icon: ScanSearch, title: 'AI Species Recognition', description: 'Automatically identifies animal species from uploaded images.' },
  { Icon: Gauge, title: 'Confidence Score', description: 'Displays the confidence level of the predicted species.' },
  { Icon: History, title: 'Recognition History', description: 'Stores and displays previous animal recognition results.' },
  { Icon: LayoutDashboard, title: 'Wildlife Dashboard', description: 'Provides statistics, charts and species recognition insights.' },
];

const tech = ['Python', 'OpenCV', 'TensorFlow', 'Keras', 'EfficientNet-B0', 'FastAPI', 'React.js', 'Axios', 'Recharts', 'SQLite'];

export default function Home() {
  const { status, lastChecked, refresh } = useBackendHealth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-100/70 via-forest-50 to-forest-50" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="chip bg-teal-100 text-teal-700 ring-1 ring-teal-200">
              <Leaf className="h-3.5 w-3.5" /> EfficientNet-B0 · Computer Vision
            </span>
            <h1 className="mt-5 font-display text-4xl font-800 leading-[1.1] tracking-tight text-forest-900 text-balance sm:text-5xl lg:text-6xl">
              Animal Species Recognition System
            </h1>
            <p className="mt-4 max-w-xl text-lg text-forest-600">
              AI-Powered Animal Identification Using Deep Learning. Upload an animal image and let the AI model identify its species with a confidence score.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/recognize" className="btn-primary">
                <ScanSearch className="h-4 w-4" /> Recognize Animal
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                <LayoutDashboard className="h-4 w-4" /> View Dashboard
              </Link>
            </div>
            <div className="mt-7 max-w-sm">
              <BackendStatus status={status} lastChecked={lastChecked} onRefresh={refresh} />
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-forest-200/50 to-teal-200/40 blur-2xl" />
            <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-forest-100">
              <img src={HERO_IMG} alt="Wildlife" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-card ring-1 ring-forest-100 sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-600 text-white">
                  <Cpu className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Model</p>
                  <p className="text-sm font-700 text-forest-800">EfficientNet-B0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Key Features</p>
          <h2 className="mt-2 font-display text-3xl font-700 text-forest-900">Everything you need to identify wildlife</h2>
          <p className="mt-3 text-forest-600">A complete pipeline from image upload to species prediction, history and analytics.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, description }, i) => (
            <div
              key={title}
              className="card group p-6 transition hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-600 transition group-hover:bg-forest-600 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-700 text-forest-900">{title}</h3>
              <p className="mt-1.5 text-sm text-forest-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About + pipeline */}
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card p-7">
            <span className="chip bg-teal-100 text-teal-700 ring-1 ring-teal-200">
              <PawPrint className="h-3.5 w-3.5" /> About the System
            </span>
            <h2 className="mt-4 font-display text-2xl font-700 text-forest-900">Computer Vision meets Deep Learning</h2>
            <p className="mt-3 text-forest-600">
              Animal Species Recognition System uses Computer Vision and Deep Learning to automatically identify animal species from images. The system uses an EfficientNet-B0 model to analyze visual features and provide species predictions with confidence scores.
            </p>
            <Link to="/model" className="btn-ghost mt-5 px-0">
              Explore the model <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="card p-7">
            <span className="chip bg-forest-100 text-forest-700 ring-1 ring-forest-200">
              <ShieldCheck className="h-3.5 w-3.5" /> How it works
            </span>
            <h2 className="mt-4 font-display text-2xl font-700 text-forest-900">From image to prediction</h2>
            <ol className="mt-5 space-y-3">
              {[
                { Icon: Camera, t: 'Upload animal image' },
                { Icon: Cpu, t: 'OpenCV preprocessing' },
                { Icon: BrainCircuit, t: 'EfficientNet-B0 inference' },
                { Icon: Gauge, t: 'Species + confidence score' },
                { Icon: Database, t: 'Stored in SQLite' },
              ].map(({ Icon, t }, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forest-600 text-xs font-700 text-white">
                    {i + 1}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-600 text-forest-700">
                    <Icon className="h-4 w-4 text-teal-600" /> {t}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="container-page pb-20">
        <div className="card p-7">
          <p className="section-eyebrow">Technologies Used</p>
          <h2 className="mt-2 font-display text-2xl font-700 text-forest-900">A modern full-stack AI stack</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {tech.map((t) => (
              <span key={t} className="chip bg-forest-50 text-forest-700 ring-1 ring-forest-100">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
