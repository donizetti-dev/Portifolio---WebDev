import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_FEATURED_PROJECT_SLUGS } from '../config/projectsCatalog';
import {
  getFeaturedProjectSlugs,
  saveFeaturedProjectSlugs,
  toggleFeaturedProjectSlug,
} from '../services/dataService';

export const FEATURED_PROJECTS_QUERY_KEY = ['portfolio', 'featured-project-slugs'] as const;

export function useFeaturedProjects() {
  const queryClient = useQueryClient();

  const query = useQuery<string[], Error>({
    queryKey: FEATURED_PROJECTS_QUERY_KEY,
    queryFn: getFeaturedProjectSlugs,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const saveMutation = useMutation<string[], Error, string[]>({
    mutationFn: saveFeaturedProjectSlugs,
    onSuccess: (updatedSlugs) => {
      queryClient.setQueryData(FEATURED_PROJECTS_QUERY_KEY, updatedSlugs);
      void queryClient.invalidateQueries({ queryKey: FEATURED_PROJECTS_QUERY_KEY });
    },
  });

  const toggleMutation = useMutation<string[], Error, string>({
    mutationFn: toggleFeaturedProjectSlug,
    onSuccess: (updatedSlugs) => {
      queryClient.setQueryData(FEATURED_PROJECTS_QUERY_KEY, updatedSlugs);
      void queryClient.invalidateQueries({ queryKey: FEATURED_PROJECTS_QUERY_KEY });
    },
  });

  const featuredSlugs = query.data ?? DEFAULT_FEATURED_PROJECT_SLUGS;

  const isProjectFeatured = useCallback(
    (slug: string) => featuredSlugs.includes(slug),
    [featuredSlugs]
  );

  return {
    featuredSlugs,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isProjectFeatured,
    saveFeaturedSlugs: saveMutation.mutateAsync,
    updateFeaturedSlugs: saveMutation.mutateAsync,
    toggleFeaturedSlug: toggleMutation.mutateAsync,
    toggleFeaturedProject: toggleMutation.mutateAsync,
    isSaving: saveMutation.isPending || toggleMutation.isPending,
    refetch: query.refetch,
  };
}

export default useFeaturedProjects;
