import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Tcf
export function useGetManyTcf(skip: number) {
  return useQuery({
    queryFn: () => Api.tcf.getMany(skip),
    queryKey: ['tcf', 'getMany', skip],
  });
}
