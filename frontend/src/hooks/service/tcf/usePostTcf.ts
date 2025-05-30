import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { CreateTcf } from '@monorepo/packages';

export function usePostTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcf) => Api.tcf.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcf', 'getMany'], exact: false });
    },
  });
}
