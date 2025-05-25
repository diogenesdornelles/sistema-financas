import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar todos os 'cats'
export function useGetAllCat() {
  return useQuery({
    queryFn: () => Api.cat.getAll(),
    queryKey: ['cat', 'getAll'],
  });
}
