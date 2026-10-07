import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IBlog } from '@/entities/blogs/model/blog.type';
import type { IProject } from '@/entities/projets/model/project.types';
import type { ITestimonial } from '@/entities/testimonies/model/testimonial.types';
import { blogPostsData } from '@/entities/blogs/api/mock/blog.mocks';
import { projectsData } from '@/entities/projets/api/mocks/projectData.mocks';
import { testimonials } from '@/entities/testimonies/api/mocks/testimonials.mocks';
import { skillsData } from '@/entities/skills/api/mocks/skillsData.mocks';
import { certifications } from '@/entities/certifications/api/mocks/certifications.mocks';
import { education } from '@/entities/education/api/mocks/education.mocks';
import { experiences } from '@/entities/experiences/api/mocks/experiences.mocks';
import { contactsInfo } from '@/shared/mocks/constContactInfo.mocks';
import { cvData } from '@/entities/cv/api/mock/cv-data';
import { createId, ensureId } from '../lib/id';
import type {
  IAdminCertification,
  IAdminEducation,
  IAdminExperience,
  IAdminSkill,
  IContactInfo,
  IContactResponse,
  IProfessionalReference,
} from '../model/cms.types';

function flattenSkills(): IAdminSkill[] {
  return skillsData.map((s) =>
    ensureId({ name: s.name, category: s.category, level: s.level, icon: s.icon }, 'skill'),
  );
}

type CmsState = {
  blogs: IBlog[];
  projects: IProject[];
  skills: IAdminSkill[];
  certifications: IAdminCertification[];
  education: IAdminEducation[];
  experiences: IAdminExperience[];
  testimonials: ITestimonial[];
  references: IProfessionalReference[];
  contactInfo: IContactInfo;
  contactResponses: IContactResponse[];

  // blogs
  upsertBlog: (blog: IBlog) => void;
  deleteBlog: (id: string) => void;
  getBlog: (id: string) => IBlog | undefined;

  // projects
  upsertProject: (project: IProject) => void;
  deleteProject: (id: number | string) => void;
  getProject: (id: number | string) => IProject | undefined;

  // skills
  upsertSkill: (skill: IAdminSkill) => void;
  deleteSkill: (id: string) => void;

  // certifications
  upsertCertification: (cert: IAdminCertification) => void;
  deleteCertification: (id: string) => void;

  // education
  upsertEducation: (item: IAdminEducation) => void;
  deleteEducation: (id: string) => void;

  // experiences
  upsertExperience: (item: IAdminExperience) => void;
  deleteExperience: (id: string) => void;

  // testimonials
  upsertTestimonial: (item: ITestimonial) => void;
  deleteTestimonial: (id: string | number) => void;

  // references
  upsertReference: (item: IProfessionalReference) => void;
  deleteReference: (id: string) => void;

  // contact
  setContactInfo: (info: IContactInfo) => void;
  addContactResponse: (
    payload: Omit<IContactResponse, 'id' | 'createdAt' | 'status'> & {
      status?: IContactResponse['status'];
    },
  ) => void;
  updateContactResponse: (id: string, patch: Partial<IContactResponse>) => void;
  deleteContactResponse: (id: string) => void;

  resetToMocks: () => void;
};

const seed = () => ({
  blogs: blogPostsData.map((b) => ({ ...b })),
  projects: projectsData.map((p) => ({ ...p })),
  skills: flattenSkills(),
  certifications: certifications.map((c) => ensureId({ ...c }, 'cert')),
  education: education.map((e) => ensureId({ ...e }, 'edu')),
  experiences: experiences.map((e) => ensureId({ ...e }, 'exp')),
  testimonials: testimonials.map((t) => ({
    ...t,
    status: (t.status || 'approved') as ITestimonial['status'],
    source: (t.source || 'admin') as ITestimonial['source'],
  })),
  references: cvData.references.map((r) => ensureId({ ...r }, 'ref')) as IProfessionalReference[],
  contactInfo: { ...contactsInfo } as IContactInfo,
  contactResponses: [
    {
      id: 'msg_demo_1',
      name: 'Amélie Kouam',
      email: 'amelie.kouam@example.com',
      subject: 'Demande de devis: infra AWS',
      message:
        'Bonjour Barthez,\n\nNous cherchons un accompagnement pour migrer notre monolithe vers ECS Fargate. Pouvez-vous proposer un cadrage sur 2 semaines ?\n\nCordialement,',
      status: 'new',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'msg_demo_2',
      name: 'Jean-Paul Mbarga',
      email: 'jp.mbarga@startup.cm',
      subject: 'Formation DevOps équipe',
      message:
        'Salut, on a une équipe de 6 et on voudrait une formation CI/CD GitHub Actions + Terraform. Dispo en présentiel Yaoundé ?',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      notes: 'Relancer semaine prochaine',
    },
    {
      id: 'msg_demo_3',
      name: 'Sarah Chen',
      email: 'sarah@northbridge.io',
      subject: 'Partnership / case study',
      message:
        'Hi Barthez, loved the NEXUS write-up. Would you be open to a short technical interview for our engineering blog?',
      status: 'replied',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    },
  ] as IContactResponse[],
});

export const useAdminCmsStore = create<CmsState>()(
  persist(
    (set, get) => ({
      ...seed(),

      upsertBlog: (blog) =>
        set((s) => {
          const idx = s.blogs.findIndex((b) => b.id === blog.id);
          if (idx === -1) return { blogs: [blog, ...s.blogs] };
          const blogs = [...s.blogs];
          blogs[idx] = blog;
          return { blogs };
        }),
      deleteBlog: (id) => set((s) => ({ blogs: s.blogs.filter((b) => b.id !== id) })),
      getBlog: (id) => get().blogs.find((b) => b.id === id),

      upsertProject: (project) =>
        set((s) => {
          const idx = s.projects.findIndex((p) => String(p.id) === String(project.id));
          if (idx === -1) return { projects: [project, ...s.projects] };
          const projects = [...s.projects];
          projects[idx] = project;
          return { projects };
        }),
      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => String(p.id) !== String(id)) })),
      getProject: (id) => get().projects.find((p) => String(p.id) === String(id)),

      upsertSkill: (skill) =>
        set((s) => {
          const item = ensureId(skill, 'skill');
          const idx = s.skills.findIndex((x) => x.id === item.id);
          if (idx === -1) return { skills: [item, ...s.skills] };
          const skills = [...s.skills];
          skills[idx] = item;
          return { skills };
        }),
      deleteSkill: (id) => set((s) => ({ skills: s.skills.filter((x) => x.id !== id) })),

      upsertCertification: (cert) =>
        set((s) => {
          const item = ensureId(cert, 'cert');
          const idx = s.certifications.findIndex((x) => x.id === item.id);
          if (idx === -1) return { certifications: [item, ...s.certifications] };
          const certifications = [...s.certifications];
          certifications[idx] = item;
          return { certifications };
        }),
      deleteCertification: (id) =>
        set((s) => ({ certifications: s.certifications.filter((x) => x.id !== id) })),

      upsertEducation: (itemIn) =>
        set((s) => {
          const item = ensureId(itemIn, 'edu');
          const idx = s.education.findIndex((x) => x.id === item.id);
          if (idx === -1) return { education: [item, ...s.education] };
          const education = [...s.education];
          education[idx] = item;
          return { education };
        }),
      deleteEducation: (id) => set((s) => ({ education: s.education.filter((x) => x.id !== id) })),

      upsertExperience: (itemIn) =>
        set((s) => {
          const item = ensureId(itemIn, 'exp');
          const idx = s.experiences.findIndex((x) => x.id === item.id);
          if (idx === -1) return { experiences: [item, ...s.experiences] };
          const experiences = [...s.experiences];
          experiences[idx] = item;
          return { experiences };
        }),
      deleteExperience: (id) =>
        set((s) => ({ experiences: s.experiences.filter((x) => x.id !== id) })),

      upsertTestimonial: (item) =>
        set((s) => {
          const withId = { ...item, id: item.id || createId('tst') };
          const idx = s.testimonials.findIndex((x) => String(x.id) === String(withId.id));
          if (idx === -1) return { testimonials: [withId, ...s.testimonials] };
          const testimonials = [...s.testimonials];
          testimonials[idx] = withId;
          return { testimonials };
        }),
      deleteTestimonial: (id) =>
        set((s) => ({ testimonials: s.testimonials.filter((x) => String(x.id) !== String(id)) })),

      upsertReference: (itemIn) =>
        set((s) => {
          const item = ensureId(itemIn, 'ref');
          const idx = s.references.findIndex((x) => x.id === item.id);
          if (idx === -1) return { references: [item, ...s.references] };
          const references = [...s.references];
          references[idx] = item;
          return { references };
        }),
      deleteReference: (id) =>
        set((s) => ({ references: s.references.filter((x) => x.id !== id) })),

      setContactInfo: (info) => set({ contactInfo: info }),

      addContactResponse: (payload) =>
        set((s) => ({
          contactResponses: [
            {
              id: createId('msg'),
              createdAt: new Date().toISOString(),
              status: payload.status || 'new',
              name: payload.name,
              email: payload.email,
              subject: payload.subject,
              message: payload.message,
              notes: payload.notes,
            },
            ...s.contactResponses,
          ],
        })),
      updateContactResponse: (id, patch) =>
        set((s) => ({
          contactResponses: s.contactResponses.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      deleteContactResponse: (id) =>
        set((s) => ({ contactResponses: s.contactResponses.filter((r) => r.id !== id) })),

      resetToMocks: () => set(seed()),
    }),
    {
      name: 'bk-admin-cms-v2',
      // Blogs/projects payloads are too large for localStorage; stay in-memory until API.
      partialize: (s) => ({
        skills: s.skills,
        certifications: s.certifications,
        education: s.education,
        experiences: s.experiences,
        testimonials: s.testimonials,
        references: s.references,
        contactInfo: s.contactInfo,
        contactResponses: s.contactResponses,
      }),
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<CmsState>;
        return {
          ...current,
          ...p,
          blogs: current.blogs,
          projects: current.projects,
        };
      },
    },
  ),
);
