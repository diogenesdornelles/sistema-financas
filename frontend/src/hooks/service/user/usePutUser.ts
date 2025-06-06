import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { UpdateUser } from '@monorepo/packages';

export function usePutUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUser) => Api.user.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'getMany'], exact: false });
    },
  });
}
