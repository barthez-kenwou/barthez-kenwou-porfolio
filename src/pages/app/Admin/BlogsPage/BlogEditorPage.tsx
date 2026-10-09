import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { IBlog } from '@/entities/blogs/model/blog.type';
import {
  useBlogBySlug,
  useCreateBlog,
  useUpdateBlog,
} from '@/entities/blogs/hooks/useBlogs';
import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStickyActions,
  BilingualField,
  Field,
  MarkdownEditor,
  MediaCoverField,
  StringListEditor,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const emptyBlog = (): Omit<IBlog, 'id'> & { id?: string } => ({
  slug: '',
  titleFr: '',
  titleEn: '',
  excerptFr: '',
  excerptEn: '',
  contentFr: '',
  contentEn: '',
  image: '',
  category: 'Engineering',
  date: new Date().toISOString().slice(0, 10),
  readTime: '5 min',
  author: 'Barthez Kenwou',
  tags: [],
  isPublished: true,
});

export const AdminBlogEditorPage: React.FC = () => {
  const { blogId } = useParams();
  const isNew = blogId === 'new' || !blogId;
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const navigate = useNavigate();
  const create = useCreateBlog();
  const update = useUpdateBlog();
  const {
    data: blogResult,
    isPending,
    isError,
    error,
  } = useBlogBySlug(!isNew ? blogId : undefined, !isNew);

  const [draft, setDraft] = React.useState(emptyBlog());
  const [hydrated, setHydrated] = React.useState(isNew);
  const saving = create.isPending || update.isPending;

  React.useEffect(() => {
    if (isNew) {
      setDraft(emptyBlog());
      setHydrated(true);
      return;
    }
    const blog = blogResult?.data;
    if (blog) {
      setDraft({ ...blog });
      setHydrated(true);
    }
  }, [isNew, blogResult]);

  const patch = <K extends keyof IBlog>(key: K, value: IBlog[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!draft.titleFr.trim() || !draft.titleEn.trim()) {
      toast.error(fr ? 'Titres FR et EN requis' : 'FR and EN titles required');
      return;
    }
    const slug =
      draft.slug?.trim() ||
      draft.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const payload = {
      slug,
      titleFr: draft.titleFr.trim(),
      titleEn: draft.titleEn.trim(),
      excerptFr: draft.excerptFr,
      excerptEn: draft.excerptEn,
      contentFr: draft.contentFr,
      contentEn: draft.contentEn,
      image: draft.image,
      category: draft.category,
      date: draft.date,
      readTime: draft.readTime,
      author: draft.author,
      tags: draft.tags,
      isPublished: draft.isPublished,
    };
    try {
      if (isNew || !draft.id) {
        const created = await create.mutateAsync(payload);
        toast.success(fr ? 'Article enregistré' : 'Article saved');
        navigate(adminPath('blogs', created.id), { replace: true });
      } else {
        await update.mutateAsync({ id: draft.id, payload });
        toast.success(fr ? 'Article enregistré' : 'Article saved');
      }
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la sauvegarde' : 'Save failed');
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <AdminPageHeader
        title={
          isNew ? (fr ? 'Nouvel article' : 'New article') : fr ? 'Éditer l’article' : 'Edit article'
        }
        actions={
          <AdminStickyActions>
            <Button variant="outline" asChild className="flex-1 md:flex-none">
              <Link to={adminPath('blogs')}>
                <ArrowLeft className="size-4" />
                {fr ? 'Retour' : 'Back'}
              </Link>
            </Button>
            <Button
              onClick={() => void save()}
              disabled={saving || (!isNew && !hydrated)}
              className="flex-[1.4] md:flex-none"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {fr ? 'Enregistrer' : 'Save'}
            </Button>
          </AdminStickyActions>
        }
      />

      <QueryState
        isPending={!isNew && isPending}
        isError={!isNew && isError}
        errorMessage={isApiError(error) ? error.message : undefined}
      >
        <AdminSectionCard title={fr ? 'Métadonnées' : 'Metadata'}>
          <div className="grid gap-4 md:grid-cols-2">
            <BilingualField
              label={fr ? 'Titre' : 'Title'}
              required
              valueFr={draft.titleFr}
              valueEn={draft.titleEn}
              onChangeFr={(v) => patch('titleFr', v)}
              onChangeEn={(v) => patch('titleEn', v)}
            />
            <BilingualField
              label={fr ? 'Extrait' : 'Excerpt'}
              multiline
              rows={3}
              valueFr={draft.excerptFr}
              valueEn={draft.excerptEn}
              onChangeFr={(v) => patch('excerptFr', v)}
              onChangeEn={(v) => patch('excerptEn', v)}
            />
            <Field label="Slug">
              <Input value={draft.slug || ''} onChange={(e) => patch('slug', e.target.value)} />
            </Field>
            <Field label={fr ? 'Catégorie' : 'Category'}>
              <Input value={draft.category} onChange={(e) => patch('category', e.target.value)} />
            </Field>
            <Field label={fr ? 'Date' : 'Date'}>
              <Input
                type="date"
                value={(draft.date || '').slice(0, 10)}
                onChange={(e) => patch('date', e.target.value)}
              />
            </Field>
            <Field label={fr ? 'Temps de lecture' : 'Read time'}>
              <Input value={draft.readTime} onChange={(e) => patch('readTime', e.target.value)} />
            </Field>
            <Field label={fr ? 'Auteur' : 'Author'}>
              <Input value={draft.author} onChange={(e) => patch('author', e.target.value)} />
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium">
                  {fr ? 'Visible publiquement' : 'Publicly visible'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fr ? 'Masqué = hors vitrine' : 'Hidden = off the public site'}
                </p>
              </div>
              <Switch
                checked={draft.isPublished !== false}
                onCheckedChange={(v) => patch('isPublished', v)}
              />
            </div>
            <div className="md:col-span-2">
              <MediaCoverField
                label={fr ? 'Couverture' : 'Cover'}
                value={draft.image}
                onChange={(v) => patch('image', v)}
              />
            </div>
          </div>
          <div className="mt-4">
            <StringListEditor
              label="Tags"
              values={draft.tags}
              onChange={(v) => patch('tags', v)}
              placeholder="devops"
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Contenu Markdown' : 'Markdown content'} className="mt-6">
          <Tabs defaultValue="fr">
            <TabsList>
              <TabsTrigger value="fr">FR</TabsTrigger>
              <TabsTrigger value="en">EN</TabsTrigger>
            </TabsList>
            <TabsContent value="fr" className="mt-4">
              <MarkdownEditor
                label={fr ? 'Contenu' : 'Content'}
                languageLabel="FR"
                value={draft.contentFr}
                onChange={(v) => patch('contentFr', v)}
              />
            </TabsContent>
            <TabsContent value="en" className="mt-4">
              <MarkdownEditor
                label={fr ? 'Contenu' : 'Content'}
                languageLabel="EN"
                value={draft.contentEn}
                onChange={(v) => patch('contentEn', v)}
              />
            </TabsContent>
          </Tabs>
        </AdminSectionCard>
      </QueryState>
    </div>
  );
};
