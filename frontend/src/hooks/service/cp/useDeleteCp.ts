import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para deletar um 'cp' pelo ID
export function useDeleteCp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cp.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp', 'getMany'], exact: false });
    },
  });
}
