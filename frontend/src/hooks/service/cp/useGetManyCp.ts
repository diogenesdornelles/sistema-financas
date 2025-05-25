import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Cp
export function useGetManyCp(skip: number) {
  return useQuery({
    queryFn: () => Api.cp.getMany(skip),
    queryKey: ['cp', 'getMany', skip],
  });
}
