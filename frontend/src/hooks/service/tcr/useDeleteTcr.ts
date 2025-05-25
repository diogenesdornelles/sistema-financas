import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcr.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcr', 'getMany'], exact: false });
    },
  });
}
