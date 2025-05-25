import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar todos os 'cp'
export function useGetAllCp() {
  return useQuery({
    queryFn: () => Api.cp.getAll(),
    queryKey: ['cp', 'getAll'],
  });
}
