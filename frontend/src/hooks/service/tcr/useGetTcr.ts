import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetTcr(id: string) {
  return useQuery({
    queryFn: () => Api.tcr.get(id),
    queryKey: ['tcr', 'get', id],
  });
}
