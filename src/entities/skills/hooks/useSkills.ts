import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllPages,
  queryKeys,
  withPublicFallback,
  type PaginatedData,
  type ResourceResult,
} from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import { skillsData } from '../api/mocks/skillsData.mocks';
import {
  createSkill,
  deleteSkill,
  getSkill,
  listSkills,
  updateSkill,
  type ISkillDto,
  type SkillListParams,
} from '../api/Skill.api';

/** API validates limit ∈ [1, 100] */
const PAGE_SIZE = 100;
const PUBLIC_LIST: SkillListParams = { limit: PAGE_SIZE };

function mockSkillsDto(): ISkillDto[] {
  return skillsData.map((skill, index) => ({
    ...skill,
    id: `mock-skill-${index}`,
    sortOrder: index,
  }));
}

async function listAllSkills(params: SkillListParams): Promise<PaginatedData<ISkillDto>> {
  const items = await fetchAllPages(listSkills, params, PAGE_SIZE);
  return paginateMock(items);
}

export function usePublicSkills() {
  return useQuery({
    queryKey: queryKeys.skills.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<ISkillDto>>> =>
      withPublicFallback(
        () => listAllSkills(PUBLIC_LIST),
        () => paginateMock(mockSkillsDto()),
      ),
  });
}

export function useAdminSkills(params?: SkillListParams) {
  return useQuery({
    queryKey: queryKeys.skills.list({ admin: true, ...params }),
    queryFn: () => listAllSkills({ limit: PAGE_SIZE, ...params }),
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ISkillDto> }) =>
      updateSkill(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
    },
  });
}

export function useSkill(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.skills.all, 'detail', id ?? ''] as const,
    queryFn: () => getSkill(id!),
    enabled: Boolean(id) && enabled,
  });
}
