import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar um 'cat' específico pelo ID
export function useGetCat(id: string) {
  return useQuery({
    queryFn: () => Api.cat.get(id),
    queryKey: ['cat', 'get', id],
  });
}
