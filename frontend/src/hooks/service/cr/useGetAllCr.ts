import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllCr() {
  return useQuery({
    queryFn: () => Api.cr.getAll(),
    queryKey: ['cr', 'getAll'],
  });
}
