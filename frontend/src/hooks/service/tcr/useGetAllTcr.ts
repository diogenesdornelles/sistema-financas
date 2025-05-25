import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllTcr() {
  return useQuery({
    queryFn: () => Api.tcr.getAll(),
    queryKey: ['tcr', 'getAll'],
  });
}
