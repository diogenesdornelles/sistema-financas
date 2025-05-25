import { useQuery } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para buscar muitas Partners
export function useGetManyPartner(skip: number) {
  return useQuery({
    queryFn: () => Api.partner.getMany(skip),
    queryKey: ['partner', 'getMany', skip],
  });
}
