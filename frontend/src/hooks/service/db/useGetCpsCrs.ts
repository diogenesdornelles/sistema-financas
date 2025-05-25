import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar contas a pagar e a receber de acordo com data
export function useGetCpsCrs(date: string) {
  return useQuery({
    queryFn: () => Api.db.getCpsCrs(date),
    queryKey: ['cp', 'cr', 'getCpsCrs'],
  });
}
