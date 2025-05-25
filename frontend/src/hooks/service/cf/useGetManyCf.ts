import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Cf
export function useGetManyCf(skip: number) {
  return useQuery({
    queryFn: () => Api.cf.getMany(skip),
    queryKey: ['cf', 'getMany', skip],
  });
}
