import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { CreateCp } from '@monorepo/packages';

// Hook para criar um novo 'cp' (POST)
export function usePostCp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCp) => Api.cp.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp', 'getMany'], exact: false });
    },
  });
}
