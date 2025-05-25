import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcp.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcp', 'getMany'], exact: false });
    },
  });
}
