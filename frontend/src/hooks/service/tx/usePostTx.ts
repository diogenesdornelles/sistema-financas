import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateTx } from '@monorepo/packages';

export function usePostTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTx) => Api.tx.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tx', 'getMany'], exact: false });
    },
  });
}
