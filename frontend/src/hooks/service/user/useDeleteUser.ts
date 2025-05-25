import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.user.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'getMany'], exact: false });
    },
  });
}
