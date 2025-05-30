import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdateTcr } from '@monorepo/packages';

export function usePutTcr(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcr) => Api.tcr.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcr', 'getMany'], exact: false });
    },
  });
}
