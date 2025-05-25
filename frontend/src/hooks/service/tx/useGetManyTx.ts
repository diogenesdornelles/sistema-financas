import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Tx
export function useGetManyTx(skip: number) {
  return useQuery({
    queryFn: () => Api.tx.getMany(skip),
    queryKey: ['tx', 'getMany', skip],
  });
}
