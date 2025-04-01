import { restClient } from '../utils/client'
import { UserResponseDto as UserProps } from '../../../backend/src/dtos/user.dto'
import { ResponseTokenDTO as TokenProps } from '../../../backend/src/dtos/token.dto'
  
export const Api = {

  getUser: async (id: string): Promise<UserProps> => {
    const { data } = await restClient.get(`user/${id}`);
    return data;
  },

  login: async (cpf: string, pwd: string): Promise<TokenProps> => {
    const { data } = await restClient.post(`login`, {
      cpf,
      pwd
    });
    return data;
  }
};