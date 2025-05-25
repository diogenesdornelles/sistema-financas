import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllUser() {
  return useQuery({
    queryFn: () => Api.user.getAll(),
    queryKey: ['user', 'getAll'],
  });
}
