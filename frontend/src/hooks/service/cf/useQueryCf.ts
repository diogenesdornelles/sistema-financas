import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { QueryCf } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryCf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryCf) => Api.cf.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cf', 'getMany'], exact: false });
    },
  });
}
