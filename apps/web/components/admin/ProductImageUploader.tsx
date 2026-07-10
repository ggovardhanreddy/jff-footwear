"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, Sparkles, Trash2, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@jff/api";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const MAX_FILES = 6;
const MAX_BYTES = 1.5 * 1024 * 1024;
const BUCKET = "product-images";

export type UploadedProductImage = {
  id: string;
  path: string;
  publicUrl: string;
  previewUrl: string;
  /** base64 without data: prefix — used for Edge Function analysis */
  base64: string;
  mimeType: string;
};

type Props = {
  images: UploadedProductImage[];
  onChange: (images: UploadedProductImage[]) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  disabled?: boolean;
  sessionFolder: string;
};

async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size <= MAX_BYTES && (file.type === "image/jpeg" || file.type === "image/webp")) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
  );
  if (!blob) throw new Error("Could not compress image");
  if (blob.size > MAX_BYTES) {
    const tighter = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.7)
    );
    if (!tighter) throw new Error("Image is too large after compression");
    return tighter;
  }
  return blob;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export default function ProductImageUploader({
  images,
  onChange,
  onAnalyze,
  analyzing,
  disabled,
  sessionFolder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const client = getSupabaseBrowserClient();
      if (!client) {
        setError("Supabase is not configured");
        return;
      }

      const files = Array.from(fileList).slice(0, MAX_FILES - images.length);
      if (!files.length) return;

      setUploading(true);
      setError("");
      const next = [...images];

      try {
        for (const file of files) {
          const blob = await compressImage(file);
          const id =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const path = `${sessionFolder}/${id}.jpg`;
          const { error: uploadError } = await client.storage
            .from(BUCKET)
            .upload(path, blob, { contentType: "image/jpeg", upsert: false });
          if (uploadError) throw new Error(uploadError.message);

          const { data } = client.storage.from(BUCKET).getPublicUrl(path);
          const base64 = await blobToBase64(blob);
          next.push({
            id,
            path,
            publicUrl: data.publicUrl,
            previewUrl: URL.createObjectURL(blob),
            base64,
            mimeType: "image/jpeg",
          });
        }
        onChange(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, sessionFolder]
  );

  const removeAt = async (index: number) => {
    const client = getSupabaseBrowserClient();
    const target = images[index];
    if (!target) return;
    if (client) {
      await client.storage.from(BUCKET).remove([target.path]);
    }
    URL.revokeObjectURL(target.previewUrl);
    onChange(images.filter((_, i) => i !== index));
  };

  const clearAll = async () => {
    const client = getSupabaseBrowserClient();
    if (client && images.length) {
      await client.storage.from(BUCKET).remove(images.map((i) => i.path));
    }
    images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "rounded-[1.5rem] border border-dashed p-6 transition-colors",
          dragOver
            ? "border-brand-accent bg-brand-accent/5"
            : "border-black/15 bg-white/60 dark:border-white/15 dark:bg-white/5",
          (disabled || uploading) && "pointer-events-none opacity-60"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/15 text-brand-accent">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
          </div>
          <div>
            <p className="font-medium">Upload product images</p>
            <p className="mt-1 text-sm text-brand-muted">
              Drop up to {MAX_FILES} photos (JPEG/PNG/WebP). Auto-compressed under 1.5&nbsp;MB. AI
              analyzes the first 3 images.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading || images.length >= MAX_FILES}
          >
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative h-24 w-24 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl || img.publicUrl}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                  Primary
                </span>
              )}
              <button
                type="button"
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                onClick={() => void removeAt(index)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={onAnalyze}
          disabled={disabled || analyzing || uploading || images.length === 0}
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze with AI
            </>
          )}
        </Button>
        {images.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => void clearAll()}
            disabled={analyzing}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear images
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
