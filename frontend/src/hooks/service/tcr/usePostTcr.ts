import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateTcr } from '@packages/dtos/tcr.dto';

export function usePostTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcr) => Api.tcr.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tcr', 'getMany'], exact: false });
    },
  });
}
