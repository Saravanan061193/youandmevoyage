'use client';

import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  recommendedSize?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  recommendedSize,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Strict File Size Limit (Max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }

      // 2. Strict MIME Type Validation
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
        alert('Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed.');
        return;
      }

      // 3. Block Dangerous File Extensions
      const fileName = file.name.toLowerCase();
      const forbiddenExts = ['.exe', '.js', '.html', '.htm', '.php', '.sh', '.bat', '.cmd', '.vbs', '.jar'];
      if (forbiddenExts.some((ext) => fileName.endsWith(ext))) {
        alert('Dangerous file type detected and blocked.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 bg-[#181614] border border-stone-800 p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-stone-800/80 pb-2.5">
        <label className="text-xs text-stone-200 font-bold uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#c5a059]" /> {label}
        </label>
        {recommendedSize && (
          <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-md font-bold">
            📐 {recommendedSize}
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        /* Image Uploaded Active View */
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
          <div className="w-24 h-20 rounded-xl overflow-hidden border border-stone-700 bg-stone-950 shrink-0 relative shadow-md group">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2 text-left w-full">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Image Uploaded & Active</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/40 text-xs font-bold hover:bg-[#c5a059]/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change Image
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-semibold hover:bg-rose-900/60 hover:text-rose-200 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Trigger Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-700/80 hover:border-[#c5a059] rounded-xl p-5 text-center cursor-pointer bg-stone-900/40 hover:bg-stone-900/80 transition-all group space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-[#c5a059] group-hover:text-stone-950 transition-all">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-200 block group-hover:text-[#c5a059] transition-colors">
              Click to Upload Image File from Device
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Supports PNG, JPG, WEBP, SVG (Max 5MB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
