import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetTcf(id: string) {
  return useQuery({
    queryFn: () => Api.tcf.get(id),
    queryKey: ['tcf', 'get', id],
  });
}
