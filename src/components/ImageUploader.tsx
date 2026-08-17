import { useCallback, useRef, useState, DragEvent } from 'react';
import { UploadCloud, ImageIcon, X, FileCheck2 } from 'lucide-react';

type Props = {
  image: File | null;
  previewUrl: string | null;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
};

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];

export default function ImageUploader({ image, previewUrl, onImageChange, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): boolean => {
    const ok = ACCEPTED.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
    if (!ok) {
      alert('Please upload a valid JPG, JPEG or PNG image.');
      return false;
    }
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (!validate(file)) return;
      onImageChange(file);
    },
    [onImageChange, validate]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed bg-white p-6 transition-all duration-200 ${
        dragging
          ? 'border-teal-500 bg-teal-50/40 shadow-glow'
          : 'border-forest-200 hover:border-forest-300'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      {previewUrl ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full overflow-hidden rounded-2xl bg-forest-50 ring-1 ring-forest-100">
            <img src={previewUrl} alt="Selected animal" className="mx-auto max-h-72 w-auto object-contain" />
            <button
              type="button"
              onClick={() => onImageChange(null)}
              disabled={disabled}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-forest-700 shadow-soft transition hover:bg-red-50 hover:text-red-600"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-700 ring-1 ring-forest-100">
            <FileCheck2 className="h-4 w-4 text-teal-600" />
            {image?.name}
            {image ? ` · ${(image.size / 1024).toFixed(0)} KB` : ''}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="btn-secondary"
          >
            <ImageIcon className="h-4 w-4" />
            Browse Image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex w-full flex-col items-center gap-3 py-8 text-center"
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-forest-100 text-forest-600 transition group-hover:scale-105">
            <UploadCloud className="h-8 w-8" />
          </span>
          <span className="text-sm font-semibold text-forest-800">
            Drag & drop your image here or browse from your device
          </span>
          <span className="text-xs text-forest-500">Supports JPG, JPEG, PNG</span>
          <span className="btn-primary mt-2">
            <ImageIcon className="h-4 w-4" />
            Browse Image
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
