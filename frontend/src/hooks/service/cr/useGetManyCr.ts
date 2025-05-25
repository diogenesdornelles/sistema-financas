import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Cr
export function useGetManyCr(skip: number) {
  return useQuery({
    queryFn: () => Api.cr.getMany(skip),
    queryKey: ['cr', 'getMany', skip],
  });
}
