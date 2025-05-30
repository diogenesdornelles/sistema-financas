import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { QueryPartner } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryPartner) => Api.partner.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'getMany'], exact: false });
    },
  });
}
