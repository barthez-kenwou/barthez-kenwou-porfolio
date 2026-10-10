import React from 'react';
import { ImageIcon, Loader2, Plus, Trash2, Upload, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { uploadAdminImage } from '../api/files.api';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { isApiError } from '@/shared/api';
import { cn } from '@/shared/lib/utils';

export type MediaUrlListEditorProps = {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  kind?: 'image' | 'video' | 'any';
  className?: string;
};

function looksLikeImage(url: string) {
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(url.trim());
}

export function MediaUrlListEditor({
  label,
  urls,
  onChange,
  kind = 'any',
  className,
}: MediaUrlListEditorProps) {
  const language = useLanguageStore((s) => s.language);
  const isFr = language === 'fr';
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const updateAt = (index: number, next: string) => {
    onChange(urls.map((url, i) => (i === index ? next : url)));
  };

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const showImagePreview = (url: string) => {
    if (!url.trim()) return false;
    if (kind === 'video') return false;
    if (kind === 'image') return true;
    return looksLikeImage(url);
  };

  const onUpload = async (file: File | null) => {
    if (!file) return;
    if (kind === 'video') {
      toast.error(isFr ? 'Utilise une URL pour la vidéo' : 'Use a URL for video');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      onChange([...urls.filter((u) => u.trim()), url]);
      toast.success(isFr ? 'Image ajoutée' : 'Image added');
    } catch (e) {
      toast.error(
        isApiError(e)
          ? e.message
          : e instanceof Error
            ? e.message
            : isFr
              ? 'Échec du téléversement'
              : 'Upload failed',
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const KindIcon = kind === 'video' ? Video : ImageIcon;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-foreground">{label}</Label>
        <div className="flex flex-wrap gap-2">
          {kind !== 'video' ? (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer shadow-none"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                {isFr ? 'Upload' : 'Upload'}
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer shadow-none"
            onClick={() => onChange([...urls, ''])}
          >
            <Plus className="size-3.5" aria-hidden />
            {isFr ? 'URL' : 'URL'}
          </Button>
        </div>
      </div>

      {urls.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 bg-card/20 px-4 py-5 text-center text-sm text-muted-foreground">
          {isFr ? 'Aucune image.' : 'No images yet.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {urls.map((url, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded-md border border-border/50 bg-card/40 p-2"
            >
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border/40 bg-muted/30">
                {showImagePreview(url) ? (
                  <img
                    src={url}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <KindIcon className="size-4 text-muted-foreground" aria-hidden />
                )}
              </div>
              <Input
                value={url}
                onChange={(e) => updateAt(index, e.target.value)}
                placeholder={
                  kind === 'video'
                    ? 'https://…/video.mp4'
                    : kind === 'image'
                      ? 'https://…/image.webp'
                      : 'https://…'
                }
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                aria-label={`${label} ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeAt(index)}
                aria-label={isFr ? 'Supprimer' : 'Remove'}
                className="shrink-0 cursor-pointer text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
