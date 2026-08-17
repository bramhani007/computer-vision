import { PawPrint, MapPin, Info } from 'lucide-react';

type Props = {
  species: string;
  habitat: string;
  description: string;
};

export default function SpeciesInfo({ species, habitat, description }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-forest-100 bg-forest-50/60 px-5 py-3">
        <PawPrint className="h-4 w-4 text-teal-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-forest-700">Species Information</h3>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Species</p>
          <p className="mt-0.5 text-base font-600 text-forest-900">{species}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-400">
            <MapPin className="h-3.5 w-3.5" /> Habitat
          </p>
          <p className="mt-0.5 text-sm text-forest-700">{habitat}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-400">
            <Info className="h-3.5 w-3.5" /> Description
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-forest-700">{description}</p>
        </div>
      </div>
    </div>
  );
}
