import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdateCp } from '@monorepo/packages';

// Hook para atualizar um 'cp' existente (PUT)
export function usePutCp(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCp) => Api.cp.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp', 'getMany'], exact: false });
    },
  });
}
