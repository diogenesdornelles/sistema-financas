import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { QueryUser } from '@monorepo/packages';

// Hook para criar uma consulta via POST
export function useQueryUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryUser) => Api.user.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'getMany'], exact: false });
    },
  });
}
