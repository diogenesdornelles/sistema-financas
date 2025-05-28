import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { QueryCp } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryCp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryCp) => Api.cp.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp', 'getMany'], exact: false });
    },
  });
}
