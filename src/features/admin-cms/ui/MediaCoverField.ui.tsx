import React from 'react';
import { ImagePlus, Link2, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Field } from './Field.ui';
import { uploadAdminImage } from '../api/files.api';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { isApiError } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import {
  COVER_COMPRESS,
  type CompressImageOptions,
} from '@/shared/lib/compressImage';

type MediaCoverFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
  /**
   * Frame classes for the public-style preview (aspect ratio / crop).
   * Pass the same ratios as the public surface so editors see the final crop.
   * Defaults to a fixed-height strip for generic CMS usage.
   */
  previewClassName?: string;
  /** How the image fills the preview frame — contain for logos, cover for photos */
  previewFit?: 'cover' | 'contain';
  /** Extra classes on the preview <img> (e.g. max sizes matching public cells) */
  previewImgClassName?: string;
  /** stack = preview under controls; aside = controls left / live preview right */
  layout?: 'stack' | 'aside';
  /**
   * Client compression before upload.
   * Use `LOGO_COMPRESS` for partner logos, `COVER_COMPRESS` (default) for photos.
   */
  compressOptions?: CompressImageOptions;
};

export function MediaCoverField({
  label,
  value,
  onChange,
  className,
  previewClassName,
  previewFit = 'cover',
  previewImgClassName,
  layout = 'stack',
  compressOptions = COVER_COMPRESS,
}: MediaCoverFieldProps) {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const onFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(fr ? 'Fichier image requis' : 'Image file required');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadAdminImage(file, compressOptions);
      onChange(url);
      toast.success(
        fr ? 'Image compressée et téléversée' : 'Image compressed and uploaded',
      );
    } catch (e) {
      toast.error(
        isApiError(e)
          ? e.message
          : e instanceof Error
            ? e.message
            : fr
              ? 'Échec du téléversement'
              : 'Upload failed',
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const frameClass = cn(
    'relative overflow-hidden rounded-md border border-border/40 bg-muted/20',
    previewFit === 'contain' && 'flex items-center justify-center',
    previewClassName ?? 'h-36',
  );

  const preview = (
    <div className="space-y-1.5">
      {layout === 'aside' ? (
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {fr ? 'Aperçu public' : 'Public preview'}
        </p>
      ) : null}
      <div className={frameClass}>
        {value ? (
          <>
            <img
              src={value}
              alt=""
              className={cn(
                previewFit === 'contain'
                  ? 'max-h-full max-w-full object-contain object-center'
                  : 'h-full w-full object-cover',
                previewImgClassName,
              )}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="absolute right-2 top-2 cursor-pointer"
              onClick={() => onChange('')}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        ) : (
          <div className="flex h-full min-h-[4.5rem] w-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
            {fr ? 'Aucun média' : 'No media'}
          </div>
        )}
      </div>
    </div>
  );

  const controls = (
    <Tabs defaultValue="upload" className="gap-2">
      <TabsList className="h-9 rounded-md">
        <TabsTrigger value="upload" className="rounded-sm">
          {fr ? 'Fichier' : 'File'}
        </TabsTrigger>
        <TabsTrigger value="url" className="rounded-sm">
          URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70',
            'bg-muted/15 px-4 py-7 text-sm text-muted-foreground transition-colors hover:border-primary/35 hover:bg-muted/30',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : (
            <ImagePlus className="size-5 text-primary" />
          )}
          {uploading
            ? fr
              ? 'Téléversement…'
              : 'Uploading…'
            : fr
              ? compressOptions.kind === 'logo'
                ? 'Choisir un logo (compressé, fond transparent conservé)'
                : 'Choisir une image (compressée en WebP)'
              : compressOptions.kind === 'logo'
                ? 'Choose a logo (compressed, alpha preserved)'
                : 'Choose an image (compressed to WebP)'}
        </button>
      </TabsContent>

      <TabsContent value="url">
        <div className="relative">
          <Link2 className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            className="pl-8 shadow-none focus-visible:ring-1"
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <Field label={label} className={className}>
      {layout === 'aside' ? (
        <div className="grid gap-3 md:grid-cols-2 md:items-start">
          {controls}
          {preview}
        </div>
      ) : (
        <>
          {controls}
          {value || previewClassName ? <div className="mt-3">{preview}</div> : null}
        </>
      )}
    </Field>
  );
}
