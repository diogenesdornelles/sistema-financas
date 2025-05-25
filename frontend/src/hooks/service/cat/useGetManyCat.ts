import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar 'cats'
export function useGetManyCat(skip: number) {
  return useQuery({
    queryFn: () => Api.cat.getMany(skip),
    queryKey: ['cat', 'getMany', skip],
  });
}
