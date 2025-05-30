import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdateCf } from '@monorepo/packages';

// Hook para atualizar um 'cf' existente (PUT)
export function usePutCf(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCf) => Api.cf.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cf', 'getMany'], exact: false });
    },
  });
}
