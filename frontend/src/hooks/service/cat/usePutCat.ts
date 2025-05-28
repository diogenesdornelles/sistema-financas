import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { UpdateCat } from '@monorepo/packages';

// Hook para atualizar um 'cat' existente (PUT)
export function usePutCat(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCat) => Api.cat.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cat', 'getMany'], exact: false });
    },
  });
}
