import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcf.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcf', 'getMany'], exact: false });
    },
  });
}
