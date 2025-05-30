import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdateTcf } from '@monorepo/packages';

export function usePutTcf(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcf) => Api.tcf.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcf', 'getMany'], exact: false });
    },
  });
}
