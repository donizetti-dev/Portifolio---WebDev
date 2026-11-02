import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toProjectSlug } from '../config/projectsCatalog';
import {
  fetchGitHubProjects,
  getCatalogAsEnrichedProjects,
  getGitHubUsername,
} from '../services/githubService';
import type { EnrichedProject } from '../types';
import { useFeaturedProjects } from './useFeaturedProjects';

export const GITHUB_PROJECTS_QUERY_KEY = ['github', 'projects', getGitHubUsername()] as const;

export function useGitHubProjects() {
  const { featuredSlugs } = useFeaturedProjects();

  const query = useQuery<EnrichedProject[], Error>({
    queryKey: GITHUB_PROJECTS_QUERY_KEY,
    queryFn: () => fetchGitHubProjects(featuredSlugs),
    staleTime: 1000 * 60 * 10, // 10 minutos (evita chamadas repetidas ao navegar)
    gcTime: 1000 * 60 * 30, // 30 minutos em memória
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const projects = useMemo<EnrichedProject[]>(() => {
    const rawList = query.data ?? [];
    return rawList
      .map((project) => ({
        ...project,
        isFeatured: featuredSlugs.includes(project.slug),
      }))
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }
        if (a.isCurated !== b.isCurated) {
          return a.isCurated ? -1 : 1;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [query.data, featuredSlugs]);

  const featuredProjects = useMemo<EnrichedProject[]>(
    () => projects.filter((project) => project.isFeatured),
    [projects]
  );

  const catalogFallbackProjects = useMemo<EnrichedProject[]>(
    () => getCatalogAsEnrichedProjects(featuredSlugs),
    [featuredSlugs]
  );

  const getProjectBySlug = useCallback(
    (slug: string): EnrichedProject | undefined => {
      const normalized = toProjectSlug(slug);
      const source = projects.length > 0 ? projects : catalogFallbackProjects;
      return source.find((item) => item.slug === normalized);
    },
    [projects, catalogFallbackProjects]
  );

  return {
    projects,
    data: projects,
    featuredProjects,
    catalogFallbackProjects,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    getProjectBySlug,
  };
}

/**
 * Hook utilitário para recuperar um projeto específico pelo `:slug` consumindo
 * o cache compartilhado do TanStack Query sem disparar novas requisições redundantes.
 */
export function useProjectBySlug(slug: string | undefined) {
  const { projects, catalogFallbackProjects, isLoading, isError, error, refetch } =
    useGitHubProjects();

  const project = useMemo<EnrichedProject | undefined>(() => {
    if (!slug) {
      return undefined;
    }
    const normalized = toProjectSlug(slug);
    const fromLoaded = projects.find((item) => item.slug === normalized);
    if (fromLoaded) {
      return fromLoaded;
    }
    return catalogFallbackProjects.find((item) => item.slug === normalized);
  }, [slug, projects, catalogFallbackProjects]);

  return {
    project,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export default useGitHubProjects;
