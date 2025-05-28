import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { QueryCr } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryCr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryCr) => Api.cr.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cr', 'getMany'], exact: false });
    },
  });
}
