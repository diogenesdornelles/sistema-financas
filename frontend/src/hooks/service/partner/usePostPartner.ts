import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import { CreatePartner } from '@monorepo/packages';

// Hook para criar um novo 'partner' (POST)
export function usePostPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartner) => Api.partner.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'getMany'], exact: false });
    },
  });
}
