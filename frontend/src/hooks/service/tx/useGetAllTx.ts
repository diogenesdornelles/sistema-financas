import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetAllTx() {
  return useQuery({
    queryFn: () => Api.tx.getAll(),
    queryKey: ['tx', 'getAll'],
  });
}
