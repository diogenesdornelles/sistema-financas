import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useGetTx(id: string) {
  return useQuery({
    queryFn: () => Api.tx.get(id),
    queryKey: ['tx', 'get', id],
  });
}
