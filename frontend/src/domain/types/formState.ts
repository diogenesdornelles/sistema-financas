

export type TValue = 'cf' | 'tcf' | 'cr' | 'tcr' | 'cp' | 'tcp' | 'partner' | 'tx' | 'cat' | 'user';

export type TopType = 'update' | 'create';

import {
  UpdateUser,
  UpdateCat,
  UpdateCp,
  UpdatePartner,
  UpdateCr,
  UpdateCf,
  UpdateTcf,
  UpdateTcp,
  UpdateTcr,
  UpdateTx,
} from "@packages/src/dist";

type UpdateItemMap = {
  cf: UpdateCf;
  tcf: UpdateTcf;
  cr: UpdateCr;
  tcr: UpdateTcr;
  cp: UpdateCp;
  tcp: UpdateTcp;
  partner: UpdatePartner;
  tx: UpdateTx;
  cat: UpdateCat;
  user: UpdateUser;
};

export type FormsState = {
  forms: {
    [K in TValue]: {
      type: TopType;
      updateItem: (UpdateItemMap[K] & { id: string }) | null;
      isOpen: boolean;
    };
  };
  setIsOpen: (value: boolean, name: TValue) => void;
  setFormType: (key: TValue, type: TopType) => void;
  setUpdateItem: <K extends TValue>(key: K, item: UpdateItemMap[K] | null) => void;
};
