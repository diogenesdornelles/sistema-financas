import { useMutation } from '@tanstack/react-query';

import { Api } from '@/api/Api';
import type { CreateToken } from '@monorepo/packages';

export function useLogin() {
  return useMutation({
    mutationFn: (data: CreateToken) => Api.login(data),
  });
}
