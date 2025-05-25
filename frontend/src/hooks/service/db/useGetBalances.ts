import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar balanços de CF
export function useGetBalances(date: string) {
  return useQuery({
    queryFn: () => Api.db.getBalances(date),
    queryKey: ['cf', 'getBalances'],
  });
}
