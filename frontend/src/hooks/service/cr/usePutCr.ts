import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateCr } from '@monorepo/packages';

// Hook para atualizar um 'cr' existente (PUT)
export function usePutCr(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCr) => Api.cr.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cr', 'getMany'], exact: false });
    },
  });
}
