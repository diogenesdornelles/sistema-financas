import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar todos os 'partners'
export function useGetAllPartner() {
  return useQuery({
    queryFn: () => Api.partner.getAll(),
    queryKey: ['partner', 'getAll'],
  });
}
