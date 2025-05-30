import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { CreateCr } from '@monorepo/packages';

// Hook para criar um novo 'cr' (POST)
export function usePostCr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCr) => Api.cr.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cr', 'getMany'], exact: false });
    },
  });
}
