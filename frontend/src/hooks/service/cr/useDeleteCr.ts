import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para deletar um 'cr' pelo ID
export function useDeleteCr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cr.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cr', 'getMany'], exact: false });
    },
  });
}
