import { restClient } from "../utils/client";
import { CreateToken, TokenProps } from "../../../packages/dtos/token.dto";
import {
  CreateUser,
  QueryUser,
  UpdateUser,
  UserProps,
} from "../../../packages/dtos/user.dto";
import {
  TcfProps,
  CreateTcf,
  UpdateTcf,
  QueryTcf,
} from "../../../packages/dtos/tcf.dto";
import {
  CfProps,
  CreateCf,
  QueryCf,
  UpdateCf,
} from "../../../packages/dtos/cf.dto";
import {
  CpProps,
  CreateCp,
  QueryCp,
  UpdateCp,
} from "../../../packages/dtos/cp.dto";
import {
  CrProps,
  CreateCr,
  QueryCr,
  UpdateCr,
} from "../../../packages/dtos/cr.dto";
import {
  TcrProps,
  CreateTcr,
  UpdateTcr,
  QueryTcr,
} from "../../../packages/dtos/tcr.dto";
import {
  TcpProps,
  CreateTcp,
  UpdateTcp,
  QueryTcp,
} from "../../../packages/dtos/tcp.dto";
import {
  PartnerProps,
  CreatePartner,
  UpdatePartner,
  QueryPartner,
} from "../../../packages/dtos/partner.dto";
import {
  TxProps,
  CreateTx,
  UpdateTx,
  QueryTx,
} from "../../../packages/dtos/tx.dto";
import {
  CatProps,
  CreateCat,
  QueryCat,
  UpdateCat,
} from "../../../packages/dtos/cat.dto";

import {
  DbBalanceProps,
} from "../../../packages/dtos/db.dto";

export const Api = {
  // Operações para TCF
  tcf: {
    getAll: async (): Promise<TcfProps[]> => {
      const { data } = await restClient.get("tcf");
      return data;
    },
    getMany: async (skip: number): Promise<TcfProps[]> => {
      const { data } = await restClient.get(`tcf/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<TcfProps> => {
      const { data } = await restClient.get(`tcf/${id}`);
      return data;
    },
    post: async (tcf: CreateTcf): Promise<TcfProps> => {
      const { data } = await restClient.post("tcf", tcf);
      return data;
    },
    put: async (tcf: UpdateTcf, id: string): Promise<TcfProps> => {
      const { data } = await restClient.put(`tcf/${id}`, tcf);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tcf/${id}`);
    },
    query: async (tcf: QueryTcf): Promise<TcfProps[]> => {
      const { data } = await restClient.post("tcf/query", tcf);
      return data;
    },
  },

  // Operações para CF
  cf: {
    getAll: async (): Promise<CfProps[]> => {
      const { data } = await restClient.get("cf");
      return data;
    },
    getMany: async (skip: number): Promise<CfProps[]> => {
      const { data } = await restClient.get(`cf/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<CfProps> => {
      const { data } = await restClient.get(`cf/${id}`);
      return data;
    },
    post: async (cf: CreateCf): Promise<CfProps> => {
      const { data } = await restClient.post("cf", cf);
      return data;
    },
    put: async (cf: UpdateCf, id: string): Promise<CfProps> => {
      const { data } = await restClient.put(`cf/${id}`, cf);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cf/${id}`);
    },
    query: async (cf: QueryCf): Promise<CfProps[]> => {
      const { data } = await restClient.post("cf/query", cf);
      return data;
    },
  },

  // Operações para CP
  cp: {
    getAll: async (): Promise<CpProps[]> => {
      const { data } = await restClient.get("cp");
      return data;
    },
    getMany: async (skip: number): Promise<CpProps[]> => {
      const { data } = await restClient.get(`cp/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<CpProps> => {
      const { data } = await restClient.get(`cp/${id}`);
      return data;
    },
    post: async (cp: CreateCp): Promise<CpProps> => {
      const { data } = await restClient.post("cp", cp);
      return data;
    },
    put: async (cp: UpdateCp, id: string): Promise<CpProps> => {
      const { data } = await restClient.put(`cp/${id}`, cp);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cp/${id}`);
    },
    query: async (cp: QueryCp): Promise<CpProps[]> => {
      const { data } = await restClient.post("cp/query", cp);
      return data;
    },
  },

  // Operações para CR
  cr: {
    getAll: async (): Promise<CrProps[]> => {
      const { data } = await restClient.get("cr");
      return data;
    },
    getMany: async (skip: number): Promise<CrProps[]> => {
      const { data } = await restClient.get(`cr/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<CrProps> => {
      const { data } = await restClient.get(`cr/${id}`);
      return data;
    },
    post: async (cr: CreateCr): Promise<CrProps> => {
      const { data } = await restClient.post("cr", cr);
      return data;
    },
    put: async (cr: UpdateCr, id: string): Promise<CrProps> => {
      const { data } = await restClient.put(`cr/${id}`, cr);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cr/${id}`);
    },
    query: async (cr: QueryCr): Promise<CrProps[]> => {
      const { data } = await restClient.post("cr/query", cr);
      return data;
    },
  },

  // Operações para TCR
  tcr: {
    getAll: async (): Promise<TcrProps[]> => {
      const { data } = await restClient.get("tcr");
      return data;
    },
    getMany: async (skip: number): Promise<TcrProps[]> => {
      const { data } = await restClient.get(`tcr/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<TcrProps> => {
      const { data } = await restClient.get(`tcr/${id}`);
      return data;
    },
    post: async (tcr: CreateTcr): Promise<TcrProps> => {
      const { data } = await restClient.post("tcr", tcr);
      return data;
    },
    put: async (tcr: UpdateTcr, id: string): Promise<TcrProps> => {
      const { data } = await restClient.put(`tcr/${id}`, tcr);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tcr/${id}`);
    },
    query: async (tcr: QueryTcr): Promise<TcrProps[]> => {
      const { data } = await restClient.post("tcr/query", tcr);
      return data;
    },
  },

  // Operações para TCP
  tcp: {
    getAll: async (): Promise<TcpProps[]> => {
      const { data } = await restClient.get("tcp");
      return data;
    },
    getMany: async (skip: number): Promise<TcpProps[]> => {
      const { data } = await restClient.get(`tcp/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<TcpProps> => {
      const { data } = await restClient.get(`tcp/${id}`);
      return data;
    },
    post: async (tcp: CreateTcp): Promise<TcpProps> => {
      const { data } = await restClient.post("tcp", tcp);
      return data;
    },
    put: async (tcp: UpdateTcp, id: string): Promise<TcpProps> => {
      const { data } = await restClient.put(`tcp/${id}`, tcp);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tcp/${id}`);
    },
    query: async (tcp: QueryTcp): Promise<TcpProps[]> => {
      const { data } = await restClient.post("tcp/query", tcp);
      return data;
    },
  },

  // Operações para Partner
  partner: {
    getAll: async (): Promise<PartnerProps[]> => {
      const { data } = await restClient.get("partner");
      return data;
    },
    getMany: async (skip: number): Promise<PartnerProps[]> => {
      const { data } = await restClient.get(`partner/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<PartnerProps> => {
      const { data } = await restClient.get(`partner/${id}`);
      return data;
    },
    post: async (partner: CreatePartner): Promise<PartnerProps> => {
      const { data } = await restClient.post("partner", partner);
      return data;
    },
    put: async (partner: UpdatePartner, id: string): Promise<PartnerProps> => {
      const { data } = await restClient.put(`partner/${id}`, partner);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`partner/${id}`);
    },
    query: async (partner: QueryPartner): Promise<PartnerProps[]> => {
      const { data } = await restClient.post("partner/query", partner);
      return data;
    },
  },

  // Operações para TX
  tx: {
    getAll: async (): Promise<TxProps[]> => {
      const { data } = await restClient.get("tx");
      return data;
    },
    getMany: async (skip: number): Promise<TxProps[]> => {
      const { data } = await restClient.get(`tx/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<TxProps> => {
      const { data } = await restClient.get(`tx/${id}`);
      return data;
    },
    post: async (tx: CreateTx): Promise<TxProps> => {
      const { data } = await restClient.post("tx", tx);
      return data;
    },
    put: async (tx: UpdateTx, id: string): Promise<TxProps> => {
      const { data } = await restClient.put(`tx/${id}`, tx);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`tx/${id}`);
    },
    query: async (tx: QueryTx): Promise<TxProps[]> => {
      const { data } = await restClient.post("tx/query", tx);
      return data;
    },
  },

  // Operações para CAT
  cat: {
    getAll: async (): Promise<CatProps[]> => {
      const { data } = await restClient.get("cat");
      return data;
    },
    getMany: async (skip: number): Promise<CatProps[]> => {
      const { data } = await restClient.get(`cat/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<CatProps> => {
      const { data } = await restClient.get(`cat/${id}`);
      return data;
    },
    post: async (cat: CreateCat): Promise<CatProps> => {
      const { data } = await restClient.post("cat", cat);
      return data;
    },
    put: async (cat: UpdateCat, id: string): Promise<CatProps> => {
      const { data } = await restClient.put(`cat/${id}`, cat);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`cat/${id}`);
    },
    query: async (cat: QueryCat): Promise<CatProps[]> => {
      const { data } = await restClient.post("cat/query", cat);
      return data;
    },
  },

  // Operações para USER
  user: {
    getAll: async (): Promise<UserProps[]> => {
      const { data } = await restClient.get("user");
      return data;
    },
    getMany: async (skip: number): Promise<UserProps[]> => {
      const { data } = await restClient.get(`user/many/${skip}`);
      return data;
    },
    get: async (id: string): Promise<UserProps> => {
      const { data } = await restClient.get(`user/${id}`);
      return data;
    },
    post: async (user: CreateUser): Promise<UserProps> => {
      const { data } = await restClient.post("user", user);
      return data;
    },
    put: async (user: UpdateUser, id: string): Promise<UserProps> => {
      const { data } = await restClient.put(`user/${id}`, user);
      return data;
    },
    delete: async (id: string): Promise<void> => {
      await restClient.delete(`user/${id}`);
    },
    query: async (user: QueryUser): Promise<UserProps[]> => {
      const { data } = await restClient.post("user/query", user);
      return data;
    },
  },

  db: {
    getBalances: async (date: string): Promise<DbBalanceProps> => {
      const { data } = await restClient.get(`db/balances/${date}`);
      return data
    },
  },

  // Operação de login
  login: async ({ cpf, pwd }: CreateToken): Promise<TokenProps> => {
    const { data } = await restClient.post("login", { cpf, pwd });
    return data;
  },
};
