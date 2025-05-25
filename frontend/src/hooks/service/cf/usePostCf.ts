import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateCf } from '@packages/dtos/cf.dto';

// Hook para criar um novo 'cf' (POST)
export function usePostCf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCf) => Api.cf.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cf', 'getMany'], exact: false });
    },
  });
}
