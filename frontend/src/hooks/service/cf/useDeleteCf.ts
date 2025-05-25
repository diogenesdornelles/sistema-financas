import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para deletar um 'cf' pelo ID
export function useDeleteCf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cf.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cf', 'getMany'], exact: false });
    },
  });
}
