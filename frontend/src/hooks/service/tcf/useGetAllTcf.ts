import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllTcf() {
  return useQuery({
    queryFn: () => Api.tcf.getAll(),
    queryKey: ['tcf', 'getAll'],
  });
}
