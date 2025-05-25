import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllTcp() {
  return useQuery({
    queryFn: () => Api.tcp.getAll(),
    queryKey: ['tcp', 'getAll'],
  });
}
