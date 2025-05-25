import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar um 'cf' específico pelo ID
export function useGetCf(id: string) {
  return useQuery({
    queryFn: () => Api.cf.get(id),
    queryKey: ['cf', 'get', id],
  });
}
