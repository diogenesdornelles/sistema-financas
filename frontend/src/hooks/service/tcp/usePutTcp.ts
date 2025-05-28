import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateTcp } from '@monorepo/packages';

export function usePutTcp(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcp) => Api.tcp.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcp', 'getMany'], exact: false });
    },
  });
}
