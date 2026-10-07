import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type {
  IProject,
  IProjectDiagram,
  IProjectGalleryItem,
} from '@/entities/projets/model/project.types';
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
  useAdminCmsStore,
} from '@/features/admin-cms';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { adminPath } from '@/shared/config/admin';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const emptyProject = (nextId: number): IProject => ({
  id: nextId,
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
});

export const AdminProjectEditorPage: React.FC = () => {
  const { projectId } = useParams();
  const isNew = projectId === 'new' || !projectId;
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const navigate = useNavigate();
  const projects = useAdminCmsStore((s) => s.projects);
  const getProject = useAdminCmsStore((s) => s.getProject);
  const upsertProject = useAdminCmsStore((s) => s.upsertProject);

  const [draft, setDraft] = React.useState<IProject>(() => {
    if (!isNew && projectId) return getProject(projectId) || emptyProject(1);
    const maxId = projects.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);
    return emptyProject(maxId + 1);
  });

  React.useEffect(() => {
    if (!isNew && projectId) {
      const found = getProject(projectId);
      if (found) setDraft(found);
    }
  }, [projectId, isNew, getProject]);

  const patch = <K extends keyof IProject>(key: K, value: IProject[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = () => {
    if (!draft.titleFr.trim() || !draft.titleEn.trim()) {
      toast.error(fr ? 'Titres FR/EN requis' : 'FR/EN titles required');
      return;
    }
    upsertProject(draft);
    toast.success(fr ? 'Projet enregistré' : 'Project saved');
    navigate(adminPath('projects', String(draft.id)), { replace: true });
  };

  const gallery = draft.gallery || [];
  const diagrams = draft.diagrams || [];

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <AdminPageHeader
        title={
          isNew ? (fr ? 'Nouveau projet' : 'New project') : fr ? 'Éditer le projet' : 'Edit project'
        }
        actions={
          <AdminStickyActions>
            <Button variant="outline" asChild className="flex-1 md:flex-none">
              <Link to={adminPath('projects')}>
                <ArrowLeft className="size-4" />
                {fr ? 'Retour' : 'Back'}
              </Link>
            </Button>
            <Button onClick={save} className="flex-[1.4] md:flex-none">
              <Save className="size-4" />
              {fr ? 'Enregistrer' : 'Save'}
            </Button>
          </AdminStickyActions>
        }
      />

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
            <Input value={draft.complexity} onChange={(e) => patch('complexity', e.target.value)} />
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
            <div>
              <p className="text-sm font-medium">
                {fr ? 'Visible publiquement' : 'Publicly visible'}
              </p>
              <p className="text-xs text-muted-foreground">
                {fr
                  ? 'Contrôle la présence sur la vitrine'
                  : 'Controls presence on the public site'}
              </p>
            </div>
            <Switch
              checked={draft.isPublished !== false}
              onCheckedChange={(v) => patch('isPublished', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
            <span className="text-sm">{fr ? 'Mis en avant' : 'Featured'}</span>
            <Switch checked={!!draft.isFeatured} onCheckedChange={(v) => patch('isFeatured', v)} />
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
            />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title={fr ? 'Narratif' : 'Narrative'}>
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

      <AdminSectionCard title="Tech stack">
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

      <AdminSectionCard title={fr ? 'Médias' : 'Media'}>
        <MediaUrlListEditor
          label={fr ? 'Images (carousel)' : 'Images (carousel)'}
          kind="image"
          urls={draft.images}
          onChange={(v) => patch('images', v)}
        />
        <div className="mt-4">
          <Field label="Video demo URL">
            <Input
              value={draft.videoDemo || ''}
              onChange={(e) => patch('videoDemo', e.target.value)}
            />
          </Field>
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title={fr ? 'Galerie annotée' : 'Annotated gallery'}
        actions={
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              patch('gallery', [...gallery, { src: '', captionFr: '', captionEn: '', kind: 'ui' }])
            }
          >
            <Plus className="size-3.5" /> Add
          </Button>
        }
      >
        <div className="space-y-4">
          {gallery.map((item, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-3 space-y-3">
              <div className="flex justify-between gap-2">
                <Field label="SRC" className="flex-1">
                  <Input
                    value={item.src}
                    onChange={(e) => {
                      const next = [...gallery];
                      next[i] = { ...item, src: e.target.value };
                      patch('gallery', next);
                    }}
                  />
                </Field>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
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
      </AdminSectionCard>

      <AdminSectionCard
        title="Mermaid diagrams"
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
            <Plus className="size-3.5" /> Add
          </Button>
        }
      >
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
      </AdminSectionCard>

      <AdminSectionCard title={fr ? 'Témoignage projet' : 'Project testimonial'}>
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
    </div>
  );
};
