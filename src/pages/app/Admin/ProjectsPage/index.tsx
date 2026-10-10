import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { IProject } from '@/entities/projets/model/project.types';
import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/entities/projets/hooks/useProjects';
import {
  AdminPageHeader,
  AdminDataTable,
  ConfirmDeleteDialog,
  formatAdminDate,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Switch } from '@/shared/ui/switch';

export function AdminProjectsPage() {
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useAdminProjects();
  const create = useCreateProject();
  const update = useUpdateProject();
  const remove = useDeleteProject();
  const [pending, setPending] = React.useState<IProject | null>(null);
  const projects = data?.items ?? [];

  const setPublished = async (row: IProject, value: boolean) => {
    try {
      await update.mutateAsync({ id: String(row.id), payload: { isPublished: value } });
      toast.success(
        value
          ? fr
            ? 'Projet publié'
            : 'Project published'
          : fr
            ? 'Projet masqué'
            : 'Project hidden',
      );
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const duplicate = async (row: IProject) => {
    const { id: _id, ...rest } = row;
    try {
      const copy = await create.mutateAsync({
        ...rest,
        titleFr: `${row.titleFr} (copie)`,
        titleEn: `${row.titleEn} (copy)`,
        isPublished: false,
        isFeatured: false,
      });
      toast.success(fr ? 'Copie créée' : 'Copy created');
      navigate(adminPath('projects', String(copy.id)));
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec' : 'Failed');
    }
  };

  const copyPublicLink = (row: IProject) => {
    const path = `/projects/${row.id}`;
    void navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success(fr ? 'Lien copié' : 'Link copied');
  };

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await remove.mutateAsync(String(pending.id));
      toast.success(fr ? 'Projet supprimé' : 'Project deleted');
      setPending(null);
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la suppression' : 'Delete failed');
    }
  };

  const statuses = Array.from(new Set(projects.map((p) => p.status).filter(Boolean)));
  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));

  return (
    <div>
      <AdminPageHeader
        title={fr ? 'Projets' : 'Projects'}
        actions={
          <Button asChild>
            <Link to={adminPath('projects', 'new')}>
              <Plus className="size-4" />
              {fr ? 'Nouveau projet' : 'New project'}
            </Link>
          </Button>
        }
      />
      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={isApiError(error) ? error.message : undefined}
      >
        <AdminDataTable<IProject>
          data={projects}
          getRowId={(r) => String(r.id)}
          searchKeys={['titleFr', 'titleEn', 'category', 'status', 'role']}
          searchPlaceholder={fr ? 'Titre, catégorie, rôle…' : 'Title, category, role…'}
          emptyTitle={fr ? 'Aucun projet' : 'No projects'}
          onRowClick={(r) => navigate(adminPath('projects', String(r.id)))}
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
              key: 'status',
              label: 'Status',
              options: statuses.map((s) => ({ value: s, label: s })),
            },
            {
              key: 'category',
              label: fr ? 'Catégorie' : 'Category',
              options: categories.map((c) => ({ value: c, label: c })),
            },
          ]}
          columns={[
            {
              key: 'title',
              header: fr ? 'Titre' : 'Title',
              render: (r) => (
                <div>
                  <p className="max-w-[280px] truncate font-medium">{fr ? r.titleFr : r.titleEn}</p>
                  <p className="text-xs text-muted-foreground">#{r.id}</p>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => (
                <Badge variant="secondary" className="max-w-[8.5rem] truncate">
                  <span className="truncate">{r.status}</span>
                </Badge>
              ),
            },
            {
              key: 'category',
              header: fr ? 'Catégorie' : 'Category',
              hideOnMobile: true,
              render: (r) => (
                <span className="line-clamp-1 max-w-[10rem] text-muted-foreground">
                  {r.category || '—'}
                </span>
              ),
            },
            {
              key: 'date',
              header: fr ? 'Date' : 'Date',
              hideOnMobile: true,
              render: (r) => (
                <span className="line-clamp-1 whitespace-nowrap text-muted-foreground">
                  {formatAdminDate(r.date, language)}
                </span>
              ),
            },
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
              <Button size="icon-sm" variant="ghost" className="size-11 md:size-8" asChild>
                <a href={`/projects/${r.id}`} target="_blank" rel="noreferrer">
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
                <Link to={adminPath('projects', String(r.id))}>
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
