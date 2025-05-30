import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdateTx } from '@monorepo/packages';

export function usePutTx(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTx) => Api.tx.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tx', 'getMany'], exact: false });
    },
  });
}
