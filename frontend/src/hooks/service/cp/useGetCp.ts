import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';
// Hook para buscar um 'cp' específico pelo ID
export function useGetCp(id: string) {
  return useQuery({
    queryFn: () => Api.cp.get(id),
    queryKey: ['cp', 'get', id],
  });
}
