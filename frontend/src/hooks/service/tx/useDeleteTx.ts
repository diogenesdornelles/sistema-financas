import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tx.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tx', 'getMany'], exact: false });
    },
  });
}
