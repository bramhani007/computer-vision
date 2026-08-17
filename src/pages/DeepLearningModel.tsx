import {
  BrainCircuit, Cpu, Image as ImageIcon, Layers, Gauge, ScanSearch, Database, Boxes, Sparkles, Code2,
} from 'lucide-react';

const steps = ['Animal Image', 'Image Preprocessing', 'EfficientNet-B0', 'Feature Learning', 'Species Classification', 'Confidence Score'];

const pipeline = [
  'Animal Dataset', 'Image Preprocessing', 'Image Resizing', 'Normalization', 'EfficientNet-B0',
  'Training', 'Validation', 'Testing', 'Species Prediction', 'Confidence Score',
];

const features = [
  { title: 'Efficient', description: 'Uses computational resources efficiently while maintaining strong classification performance.' },
  { title: 'Accurate', description: 'Learns visual patterns such as shapes, textures, colors and structures.' },
  { title: 'Lightweight', description: 'Suitable for practical image classification applications.' },
];

const tech = ['EfficientNet-B0', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Python'];

export default function DeepLearningModel() {
  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-eyebrow">Model</span>
        <h1 className="mt-2 font-display text-3xl font-700 text-forest-900 sm:text-4xl">Deep Learning Model</h1>
        <p className="mt-3 text-forest-600">EfficientNet-B0 for Animal Species Classification</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-forest-500">
          The system uses EfficientNet-B0 with TensorFlow and Keras to classify animal species from images based on learned visual features.
        </p>
      </div>

      {/* EfficientNet */}
      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="card p-7 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-600 text-white">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl font-700 text-forest-900">EfficientNet-B0</h2>
          </div>
          <p className="mt-4 text-forest-600">
            EfficientNet-B0 is a convolutional neural network designed to achieve strong image classification performance with efficient computational requirements. It is used in this project to learn visual patterns from animal images and classify different species.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-forest-50 p-4 ring-1 ring-forest-100">
                <p className="text-sm font-700 text-forest-800">{f.title}</p>
                <p className="mt-1 text-xs text-forest-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-7">
          <span className="chip bg-teal-100 text-teal-700 ring-1 ring-teal-200">
            <Boxes className="h-3.5 w-3.5" /> Model Technologies
          </span>
          <ul className="mt-5 space-y-2">
            {tech.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-600 text-forest-700">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-6 card p-7">
        <h2 className="font-display text-xl font-700 text-forest-900">How EfficientNet-B0 Works</h2>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="chip bg-forest-100 text-forest-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-forest-600 text-[10px] font-700 text-white">{i + 1}</span>
                {s}
              </span>
              {i < steps.length - 1 && <span className="text-forest-300">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* TensorFlow + Keras */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-600 text-white">
              <Cpu className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl font-700 text-forest-900">TensorFlow</h2>
          </div>
          <p className="mt-4 text-forest-600">
            TensorFlow is the Deep Learning framework used to build, train and evaluate the animal species classification model.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-600 text-forest-700">
            {['Model Training', 'Model Evaluation', 'Prediction', 'Deep Learning Computation'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-700 text-white">
              <Code2 className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl font-700 text-forest-900">Keras</h2>
          </div>
          <p className="mt-4 text-forest-600">
            Keras provides a high-level API for developing and training the EfficientNet-B0 Deep Learning model using TensorFlow.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-600 text-forest-700">
            {['Model Development', 'Training Configuration', 'Model Evaluation', 'Prediction'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mt-6 card p-7">
        <h2 className="font-display text-xl font-700 text-forest-900">Model Pipeline</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map((s, i) => (
            <div key={s} className="rounded-2xl bg-forest-50 p-3 text-center ring-1 ring-forest-100">
              <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-forest-600 text-xs font-700 text-white">{i + 1}</span>
              <p className="mt-2 text-xs font-600 text-forest-700">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Input / Output */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-7">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-teal-600" />
            <h2 className="font-display text-lg font-700 text-forest-900">Model Input</h2>
          </div>
          <p className="mt-2 text-sm text-forest-600">Animal Image</p>
          <div className="mt-4 flex gap-2">
            {['JPG', 'JPEG', 'PNG'].map((f) => (
              <span key={f} className="chip bg-forest-100 text-forest-700">{f}</span>
            ))}
          </div>
        </div>
        <div className="card p-7">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <h2 className="font-display text-lg font-700 text-forest-900">Model Output</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm font-600 text-forest-700">
            <li className="flex items-center gap-2"><ScanSearch className="h-4 w-4 text-teal-600" /> Predicted Animal Species</li>
            <li className="flex items-center gap-2"><Gauge className="h-4 w-4 text-teal-600" /> Confidence Score</li>
          </ul>
          <div className="mt-4 rounded-xl bg-forest-50 p-3 text-xs text-forest-500 ring-1 ring-forest-100">
            Example (UI only): Species — Tiger, Confidence — 96.42%. Actual values come from the trained backend model.
          </div>
        </div>
      </section>

      {/* Backend setup hint */}
      <section className="mt-6 card border-dashed bg-forest-50/40 p-7">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-forest-600" />
          <h2 className="font-display text-lg font-700 text-forest-900">Backend & Model Setup</h2>
        </div>
        <p className="mt-2 text-sm text-forest-600">
          The FastAPI backend, EfficientNet-B0 model, and training scripts are included in the <code className="rounded bg-forest-100 px-1.5 py-0.5 text-xs">backend/</code> folder of this project. Deploy the backend and set <code className="rounded bg-forest-100 px-1.5 py-0.5 text-xs">VITE_API_BASE_URL</code> to its URL to enable live predictions.
        </p>
      </section>
    </div>
  );
}
