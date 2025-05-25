export type TValue = 'cf' | 'tcf' | 'cr' | 'tcr' | 'cp' | 'tcp' | 'partner' | 'tx' | 'cat' | 'user';

export type TopType = 'update' | 'create';

import { UpdateCat } from '@packages/dtos/cat.dto';
import { UpdateCf } from '@packages/dtos/cf.dto';
import { UpdateCp } from '@packages/dtos/cp.dto';
import { UpdateCr } from '@packages/dtos/cr.dto';
import { UpdatePartner } from '@packages/dtos/partner.dto';
import { UpdateTcf } from '@packages/dtos/tcf.dto';
import { UpdateTcp } from '@packages/dtos/tcp.dto';
import { UpdateTcr } from '@packages/dtos/tcr.dto';
import { UpdateTx } from '@packages/dtos/tx.dto';
import { UpdateUser } from '@packages/dtos/user.dto';

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
