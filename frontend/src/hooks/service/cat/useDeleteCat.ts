import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para deletar um 'cat' pelo ID
export function useDeleteCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cat.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cat', 'getMany'], exact: false });
    },
  });
}
