import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetUser(id: string) {
  return useQuery({
    queryFn: () => Api.user.get(id),
    queryKey: ['User', 'get', id],
  });
}
