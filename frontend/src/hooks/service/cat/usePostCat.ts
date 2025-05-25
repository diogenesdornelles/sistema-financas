import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreateCat } from '@packages/dtos/cat.dto';

// Hook para criar um novo 'cat' (POST)
export function usePostCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCat) => Api.cat.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cat', 'getMany'], exact: false });
    },
  });
}
