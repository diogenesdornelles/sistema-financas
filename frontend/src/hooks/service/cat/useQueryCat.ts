import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { QueryCat } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryCat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryCat) => Api.cat.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cat', 'getMany'], exact: false });
    },
  });
}
