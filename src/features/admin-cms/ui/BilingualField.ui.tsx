import React from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { cn } from '@/shared/lib/utils';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { translateAdminText, type TranslateLang } from '../api/translate.api';

export type BilingualFieldProps = {
  label: string;
  valueFr: string;
  valueEn: string;
  onChangeFr: (value: string) => void;
  onChangeEn: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  placeholderFr?: string;
  placeholderEn?: string;
  className?: string;
};

export function BilingualField({
  label,
  valueFr,
  valueEn,
  onChangeFr,
  onChangeEn,
  multiline = false,
  rows = 4,
  required = false,
  placeholderFr,
  placeholderEn,
  className,
}: BilingualFieldProps) {
  const uiLang = useLanguageStore((s) => s.language);
  const isFr = uiLang === 'fr';
  const [tab, setTab] = React.useState<TranslateLang>('fr');
  const [translating, setTranslating] = React.useState(false);

  const sourceLang: TranslateLang = tab;
  const targetLang: TranslateLang = tab === 'fr' ? 'en' : 'fr';
  const sourceValue = sourceLang === 'fr' ? valueFr : valueEn;

  const onTranslate = async () => {
    if (!sourceValue.trim()) {
      toast.error(isFr ? 'Écris d’abord le texte source' : 'Write the source text first');
      return;
    }

    setTranslating(true);
    try {
      const out = await translateAdminText(sourceValue, sourceLang, targetLang);
      if (targetLang === 'fr') onChangeFr(out);
      else onChangeEn(out);
      toast.success(
        isFr
          ? `Traduit ${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()} — vérifie le résultat`
          : `Translated ${sourceLang.toUpperCase()} → ${targetLang.toUpperCase()} — please review`,
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : isFr ? 'Traduction impossible' : 'Translation failed',
      );
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-foreground">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            'h-8 gap-1 px-2.5 shadow-none',
            translating ? 'cursor-wait disabled:cursor-wait disabled:opacity-80' : 'cursor-pointer',
          )}
          disabled={translating || !sourceValue.trim()}
          onClick={() => void onTranslate()}
          aria-busy={translating}
          aria-label={
            translating
              ? isFr
                ? 'Traduction en cours…'
                : 'Translating…'
              : isFr
                ? `Traduire vers ${targetLang.toUpperCase()}`
                : `Translate to ${targetLang.toUpperCase()}`
          }
          title={
            translating
              ? isFr
                ? 'Traduction en cours…'
                : 'Translating…'
              : isFr
                ? `Traduire vers ${targetLang.toUpperCase()}`
                : `Translate to ${targetLang.toUpperCase()}`
          }
        >
          {translating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Languages className="size-3.5" />
          )}
          <span className="text-xs font-medium tracking-wide">→ {targetLang.toUpperCase()}</span>
        </Button>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as TranslateLang)} className="gap-2.5">
        <TabsList className="h-9">
          <TabsTrigger value="fr" className="gap-1.5">
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] tracking-wide">
              FR
            </Badge>
            Français
          </TabsTrigger>
          <TabsTrigger value="en" className="gap-1.5">
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] tracking-wide">
              EN
            </Badge>
            English
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fr">
          {multiline ? (
            <Textarea
              value={valueFr}
              onChange={(e) => onChangeFr(e.target.value)}
              placeholder={placeholderFr}
              required={required}
              rows={rows}
              aria-label={`${label} (FR)`}
            />
          ) : (
            <Input
              value={valueFr}
              onChange={(e) => onChangeFr(e.target.value)}
              placeholder={placeholderFr}
              required={required}
              aria-label={`${label} (FR)`}
            />
          )}
        </TabsContent>
        <TabsContent value="en">
          {multiline ? (
            <Textarea
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholderEn}
              required={required}
              rows={rows}
              aria-label={`${label} (EN)`}
            />
          ) : (
            <Input
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholderEn}
              required={required}
              aria-label={`${label} (EN)`}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
