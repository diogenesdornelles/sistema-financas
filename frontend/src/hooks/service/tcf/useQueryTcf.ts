import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { QueryTcf } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryTcf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTcf) => Api.tcf.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcf', 'getMany'], exact: false });
    },
  });
}
