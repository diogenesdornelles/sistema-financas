import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { QueryTx } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryTx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTx) => Api.tx.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tx', 'getMany'], exact: false });
    },
  });
}
