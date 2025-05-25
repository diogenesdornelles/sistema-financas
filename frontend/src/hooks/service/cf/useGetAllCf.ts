import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar todos os 'cf'
export function useGetAllCf() {
  return useQuery({
    queryFn: () => Api.cf.getAll(),
    queryKey: ['cf', 'getAll'],
  });
}
