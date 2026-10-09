import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, withPublicFallback, type PaginatedData, type ResourceResult } from '@/shared/api';
import { paginateMock } from '@/shared/api/http';
import {
  createLanguage,
  deleteLanguage,
  languagesMock,
  listLanguages,
  updateLanguage,
  type LanguageDto,
  type LanguageInput,
  type LanguageListParams,
} from '../api/language.api';

export function usePublicLanguages() {
  return useQuery({
    queryKey: queryKeys.languages.list({ public: true }),
    queryFn: async (): Promise<ResourceResult<PaginatedData<LanguageDto>>> =>
      withPublicFallback(
        () => listLanguages({ limit: 100 }),
        () => paginateMock(languagesMock()),
      ),
  });
}

export function useAdminLanguages(params?: LanguageListParams) {
  return useQuery({
    queryKey: queryKeys.languages.list({ admin: true, ...params }),
    queryFn: () => listLanguages({ limit: 100, ...params }),
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLanguage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.languages.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.cv.root });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<LanguageInput> }) =>
      updateLanguage(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.languages.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.cv.root });
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLanguage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.languages.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.cv.root });
    },
  });
}
