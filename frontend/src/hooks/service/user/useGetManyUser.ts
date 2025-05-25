import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas User
export function useGetManyUser(skip: number) {
  return useQuery({
    queryFn: () => Api.user.getMany(skip),
    queryKey: ['user', 'getMany', skip],
  });
}
