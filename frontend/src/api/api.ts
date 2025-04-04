import { restClient } from '../utils/client';
import { CreateToken, TokenProps } from '../../../packages/dtos/token.dto';
import { CreateUser, UpdateUser, UserProps } from '../../../packages/dtos/user.dto';
import { TcfProps, CreateTcf, UpdateTcf } from '../../../packages/dtos/tcf.dto';
import { CfProps, CreateCf, UpdateCf } from '../../../packages/dtos/cf.dto';
import { CpProps, CreateCp, UpdateCp } from '../../../packages/dtos/cp.dto';
import { CrProps, CreateCr, UpdateCr} from '../../../packages/dtos/cr.dto';
import { TcrProps, CreateTcr, UpdateTcr } from '../../../packages/dtos/tcr.dto';
import { TcpProps, CreateTcp, UpdateTcp } from '../../../packages/dtos/tcp.dto';
import { PartnerProps, CreatePartner, UpdatePartner } from '../../../packages/dtos/partner.dto';
import { TxProps, CreateTx, UpdateTx } from '../../../packages/dtos/tx.dto';
import { CatProps, CreateCat, UpdateCat} from '../../../packages/dtos/cat.dto';

export const Api = {
  // Operações para TCF
  tcf: {
    getAll: async (): Promise<TcfProps[]> => {
      const { data } = await restClient.get('tcf');
      return data;
    },
    get: async (id: string): Promise<TcfProps> => {
      const { data } = await restClient.get(`tcf/${id}`);
      return data;
    },
    post: async (tcf: CreateTcf): Promise<TcfProps> => {
      const { data } = await restClient.post('tcf', tcf);
      return data;
    },
    put: async (tcf: UpdateTcf): Promise<TcfProps> => {
      const { data } = await restClient.put('tcf', tcf);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tcf/${id}`);
    },
  },

  // Operações para CF
  cf: {
    getAll: async (): Promise<CfProps[]> => {
      const { data } = await restClient.get('cf');
      return data;
    },
    get: async (id: string): Promise<CfProps> => {
      const { data } = await restClient.get(`cf/${id}`);
      return data;
    },
    post: async (cf: CreateCf): Promise<CfProps> => {
      const { data } = await restClient.post('cf', cf);
      return data;
    },
    put: async (cf: UpdateCf): Promise<CfProps> => {
      const { data } = await restClient.put('cf', cf);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cf/${id}`);
    },
  },

  // Operações para CP
  cp: {
    getAll: async (): Promise<CpProps[]> => {
      const { data } = await restClient.get('cp');
      return data;
    },
    get: async (id: string): Promise<CpProps> => {
      const { data } = await restClient.get(`cp/${id}`);
      return data;
    },
    post: async (cp: CreateCp): Promise<CpProps> => {
      const { data } = await restClient.post('cp', cp);
      return data;
    },
    put: async (cp: UpdateCp): Promise<CpProps> => {
      const { data } = await restClient.put('cp', cp);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cp/${id}`);
    },
  },

  // Operações para CR
  cr: {
    getAll: async (): Promise<CrProps[]> => {
      const { data } = await restClient.get('cr');
      return data;
    },
    get: async (id: string): Promise<CrProps> => {
      const { data } = await restClient.get(`cr/${id}`);
      return data;
    },
    post: async (cr: CreateCr): Promise<CrProps> => {
      const { data } = await restClient.post('cr', cr);
      return data;
    },
    put: async (cr: UpdateCr): Promise<CrProps> => {
      const { data } = await restClient.put('cr', cr);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cr/${id}`);
    },
  },

  // Operações para TCR
  tcr: {
    getAll: async (): Promise<TcrProps[]> => {
      const { data } = await restClient.get('tcr');
      return data;
    },
    get: async (id: string): Promise<TcrProps> => {
      const { data } = await restClient.get(`tcr/${id}`);
      return data;
    },
    post: async (tcr: CreateTcr): Promise<TcrProps> => {
      const { data } = await restClient.post('tcr', tcr);
      return data;
    },
    put: async (tcr: UpdateTcr): Promise<TcrProps> => {
      const { data } = await restClient.put('tcr', tcr);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tcr/${id}`);
    },
  },

  // Operações para TCP
  tcp: {
    getAll: async (): Promise<TcpProps[]> => {
      const { data } = await restClient.get('tcp');
      return data;
    },
    get: async (id: string): Promise<TcpProps> => {
      const { data } = await restClient.get(`tcp/${id}`);
      return data;
    },
    post: async (tcp: CreateTcp): Promise<TcpProps> => {
      const { data } = await restClient.post('tcp', tcp);
      return data;
    },
    put: async (tcp: UpdateTcp): Promise<TcpProps> => {
      const { data } = await restClient.put('tcp', tcp);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tcp/${id}`);
    },
  },

  // Operações para Partner
  partner: {
    getAll: async (): Promise<PartnerProps[]> => {
      const { data } = await restClient.get('partner');
      return data;
    },
    get: async (id: string): Promise<PartnerProps> => {
      const { data } = await restClient.get(`partner/${id}`);
      return data;
    },
    post: async (partner: CreatePartner): Promise<PartnerProps> => {
      const { data } = await restClient.post('partner', partner);
      return data;
    },
    put: async (partner: UpdatePartner): Promise<PartnerProps> => {
      const { data } = await restClient.put('partner', partner);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`partner/${id}`);
    },
  },

  // Operações para TX
  tx: {
    getAll: async (): Promise<TxProps[]> => {
      const { data } = await restClient.get('tx');
      return data;
    },
    get: async (id: string): Promise<TxProps> => {
      const { data } = await restClient.get(`tx/${id}`);
      return data;
    },
    post: async (tx: CreateTx): Promise<TxProps> => {
      const { data } = await restClient.post('tx', tx);
      return data;
    },
    put: async (tx: UpdateTx): Promise<TxProps> => {
      const { data } = await restClient.put('tx', tx);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tx/${id}`);
    },
  },

  // Operações para CAT
  cat: {
    getAll: async (): Promise<CatProps[]> => {
      const { data } = await restClient.get('cat');
      return data;
    },
    get: async (id: string): Promise<CatProps> => {
      const { data } = await restClient.get(`cat/${id}`);
      return data;
    },
    post: async (cat: CreateCat): Promise<CatProps> => {
      const { data } = await restClient.post('cat', cat);
      return data;
    },
    put: async (cat: UpdateCat): Promise<CatProps> => {
      const { data } = await restClient.put('cat', cat);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cat/${id}`);
    },
  },

  // Operações para USER
  user: {
    getAll: async (): Promise<UserProps[]> => {
      const { data } = await restClient.get('user');
      return data;
    },
    get: async (id: string): Promise<UserProps> => {
      const { data } = await restClient.get(`user/${id}`);
      return data;
    },
    post: async (user: CreateUser): Promise<UserProps> => {
      const { data } = await restClient.post('user', user);
      return data;
    },
    put: async (user: UpdateUser): Promise<UserProps> => {
      const { data } = await restClient.put('user', user);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`user/${id}`);
    },
  },

  // Operação de login
  login: async ({ cpf, pwd }: CreateToken): Promise<TokenProps> => {
    const { data } = await restClient.post('login', { cpf, pwd });
    return data;
  },
};