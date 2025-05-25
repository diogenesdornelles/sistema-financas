import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api } from '@/api/Api';

// Hook para deletar um 'partner' pelo ID
export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.partner.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'getMany'], exact: false });
    },
  });
}
