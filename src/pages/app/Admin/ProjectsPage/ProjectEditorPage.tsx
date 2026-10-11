import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type {
  IProject,
  IProjectBeforeAfter,
  IProjectDecision,
  IProjectDiagram,
  IProjectGalleryItem,
  IProjectLink,
  IProjectMilestone,
  IProjectResource,
  IProjectVideo,
  ProjectGalleryKind,
  ProjectResourceType,
  ProjectVideoType,
} from '@/entities/projets/model/project.types';
import {
  useProject,
  useCreateProject,
  useUpdateProject,
} from '@/entities/projets/hooks/useProjects';
import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStickyActions,
  BilingualField,
  BilingualStringListEditor,
  Field,
  KeyValueEditor,
  MediaCoverField,
  MediaUrlListEditor,
  MermaidEditor,
  StringListEditor,
  useDraftDirtyFlag,
  useUnsavedChangesGuard,
} from '@/features/admin-cms';
import { isApiError } from '@/shared/api';
import { QueryState } from '@/shared/ui/QueryState';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { resolveVideoMedia } from '@/shared/lib/videoEmbed';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ProjectVideoPlayer } from '@/shared/ui/ProjectVideoPlayer';
import { Switch } from '@/shared/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type ProjectDraft = Omit<IProject, 'id'> & { id?: IProject['id'] };

const emptyProject = (): ProjectDraft => ({
  titleFr: '',
  titleEn: '',
  descriptionFr: '',
  descriptionEn: '',
  fullDescriptionFr: '',
  fullDescriptionEn: '',
  problemFr: '',
  problemEn: '',
  solutionFr: [],
  solutionEn: [],
  challengesFr: [],
  challengesEn: [],
  impactFr: [],
  impactEn: [],
  metrics: {},
  techStack: { frontend: [], backend: [], database: [], devops: [] },
  architecture: [],
  testing: [],
  images: [],
  preview: '',
  videoDemo: '',
  videos: [],
  category: 'Fullstack',
  status: 'Production',
  complexity: 'Intermédiaire',
  role: 'Full Stack Developer',
  teamSize: 1,
  duration: '',
  date: new Date().getFullYear().toString(),
  github: '',
  demo: '',
  businessContextFr: '',
  businessContextEn: '',
  isFeatured: false,
  isPublished: true,
  confidential: false,
  responsibilitiesFr: [],
  responsibilitiesEn: [],
  gallery: [],
  diagrams: [],
  resources: [],
  milestones: [],
  scopeFr: [],
  scopeEn: [],
  nonGoalsFr: [],
  nonGoalsEn: [],
  decisions: [],
  securityFr: [],
  securityEn: [],
  infraFr: [],
  infraEn: [],
  externalLinks: [],
  lessonsFr: [],
  lessonsEn: [],
  beforeAfter: [],
});

const VIDEO_TYPES: ProjectVideoType[] = ['demo', 'walkthrough', 'testimonial', 'presentation'];
const GALLERY_KINDS: ProjectGalleryKind[] = [
  'ui',
  'wip',
  'diagram',
  'metric',
  'test',
  'infra',
  'process',
  'other',
];
const RESOURCE_TYPES: ProjectResourceType[] = [
  'spec',
  'report',
  'case-study',
  'slides',
  'other',
];

const emptyVideo = (): IProjectVideo => ({
  url: '',
  type: 'demo',
  titleFr: '',
  titleEn: '',
  alternateUrls: [],
});

const emptyGalleryItem = (): IProjectGalleryItem => ({
  src: '',
  captionFr: '',
  captionEn: '',
  kind: 'ui',
});

const emptyMilestone = (): IProjectMilestone => ({
  labelFr: '',
  labelEn: '',
  date: '',
  descriptionFr: '',
  descriptionEn: '',
});

const emptyDecision = (): IProjectDecision => ({
  titleFr: '',
  titleEn: '',
  decisionFr: '',
  decisionEn: '',
  rationaleFr: '',
  rationaleEn: '',
});

const emptyResource = (): IProjectResource => ({
  labelFr: '',
  labelEn: '',
  url: '',
  type: 'other',
});

const emptyLink = (): IProjectLink => ({
  labelFr: '',
  labelEn: '',
  url: '',
});

const emptyBeforeAfter = (): IProjectBeforeAfter => ({
  beforeSrc: '',
  afterSrc: '',
  captionFr: '',
  captionEn: '',
});

export const AdminProjectEditorPage: React.FC = () => {
  const { projectId } = useParams();
  const isNew = projectId === 'new' || !projectId;
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const navigate = useNavigate();
  const create = useCreateProject();
  const update = useUpdateProject();
  const {
    data: project,
    isPending,
    isError,
    error,
  } = useProject(!isNew ? projectId : undefined, !isNew);

  const [draft, setDraft] = React.useState<ProjectDraft>(emptyProject());
  const [hydrated, setHydrated] = React.useState(isNew);
  const saving = create.isPending || update.isPending;
  const { isDirty, markClean, resetBaseline } = useDraftDirtyFlag(draft);
  const { dialog: unsavedDialog, allowNextNavigation } = useUnsavedChangesGuard(
    isDirty && hydrated && !saving,
  );

  React.useEffect(() => {
    if (isNew) {
      const initial = emptyProject();
      setDraft(initial);
      setHydrated(true);
      resetBaseline(initial);
      return;
    }
    if (project) {
      const next: ProjectDraft = {
        ...emptyProject(),
        ...project,
        videos: project.videos ?? [],
        gallery: project.gallery ?? [],
        diagrams: project.diagrams ?? [],
        milestones: project.milestones ?? [],
        decisions: project.decisions ?? [],
        resources: project.resources ?? [],
        externalLinks: project.externalLinks ?? [],
        beforeAfter: project.beforeAfter ?? [],
        scopeFr: project.scopeFr ?? [],
        scopeEn: project.scopeEn ?? [],
        nonGoalsFr: project.nonGoalsFr ?? [],
        nonGoalsEn: project.nonGoalsEn ?? [],
        securityFr: project.securityFr ?? [],
        securityEn: project.securityEn ?? [],
        infraFr: project.infraFr ?? [],
        infraEn: project.infraEn ?? [],
      };
      // Migrate legacy single videoDemo into the editable list when videos[] is empty
      if (next.videos.length === 0 && next.videoDemo?.trim()) {
        next.videos = [{ ...emptyVideo(), url: next.videoDemo.trim(), type: 'demo' }];
      }
      setDraft(next);
      setHydrated(true);
      resetBaseline(next);
    }
  }, [isNew, project, resetBaseline]);

  const patch = <K extends keyof IProject>(key: K, value: IProject[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!draft.titleFr.trim() || !draft.titleEn.trim()) {
      toast.error(fr ? 'Titres FR/EN requis' : 'FR/EN titles required');
      return;
    }

    const videos = (draft.videos ?? [])
      .map((v) => ({
        ...v,
        url: v.url.trim(),
        titleFr: v.titleFr?.trim() || undefined,
        titleEn: v.titleEn?.trim() || undefined,
        alternateUrls: (v.alternateUrls ?? []).map((u) => u.trim()).filter(Boolean),
      }))
      .filter((v) => v.url.length > 0)
      .map((v) =>
        v.alternateUrls && v.alternateUrls.length > 0 ? v : { ...v, alternateUrls: undefined },
      );

    const gallery = (draft.gallery ?? [])
      .map((g) => ({
        ...g,
        src: g.src.trim(),
        captionFr: g.captionFr?.trim() || undefined,
        captionEn: g.captionEn?.trim() || undefined,
        kind: g.kind || 'other',
      }))
      .filter((g) => g.src.length > 0);

    const diagrams = (draft.diagrams ?? [])
      .map((d) => ({
        ...d,
        id: d.id?.trim() || `d_${Date.now()}`,
        titleFr: d.titleFr.trim(),
        titleEn: d.titleEn.trim(),
        mermaid: d.mermaid.trim(),
      }))
      .filter((d) => d.mermaid.length > 0 && (d.titleFr.length > 0 || d.titleEn.length > 0));

    const milestones = (draft.milestones ?? [])
      .map((m) => ({
        ...m,
        labelFr: m.labelFr.trim(),
        labelEn: m.labelEn.trim(),
        date: m.date?.trim() || undefined,
        descriptionFr: m.descriptionFr?.trim() || undefined,
        descriptionEn: m.descriptionEn?.trim() || undefined,
      }))
      .filter((m) => m.labelFr.length > 0 || m.labelEn.length > 0);

    const decisions = (draft.decisions ?? [])
      .map((d) => ({
        ...d,
        titleFr: d.titleFr.trim(),
        titleEn: d.titleEn.trim(),
        decisionFr: d.decisionFr.trim(),
        decisionEn: d.decisionEn.trim(),
        rationaleFr: d.rationaleFr?.trim() || undefined,
        rationaleEn: d.rationaleEn?.trim() || undefined,
      }))
      .filter(
        (d) =>
          d.titleFr.length > 0 ||
          d.titleEn.length > 0 ||
          d.decisionFr.length > 0 ||
          d.decisionEn.length > 0,
      );

    const resources = (draft.resources ?? [])
      .map((r) => ({
        ...r,
        labelFr: r.labelFr.trim(),
        labelEn: r.labelEn.trim(),
        url: r.url.trim(),
        type: r.type || 'other',
      }))
      .filter((r) => r.url.length > 0 && (r.labelFr.length > 0 || r.labelEn.length > 0));

    const externalLinks = (draft.externalLinks ?? [])
      .map((l) => ({
        ...l,
        labelFr: l.labelFr.trim(),
        labelEn: l.labelEn.trim(),
        url: l.url.trim(),
      }))
      .filter((l) => l.url.length > 0 && (l.labelFr.length > 0 || l.labelEn.length > 0));

    const beforeAfter = (draft.beforeAfter ?? [])
      .map((b) => ({
        ...b,
        beforeSrc: b.beforeSrc.trim(),
        afterSrc: b.afterSrc.trim(),
        captionFr: b.captionFr?.trim() || undefined,
        captionEn: b.captionEn?.trim() || undefined,
      }))
      .filter((b) => b.beforeSrc.length > 0 && b.afterSrc.length > 0);

    const testimonial = draft.testimonial;
    const cleanedTestimonial =
      testimonial &&
      (testimonial.quoteFr?.trim() || testimonial.quoteEn?.trim()) &&
      testimonial.author?.trim()
        ? {
            quoteFr: testimonial.quoteFr.trim(),
            quoteEn: testimonial.quoteEn.trim(),
            author: testimonial.author.trim(),
            roleFr: testimonial.roleFr?.trim() || undefined,
            roleEn: testimonial.roleEn?.trim() || undefined,
            company: testimonial.company?.trim() || undefined,
          }
        : undefined;

    const { id: _id, ...rest } = draft;
    const payload = {
      ...rest,
      images: (draft.images ?? []).map((u) => u.trim()).filter(Boolean),
      videos,
      gallery,
      diagrams,
      milestones,
      decisions,
      resources,
      externalLinks,
      beforeAfter,
      testimonial: cleanedTestimonial,
      videoDemo: videos[0]?.url ?? '',
      scopeFr: (draft.scopeFr ?? []).map((s) => s.trim()).filter(Boolean),
      scopeEn: (draft.scopeEn ?? []).map((s) => s.trim()).filter(Boolean),
      nonGoalsFr: (draft.nonGoalsFr ?? []).map((s) => s.trim()).filter(Boolean),
      nonGoalsEn: (draft.nonGoalsEn ?? []).map((s) => s.trim()).filter(Boolean),
      securityFr: (draft.securityFr ?? []).map((s) => s.trim()).filter(Boolean),
      securityEn: (draft.securityEn ?? []).map((s) => s.trim()).filter(Boolean),
      infraFr: (draft.infraFr ?? []).map((s) => s.trim()).filter(Boolean),
      infraEn: (draft.infraEn ?? []).map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isNew || draft.id === undefined || draft.id === null || draft.id === '') {
        const created = await create.mutateAsync(payload);
        markClean({ ...draft, ...payload, id: created.id });
        allowNextNavigation();
        toast.success(fr ? 'Projet enregistré' : 'Project saved');
        navigate(adminPath('projects', String(created.id)), { replace: true });
      } else {
        await update.mutateAsync({ id: String(draft.id), payload });
        markClean({ ...draft, ...payload });
        toast.success(fr ? 'Projet enregistré' : 'Project saved');
      }
    } catch (e) {
      toast.error(isApiError(e) ? e.message : fr ? 'Échec de la sauvegarde' : 'Save failed');
    }
  };

  const gallery = draft.gallery || [];
  const diagrams = draft.diagrams || [];
  const videos = draft.videos || [];
  const milestones = draft.milestones || [];
  const decisions = draft.decisions || [];
  const resources = draft.resources || [];
  const externalLinks = draft.externalLinks || [];
  const beforeAfter = draft.beforeAfter || [];

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {unsavedDialog}
      <AdminPageHeader
        title={
          isNew ? (fr ? 'Nouveau projet' : 'New project') : fr ? 'Éditer le projet' : 'Edit project'
        }
        actions={
          <AdminStickyActions>
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer md:flex-none"
              onClick={() => navigate(adminPath('projects'))}
            >
              <ArrowLeft className="size-4" />
              {fr ? 'Retour' : 'Back'}
            </Button>
            <Button
              onClick={() => void save()}
              disabled={saving || (!isNew && !hydrated)}
              className="flex-[1.4] cursor-pointer md:flex-none"
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
        <AdminSectionCard title={fr ? 'Identité' : 'Identity'}>
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
              label={fr ? 'Description courte' : 'Short description'}
              multiline
              valueFr={draft.descriptionFr}
              valueEn={draft.descriptionEn}
              onChangeFr={(v) => patch('descriptionFr', v)}
              onChangeEn={(v) => patch('descriptionEn', v)}
            />
            <Field label={fr ? 'Catégorie' : 'Category'}>
              <Input value={draft.category} onChange={(e) => patch('category', e.target.value)} />
            </Field>
            <Field label="Status">
              <Select
                value={draft.status}
                onValueChange={(v) => patch('status', v as IProject['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Production', 'En cours', 'Actif', 'MVP', 'Archivé'].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={fr ? 'Rôle' : 'Role'}>
              <Input value={draft.role} onChange={(e) => patch('role', e.target.value)} />
            </Field>
            <Field label={fr ? 'Complexité' : 'Complexity'}>
              <Input
                value={draft.complexity}
                onChange={(e) => patch('complexity', e.target.value)}
              />
            </Field>
            <Field label={fr ? 'Durée' : 'Duration'}>
              <Input value={draft.duration} onChange={(e) => patch('duration', e.target.value)} />
            </Field>
            <Field label={fr ? 'Date' : 'Date'}>
              <Input value={draft.date} onChange={(e) => patch('date', e.target.value)} />
            </Field>
            <Field label="GitHub">
              <Input value={draft.github || ''} onChange={(e) => patch('github', e.target.value)} />
            </Field>
            <Field label="Demo">
              <Input value={draft.demo || ''} onChange={(e) => patch('demo', e.target.value)} />
            </Field>
            <Field label={fr ? 'Taille équipe' : 'Team size'}>
              <Input
                type="number"
                value={draft.teamSize ?? 1}
                onChange={(e) => patch('teamSize', Number(e.target.value))}
              />
            </Field>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <p className="text-sm font-medium">
                {fr ? 'Visible publiquement' : 'Publicly visible'}
              </p>
              <Switch
                checked={draft.isPublished !== false}
                onCheckedChange={(v) => patch('isPublished', v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <span className="text-sm">{fr ? 'Mis en avant' : 'Featured'}</span>
              <Switch
                checked={!!draft.isFeatured}
                onCheckedChange={(v) => patch('isFeatured', v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
              <span className="text-sm">Confidential / NDA</span>
              <Switch
                checked={!!draft.confidential}
                onCheckedChange={(v) => patch('confidential', v)}
              />
            </div>
            <div className="md:col-span-2">
              <MediaCoverField
                label={fr ? 'Image de couverture' : 'Cover image'}
                value={draft.preview}
                onChange={(v) => patch('preview', v)}
                layout="aside"
                previewClassName="aspect-[2.15/1] sm:aspect-[2.35/1] md:aspect-[2.75/1]"
              />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Narratif' : 'Narrative'} className="mt-6">
          <div className="space-y-4">
            <BilingualField
              label={fr ? 'Description complète' : 'Full description'}
              multiline
              rows={8}
              valueFr={draft.fullDescriptionFr || ''}
              valueEn={draft.fullDescriptionEn || ''}
              onChangeFr={(v) => patch('fullDescriptionFr', v)}
              onChangeEn={(v) => patch('fullDescriptionEn', v)}
            />
            <BilingualField
              label={fr ? 'Problème' : 'Problem'}
              multiline
              valueFr={draft.problemFr}
              valueEn={draft.problemEn}
              onChangeFr={(v) => patch('problemFr', v)}
              onChangeEn={(v) => patch('problemEn', v)}
            />
            <BilingualField
              label={fr ? 'Contexte business' : 'Business context'}
              multiline
              valueFr={draft.businessContextFr || ''}
              valueEn={draft.businessContextEn || ''}
              onChangeFr={(v) => patch('businessContextFr', v)}
              onChangeEn={(v) => patch('businessContextEn', v)}
            />
            <BilingualStringListEditor
              label={fr ? 'Solutions' : 'Solutions'}
              valuesFr={draft.solutionFr}
              valuesEn={draft.solutionEn}
              onChangeFr={(v) => patch('solutionFr', v)}
              onChangeEn={(v) => patch('solutionEn', v)}
            />
            <BilingualStringListEditor
              label={fr ? 'Challenges' : 'Challenges'}
              valuesFr={draft.challengesFr || []}
              valuesEn={draft.challengesEn || []}
              onChangeFr={(v) => patch('challengesFr', v)}
              onChangeEn={(v) => patch('challengesEn', v)}
            />
            <BilingualStringListEditor
              label="Impact"
              valuesFr={draft.impactFr}
              valuesEn={draft.impactEn}
              onChangeFr={(v) => patch('impactFr', v)}
              onChangeEn={(v) => patch('impactEn', v)}
            />
            <BilingualStringListEditor
              label={fr ? 'Leçons' : 'Lessons'}
              valuesFr={draft.lessonsFr || []}
              valuesEn={draft.lessonsEn || []}
              onChangeFr={(v) => patch('lessonsFr', v)}
              onChangeEn={(v) => patch('lessonsEn', v)}
            />
            <BilingualStringListEditor
              label={fr ? 'Responsabilités' : 'Responsibilities'}
              valuesFr={draft.responsibilitiesFr || []}
              valuesEn={draft.responsibilitiesEn || []}
              onChangeFr={(v) => patch('responsibilitiesFr', v)}
              onChangeEn={(v) => patch('responsibilitiesEn', v)}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Tech stack" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <StringListEditor
              label="Frontend"
              values={draft.techStack.frontend || []}
              onChange={(v) => patch('techStack', { ...draft.techStack, frontend: v })}
            />
            <StringListEditor
              label="Backend"
              values={draft.techStack.backend || []}
              onChange={(v) => patch('techStack', { ...draft.techStack, backend: v })}
            />
            <StringListEditor
              label="Database"
              values={draft.techStack.database || []}
              onChange={(v) => patch('techStack', { ...draft.techStack, database: v })}
            />
            <StringListEditor
              label="DevOps"
              values={draft.techStack.devops || []}
              onChange={(v) => patch('techStack', { ...draft.techStack, devops: v })}
            />
            <StringListEditor
              label="Architecture"
              values={draft.architecture || []}
              onChange={(v) => patch('architecture', v)}
            />
            <StringListEditor
              label="Testing"
              values={draft.testing || []}
              onChange={(v) => patch('testing', v)}
            />
          </div>
          <div className="mt-4">
            <KeyValueEditor
              label="Metrics"
              value={draft.metrics || {}}
              onChange={(v) => patch('metrics', v)}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Médias' : 'Media'} className="mt-6">
          <MediaUrlListEditor
            label={fr ? 'Images (carousel)' : 'Images (carousel)'}
            kind="image"
            urls={draft.images}
            onChange={(v) => patch('images', v)}
            previewClassName="aspect-[16/10]"
          />
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Vidéos' : 'Videos'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('videos', [...videos, emptyVideo()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucune vidéo pour ce projet.' : 'No videos for this project.'}
            </p>
          ) : (
            <div className="space-y-4">
              {videos.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Field label={fr ? 'Type' : 'Type'} className="w-[11rem]">
                      <Select
                        value={item.type}
                        onValueChange={(v) => {
                          const next = [...videos];
                          next[i] = { ...item, type: v as ProjectVideoType };
                          patch('videos', next);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VIDEO_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="mt-6"
                      onClick={() =>
                        patch(
                          'videos',
                          videos.filter((_, idx) => idx !== i),
                        )
                      }
                      aria-label={fr ? 'Supprimer la vidéo' : 'Remove video'}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>

                  <Field label={fr ? 'URL principale' : 'Primary URL'}>
                    <Input
                      value={item.url}
                      placeholder="https://…"
                      onChange={(e) => {
                        const next = [...videos];
                        next[i] = { ...item, url: e.target.value };
                        patch('videos', next);
                      }}
                    />
                  </Field>

                  <BilingualField
                    label={fr ? 'Titre' : 'Title'}
                    valueFr={item.titleFr || ''}
                    valueEn={item.titleEn || ''}
                    onChangeFr={(v) => {
                      const next = [...videos];
                      next[i] = { ...item, titleFr: v };
                      patch('videos', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...videos];
                      next[i] = { ...item, titleEn: v };
                      patch('videos', next);
                    }}
                  />

                  <MediaUrlListEditor
                    label={fr ? 'URLs alternatives (ex. MP4)' : 'Alternate URLs (e.g. MP4)'}
                    kind="video"
                    urls={item.alternateUrls || []}
                    onChange={(v) => {
                      const next = [...videos];
                      next[i] = { ...item, alternateUrls: v };
                      patch('videos', next);
                    }}
                  />

                  {(() => {
                    const media = resolveVideoMedia(item.url, item.alternateUrls ?? []);
                    if (!media) {
                      return item.url.trim() ? (
                        <p className="text-xs text-muted-foreground">
                          {fr
                            ? 'URL non reconnue — vérifiez le lien.'
                            : 'Unrecognized URL — check the link.'}
                        </p>
                      ) : null;
                    }
                    const previewTitle =
                      (fr ? item.titleFr : item.titleEn) ||
                      (fr ? 'Aperçu vidéo' : 'Video preview');
                    return (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          {fr ? 'Aperçu public' : 'Public preview'}
                        </p>
                        <div className="overflow-hidden rounded-md border border-border/50 bg-card/30 p-2 sm:p-3">
                          <ProjectVideoPlayer media={media} title={previewTitle} isFr={fr} />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Galerie annotée' : 'Annotated gallery'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('gallery', [...gallery, emptyGalleryItem()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {gallery.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucune capture.' : 'No gallery items.'}
            </p>
          ) : (
            <div className="space-y-4">
              {gallery.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Field label={fr ? 'Type' : 'Kind'} className="w-44">
                      <Select
                        value={item.kind || 'other'}
                        onValueChange={(v) => {
                          const next = [...gallery];
                          next[i] = { ...item, kind: v as ProjectGalleryKind };
                          patch('gallery', next);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GALLERY_KINDS.map((k) => (
                            <SelectItem key={k} value={k}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="mt-6"
                      onClick={() =>
                        patch(
                          'gallery',
                          gallery.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <MediaCoverField
                    label={fr ? 'Image' : 'Image'}
                    value={item.src}
                    onChange={(v) => {
                      const next = [...gallery];
                      next[i] = { ...item, src: v };
                      patch('gallery', next);
                    }}
                    layout="aside"
                    previewClassName="aspect-[16/10]"
                  />
                  <BilingualField
                    label={fr ? 'Légende' : 'Caption'}
                    valueFr={item.captionFr || ''}
                    valueEn={item.captionEn || ''}
                    onChangeFr={(v) => {
                      const next = [...gallery] as IProjectGalleryItem[];
                      next[i] = { ...item, captionFr: v };
                      patch('gallery', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...gallery] as IProjectGalleryItem[];
                      next[i] = { ...item, captionEn: v };
                      patch('gallery', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Schémas Mermaid' : 'Mermaid diagrams'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                patch('diagrams', [
                  ...diagrams,
                  {
                    id: `d_${Date.now()}`,
                    titleFr: '',
                    titleEn: '',
                    mermaid: 'flowchart LR\n  A --> B',
                  },
                ])
              }
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
            {fr
              ? 'Écrivez le diagramme puis vérifiez l’aperçu. Les schémas invalides n’apparaissent pas en public.'
              : 'Write the diagram then check the preview. Invalid diagrams will not show publicly.'}
          </p>
          {diagrams.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucun schéma.' : 'No diagrams.'}
            </p>
          ) : (
            <div className="space-y-6">
              {diagrams.map((d, i) => (
                <div key={d.id || i} className="space-y-3 rounded-lg border border-border/60 p-3">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        patch(
                          'diagrams',
                          diagrams.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <BilingualField
                    label={fr ? 'Titre diagramme' : 'Diagram title'}
                    valueFr={d.titleFr}
                    valueEn={d.titleEn}
                    onChangeFr={(v) => {
                      const next = [...diagrams] as IProjectDiagram[];
                      next[i] = { ...d, titleFr: v };
                      patch('diagrams', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...diagrams] as IProjectDiagram[];
                      next[i] = { ...d, titleEn: v };
                      patch('diagrams', next);
                    }}
                  />
                  <MermaidEditor
                    label="Mermaid"
                    value={d.mermaid}
                    onChange={(v) => {
                      const next = [...diagrams] as IProjectDiagram[];
                      next[i] = { ...d, mermaid: v };
                      patch('diagrams', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Périmètre' : 'Scope'} className="mt-6">
          <div className="space-y-4">
            <BilingualStringListEditor
              label={fr ? 'Inclus' : 'In scope'}
              valuesFr={draft.scopeFr || []}
              valuesEn={draft.scopeEn || []}
              onChangeFr={(v) => patch('scopeFr', v)}
              onChangeEn={(v) => patch('scopeEn', v)}
            />
            <BilingualStringListEditor
              label={fr ? 'Hors périmètre' : 'Out of scope'}
              valuesFr={draft.nonGoalsFr || []}
              valuesEn={draft.nonGoalsEn || []}
              onChangeFr={(v) => patch('nonGoalsFr', v)}
              onChangeEn={(v) => patch('nonGoalsEn', v)}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Jalons' : 'Milestones'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('milestones', [...milestones, emptyMilestone()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucun jalon.' : 'No milestones.'}
            </p>
          ) : (
            <div className="space-y-4">
              {milestones.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        patch(
                          'milestones',
                          milestones.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <Field label={fr ? 'Date' : 'Date'}>
                    <Input
                      value={item.date || ''}
                      placeholder="2026-03"
                      onChange={(e) => {
                        const next = [...milestones];
                        next[i] = { ...item, date: e.target.value };
                        patch('milestones', next);
                      }}
                    />
                  </Field>
                  <BilingualField
                    label={fr ? 'Libellé' : 'Label'}
                    valueFr={item.labelFr}
                    valueEn={item.labelEn}
                    onChangeFr={(v) => {
                      const next = [...milestones];
                      next[i] = { ...item, labelFr: v };
                      patch('milestones', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...milestones];
                      next[i] = { ...item, labelEn: v };
                      patch('milestones', next);
                    }}
                  />
                  <BilingualField
                    label={fr ? 'Description' : 'Description'}
                    multiline
                    valueFr={item.descriptionFr || ''}
                    valueEn={item.descriptionEn || ''}
                    onChangeFr={(v) => {
                      const next = [...milestones];
                      next[i] = { ...item, descriptionFr: v };
                      patch('milestones', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...milestones];
                      next[i] = { ...item, descriptionEn: v };
                      patch('milestones', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Arbitrages' : 'Trade-offs'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('decisions', [...decisions, emptyDecision()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {decisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucun arbitrage.' : 'No decisions.'}
            </p>
          ) : (
            <div className="space-y-4">
              {decisions.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        patch(
                          'decisions',
                          decisions.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <BilingualField
                    label={fr ? 'Titre' : 'Title'}
                    valueFr={item.titleFr}
                    valueEn={item.titleEn}
                    onChangeFr={(v) => {
                      const next = [...decisions];
                      next[i] = { ...item, titleFr: v };
                      patch('decisions', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...decisions];
                      next[i] = { ...item, titleEn: v };
                      patch('decisions', next);
                    }}
                  />
                  <BilingualField
                    label={fr ? 'Décision' : 'Decision'}
                    multiline
                    valueFr={item.decisionFr}
                    valueEn={item.decisionEn}
                    onChangeFr={(v) => {
                      const next = [...decisions];
                      next[i] = { ...item, decisionFr: v };
                      patch('decisions', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...decisions];
                      next[i] = { ...item, decisionEn: v };
                      patch('decisions', next);
                    }}
                  />
                  <BilingualField
                    label={fr ? 'Justification' : 'Rationale'}
                    multiline
                    valueFr={item.rationaleFr || ''}
                    valueEn={item.rationaleEn || ''}
                    onChangeFr={(v) => {
                      const next = [...decisions];
                      next[i] = { ...item, rationaleFr: v };
                      patch('decisions', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...decisions];
                      next[i] = { ...item, rationaleEn: v };
                      patch('decisions', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Sécurité et infra' : 'Security and ops'} className="mt-6">
          <div className="space-y-4">
            <BilingualStringListEditor
              label={fr ? 'Sécurité' : 'Security'}
              valuesFr={draft.securityFr || []}
              valuesEn={draft.securityEn || []}
              onChangeFr={(v) => patch('securityFr', v)}
              onChangeEn={(v) => patch('securityEn', v)}
            />
            <BilingualStringListEditor
              label={fr ? 'Infrastructure' : 'Infrastructure'}
              valuesFr={draft.infraFr || []}
              valuesEn={draft.infraEn || []}
              onChangeFr={(v) => patch('infraFr', v)}
              onChangeEn={(v) => patch('infraEn', v)}
            />
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Avant / Après' : 'Before / After'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('beforeAfter', [...beforeAfter, emptyBeforeAfter()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {beforeAfter.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucune paire avant/après.' : 'No before/after pairs.'}
            </p>
          ) : (
            <div className="space-y-4">
              {beforeAfter.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        patch(
                          'beforeAfter',
                          beforeAfter.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <MediaCoverField
                      label={fr ? 'Avant' : 'Before'}
                      value={item.beforeSrc}
                      onChange={(v) => {
                        const next = [...beforeAfter];
                        next[i] = { ...item, beforeSrc: v };
                        patch('beforeAfter', next);
                      }}
                      previewClassName="aspect-[16/10]"
                    />
                    <MediaCoverField
                      label={fr ? 'Après' : 'After'}
                      value={item.afterSrc}
                      onChange={(v) => {
                        const next = [...beforeAfter];
                        next[i] = { ...item, afterSrc: v };
                        patch('beforeAfter', next);
                      }}
                      previewClassName="aspect-[16/10]"
                    />
                  </div>
                  <BilingualField
                    label={fr ? 'Légende' : 'Caption'}
                    valueFr={item.captionFr || ''}
                    valueEn={item.captionEn || ''}
                    onChangeFr={(v) => {
                      const next = [...beforeAfter];
                      next[i] = { ...item, captionFr: v };
                      patch('beforeAfter', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...beforeAfter];
                      next[i] = { ...item, captionEn: v };
                      patch('beforeAfter', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Documents' : 'Documents'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('resources', [...resources, emptyResource()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucun document.' : 'No documents.'}
            </p>
          ) : (
            <div className="space-y-4">
              {resources.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Field label={fr ? 'Type' : 'Type'} className="w-44">
                      <Select
                        value={item.type}
                        onValueChange={(v) => {
                          const next = [...resources];
                          next[i] = { ...item, type: v as ProjectResourceType };
                          patch('resources', next);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RESOURCE_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="mt-6"
                      onClick={() =>
                        patch(
                          'resources',
                          resources.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <Field label="URL">
                    <Input
                      value={item.url}
                      placeholder="https://…"
                      onChange={(e) => {
                        const next = [...resources];
                        next[i] = { ...item, url: e.target.value };
                        patch('resources', next);
                      }}
                    />
                  </Field>
                  <BilingualField
                    label={fr ? 'Libellé' : 'Label'}
                    valueFr={item.labelFr}
                    valueEn={item.labelEn}
                    onChangeFr={(v) => {
                      const next = [...resources];
                      next[i] = { ...item, labelFr: v };
                      patch('resources', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...resources];
                      next[i] = { ...item, labelEn: v };
                      patch('resources', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title={fr ? 'Liens externes' : 'External links'}
          className="mt-6"
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => patch('externalLinks', [...externalLinks, emptyLink()])}
            >
              <Plus className="size-3.5" />
              {fr ? 'Ajouter' : 'Add'}
            </Button>
          }
        >
          {externalLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fr ? 'Aucun lien.' : 'No links.'}
            </p>
          ) : (
            <div className="space-y-4">
              {externalLinks.map((item, i) => (
                <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        patch(
                          'externalLinks',
                          externalLinks.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <Field label="URL">
                    <Input
                      value={item.url}
                      placeholder="https://…"
                      onChange={(e) => {
                        const next = [...externalLinks];
                        next[i] = { ...item, url: e.target.value };
                        patch('externalLinks', next);
                      }}
                    />
                  </Field>
                  <BilingualField
                    label={fr ? 'Libellé' : 'Label'}
                    valueFr={item.labelFr}
                    valueEn={item.labelEn}
                    onChangeFr={(v) => {
                      const next = [...externalLinks];
                      next[i] = { ...item, labelFr: v };
                      patch('externalLinks', next);
                    }}
                    onChangeEn={(v) => {
                      const next = [...externalLinks];
                      next[i] = { ...item, labelEn: v };
                      patch('externalLinks', next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </AdminSectionCard>

        <AdminSectionCard title={fr ? 'Témoignage projet' : 'Project testimonial'} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <BilingualField
              label={fr ? 'Citation' : 'Quote'}
              multiline
              valueFr={draft.testimonial?.quoteFr || ''}
              valueEn={draft.testimonial?.quoteEn || ''}
              onChangeFr={(v) =>
                patch('testimonial', {
                  ...(draft.testimonial || { quoteFr: '', quoteEn: '', author: '' }),
                  quoteFr: v,
                })
              }
              onChangeEn={(v) =>
                patch('testimonial', {
                  ...(draft.testimonial || { quoteFr: '', quoteEn: '', author: '' }),
                  quoteEn: v,
                })
              }
            />
            <Field label={fr ? 'Auteur' : 'Author'}>
              <Input
                value={draft.testimonial?.author || ''}
                onChange={(e) =>
                  patch('testimonial', {
                    ...(draft.testimonial || { quoteFr: '', quoteEn: '', author: '' }),
                    author: e.target.value,
                  })
                }
              />
            </Field>
            <BilingualField
              label={fr ? 'Rôle' : 'Role'}
              valueFr={draft.testimonial?.roleFr || ''}
              valueEn={draft.testimonial?.roleEn || ''}
              onChangeFr={(v) =>
                patch('testimonial', {
                  ...(draft.testimonial || { quoteFr: '', quoteEn: '', author: '' }),
                  roleFr: v,
                })
              }
              onChangeEn={(v) =>
                patch('testimonial', {
                  ...(draft.testimonial || { quoteFr: '', quoteEn: '', author: '' }),
                  roleEn: v,
                })
              }
            />
            <Field label={fr ? 'Société' : 'Company'}>
              <Input
                value={draft.testimonial?.company || ''}
                onChange={(e) =>
                  patch('testimonial', {
                    ...(draft.testimonial || { quoteFr: '', quoteEn: '', author: '' }),
                    company: e.target.value,
                  })
                }
              />
            </Field>
          </div>
        </AdminSectionCard>
      </QueryState>
    </div>
  );
};
