import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { QueryUser } from '@packages/dtos/user.dto';

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
