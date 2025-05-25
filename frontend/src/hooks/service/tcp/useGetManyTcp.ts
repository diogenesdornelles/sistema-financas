import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Tcp
export function useGetManyTcp(skip: number) {
  return useQuery({
    queryFn: () => Api.tcp.getMany(skip),
    queryKey: ['tcp', 'getMany', skip],
  });
}
