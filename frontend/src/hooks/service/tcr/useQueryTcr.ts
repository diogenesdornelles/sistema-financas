import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { QueryTcr } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryTcr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTcr) => Api.tcr.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcr', 'getMany'], exact: false });
    },
  });
}
