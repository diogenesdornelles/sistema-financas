import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { QueryCf } from '@packages/dtos/cf.dto';

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
