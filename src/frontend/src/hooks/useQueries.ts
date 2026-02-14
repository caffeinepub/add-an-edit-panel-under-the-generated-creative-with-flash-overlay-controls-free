import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BrandKit } from '../backend';

export function useGetCallerBrandKit() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<BrandKit | null>({
    queryKey: ['callerBrandKit'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerBrandKit();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerBrandKit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandKit: BrandKit) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerBrandKit(brandKit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerBrandKit'] });
    },
  });
}
