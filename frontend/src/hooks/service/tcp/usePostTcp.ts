import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { CreateTcp } from '@monorepo/packages';

export function usePostTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcp) => Api.tcp.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcp', 'getMany'], exact: false });
    },
  });
}
