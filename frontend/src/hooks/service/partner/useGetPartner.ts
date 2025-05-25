import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar um 'partner' específico pelo ID
export function useGetPartner(id: string) {
  return useQuery({
    queryFn: () => Api.partner.get(id),
    queryKey: ['partner', 'get', id],
  });
}
