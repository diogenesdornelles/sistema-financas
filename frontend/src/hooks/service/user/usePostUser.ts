import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { CreateUser } from '@monorepo/packages';

export function usePostUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUser) => Api.user.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'getMany'], exact: false });
    },
  });
}
