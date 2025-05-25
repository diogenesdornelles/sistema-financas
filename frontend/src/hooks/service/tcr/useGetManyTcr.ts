import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Tcr
export function useGetManyTcr(skip: number) {
  return useQuery({
    queryFn: () => Api.tcr.getMany(skip),
    queryKey: ['tcr', 'getMany', skip],
  });
}
