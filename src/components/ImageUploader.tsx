'use client';

import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  recommendedSize?: string;
  maxDimension?: number;
}

// Client-side HTML5 Canvas Image Compressor
const compressImage = (dataUrl: string, maxDimension = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(dataUrl);
      return;
    }

    // Skip compression for SVG vector graphics
    if (dataUrl.startsWith('data:image/svg+xml')) {
      resolve(dataUrl);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale dimensions if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // For PNG images, use PNG if lightweight (< 350KB), otherwise use transparent WebP
        if (dataUrl.startsWith('data:image/png')) {
          try {
            const pngUrl = canvas.toDataURL('image/png');
            if (pngUrl && pngUrl.length < 350000) {
              resolve(pngUrl);
              return;
            }
          } catch (e) {}
        }

        // Try WebP compression (preserves transparency with ~90% smaller payload)
        try {
          const webpUrl = canvas.toDataURL('image/webp', quality);
          if (webpUrl && webpUrl.startsWith('data:image/webp')) {
            resolve(webpUrl);
            return;
          }
        } catch (e) {}

        try {
          const pngUrl = canvas.toDataURL('image/png');
          if (pngUrl) {
            resolve(pngUrl);
            return;
          }
        } catch (e) {}

        resolve(dataUrl);
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  recommendedSize,
  maxDimension,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Expanded File Size Limit (Max 25MB with auto-compression)
      if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds 25MB limit. Please choose an image smaller than 25MB.');
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

      setIsCompressing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const rawDataUrl = event.target.result as string;
            // Auto-compress and optimize image
            const optimizedDataUrl = await compressImage(rawDataUrl, maxDimension);
            onChange(optimizedDataUrl);
          } catch (err) {
            console.error('Image compression failed:', err);
            onChange(event.target.result as string);
          } finally {
            setIsCompressing(false);
          }
        } else {
          setIsCompressing(false);
        }
      };
      reader.onerror = () => setIsCompressing(false);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 bg-[#181614] border border-stone-800 p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-stone-800/80 pb-2.5">
        <label className="text-xs text-stone-200 font-bold uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-orange-500" /> {label}
        </label>
        {recommendedSize && (
          <span className="text-[10px] text-orange-400 font-mono bg-orange-950/60 border border-orange-800/80 px-2.5 py-0.5 rounded-md font-bold">
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

      {isCompressing ? (
        /* Compression Loading State */
        <div className="border-2 border-dashed border-orange-500/50 rounded-xl p-6 text-center bg-orange-950/20 space-y-2">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
          <span className="text-xs font-bold text-orange-400 block">
            Compressing & Optimizing Image...
          </span>
          <span className="text-[10px] text-stone-400 block">
            Auto-formatting for fast web display & high resolution
          </span>
        </div>
      ) : value ? (
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-500 border border-orange-500/40 text-xs font-bold hover:bg-orange-500/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change Image
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-semibold hover:bg-rose-900/60 hover:text-rose-200 transition-all cursor-pointer"
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
          className="border-2 border-dashed border-stone-700/80 hover:border-orange-500 rounded-xl p-5 text-center cursor-pointer bg-stone-900/40 hover:bg-stone-900/80 transition-all group space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-200 block group-hover:text-orange-500 transition-colors">
              Click to Upload Image File from Device
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Supports PNG, JPG, WEBP, SVG (Auto-compressed / Max 25MB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};


