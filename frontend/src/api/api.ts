import { restClient } from '../utils/client'
import {CreateToken, TokenProps} from '../../../packages/dtos/token.dto'
import {UserProps} from '../../../packages/dtos/user.dto'

export const Api = {

  getUser: async (id: string): Promise<UserProps> => {
    const { data } = await restClient.get(`user/${id}`);
    return data;
  },

  login: async ({ cpf, pwd }: CreateToken): Promise<TokenProps> => {
    const { data } = await restClient.post(`login`, {
      cpf,
      pwd
    });
    return data;
  }
};