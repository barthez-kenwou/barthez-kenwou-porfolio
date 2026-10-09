import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  AdminDataTable,
  ConfirmDeleteDialog,
} from '@/features/admin-cms';
import type { IBlog } from '@/entities/blogs/model/blog.type';
import {
  useAdminBlogs,
  useCreateBlog,
  usePublishBlog,
  useDeleteBlog,
} from '@/entities/blogs/hooks/useBlogs';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Switch } from '@/shared/ui/switch';

export function AdminBlogsPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useAdminBlogs();
  const create = useCreateBlog();
  const publish = usePublishBlog();
  const remove = useDeleteBlog();
  const [pending, setPending] = React.useState<IBlog | null>(null);
  const blogs = data?.items ?? [];

  const setPublished = async (row: IBlog, value: boolean) => {
    try {
      await publish.mutateAsync({ id: row.id, isPublished: value });
      toast.success(
        value
          ? fr
            ? 'Article publié'
            : 'Article published'
          : fr
            ? 'Article dépublié'
            : 'Article unpublished',
      );
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const duplicate = async (row: IBlog) => {
    const { id: _id, ...rest } = row;
    try {
      const copy = await create.mutateAsync({
        ...rest,
        slug: row.slug ? `${row.slug}-copy` : undefined,
        titleFr: `${row.titleFr} (copie)`,
        titleEn: `${row.titleEn} (copy)`,
        isPublished: false,
      });
      toast.success(fr ? 'Copie créée' : 'Copy created');
      navigate(adminPath('blogs', String(copy.id)));
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const copyPublicLink = (row: IBlog) => {
    const path = `/blog/${row.slug || row.id}`;
    void navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success(fr ? 'Lien copié' : 'Link copied');
  };

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await remove.mutateAsync(pending.id);
      toast.success(fr ? 'Article supprimé' : 'Article deleted');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Blogs"
        actions={
          <Button asChild>
            <Link to={adminPath('blogs', 'new')}>
              <Plus className="size-4" />
              {fr ? 'Nouvel article' : 'New article'}
            </Link>
          </Button>
        }
      />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
        empty={!isPending && !isError && blogs.length === 0}
        emptyTitle={fr ? 'Aucun article' : 'No articles'}
      >
        <AdminDataTable<IBlog>
          data={blogs}
          getRowId={(r) => r.id}
          searchKeys={['titleFr', 'titleEn', 'slug', 'category', 'author', 'tags']}
          searchPlaceholder={fr ? 'Titre, slug, tags…' : 'Title, slug, tags…'}
          emptyTitle={fr ? 'Aucun article' : 'No articles'}
          emptyDescription={fr ? 'Crée ton premier article.' : 'Create your first article.'}
          onRowClick={(r) => navigate(adminPath('blogs', r.id))}
          filters={[
            {
              key: 'isPublished',
              label: fr ? 'Visibilité' : 'Visibility',
              options: [
                { value: 'true', label: fr ? 'Publié' : 'Published' },
                { value: 'false', label: fr ? 'Masqué' : 'Hidden' },
              ],
              match: (row, selected) => {
                const published = row.isPublished !== false;
                return selected === 'true' ? published : !published;
              },
            },
            {
              key: 'category',
              label: fr ? 'Catégorie' : 'Category',
              options: Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))).map(
                (c) => ({
                  value: c,
                  label: c,
                }),
              ),
            },
          ]}
          columns={[
            {
              key: 'title',
              header: fr ? 'Titre' : 'Title',
              render: (r) => (
                <div className="min-w-0">
                  <p className="max-w-[320px] truncate font-medium">{fr ? r.titleFr : r.titleEn}</p>
                  <p className="max-w-[320px] truncate text-xs text-muted-foreground">
                    {r.slug || r.id}
                  </p>
                </div>
              ),
            },
            {
              key: 'category',
              header: fr ? 'Catégorie' : 'Category',
              render: (r) => <Badge variant="secondary">{r.category}</Badge>,
            },
            { key: 'date', header: fr ? 'Date' : 'Date', hideOnMobile: true },
            {
              key: 'isPublished',
              header: fr ? 'Public' : 'Public',
              className: 'w-[7rem]',
              render: (r) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={r.isPublished !== false}
                    onCheckedChange={(v) => void setPublished(r, v)}
                    aria-label={fr ? 'Visibilité publique' : 'Public visibility'}
                  />
                </div>
              ),
            },
          ]}
          actions={(r) => (
            <>
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-11 md:size-8"
                title={fr ? 'Lien public' : 'Public link'}
                onClick={() => copyPublicLink(r)}
              >
                <Copy className="size-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-11 md:size-8"
                asChild
                title={fr ? 'Ouvrir' : 'Open'}
              >
                <a href={`/blog/${r.slug || r.id}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-11 md:size-8"
                title={fr ? 'Dupliquer' : 'Duplicate'}
                onClick={() => void duplicate(r)}
              >
                <Plus className="size-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" className="size-11 md:size-8" asChild>
                <Link to={adminPath('blogs', r.id)}>
                  <Pencil className="size-3.5" />
                </Link>
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-11 md:size-8"
                onClick={() => setPending(r)}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </>
          )}
        />
      </QueryState>

      <ConfirmDeleteDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
