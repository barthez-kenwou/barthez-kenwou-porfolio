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

type MediaCoverFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
};

export function MediaCoverField({ label, value, onChange, className }: MediaCoverFieldProps) {
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
      const url = await uploadAdminImage(file);
      onChange(url);
      toast.success(fr ? 'Image téléversée' : 'Image uploaded');
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

  return (
    <Field
      label={label}
      hint={
        fr
          ? 'Téléversement vers le stockage (presign) · URL externe possible'
          : 'Upload to storage (presign) · external URL also fine'
      }
      className={className}
    >
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
              'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/70',
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
                ? 'Choisir une image'
                : 'Choose an image'}
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

      {value ? (
        <div className="relative mt-3 overflow-hidden rounded-md border border-border/60">
          <img src={value} alt="" className="h-36 w-full object-cover" />
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => onChange('')}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </Field>
  );
}
