import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetTcp(id: string) {
  return useQuery({
    queryFn: () => Api.tcp.get(id),
    queryKey: ['tcp', 'get', id],
  });
}
