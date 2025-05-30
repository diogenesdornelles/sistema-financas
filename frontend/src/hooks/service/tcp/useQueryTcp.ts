import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { QueryTcp } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryTcp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTcp) => Api.tcp.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcp', 'getMany'], exact: false });
    },
  });
}
