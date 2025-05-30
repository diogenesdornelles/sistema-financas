import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdatePartner } from '@monorepo/packages';

// Hook para atualizar um 'partner' existente (PUT)
export function usePutPartner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartner) => Api.partner.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'getMany'], exact: false });
    },
  });
}
