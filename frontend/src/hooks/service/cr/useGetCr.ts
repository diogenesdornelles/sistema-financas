import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar um 'cr' específico pelo ID
export function useGetCr(id: string) {
  return useQuery({
    queryFn: () => Api.cr.get(id),
    queryKey: ['cr', 'get', id],
  });
}
