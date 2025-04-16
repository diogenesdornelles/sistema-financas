export type TValue =
  | "cf"
  | "tcf"
  | "cr"
  | "tcr"
  | "cp"
  | "tcp"
  | "partner"
  | "tx"
  | "cat"
  | "user";

export type TOpType = "update" | "create";

import { UpdateCf } from "../../../packages/dtos/cf.dto";
import { UpdateTcf } from "../../../packages/dtos/tcf.dto";
import { UpdateCr } from "../../../packages/dtos/cr.dto";

import { UpdateCp } from "../../../packages/dtos/cp.dto";
import { UpdateTcp } from "../../../packages/dtos/tcp.dto";
import { UpdateTcr } from "../../../packages/dtos/tcr.dto";

import { UpdatePartner } from "../../../packages/dtos/partner.dto";
import { UpdateTx } from "../../../packages/dtos/tx.dto";
import { UpdateUser } from "../../../packages/dtos/user.dto";
import { UpdateCat } from "../../../packages/dtos/cat.dto";

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
      type: TOpType;
      updateItem: (UpdateItemMap[K] & { id: string }) | null;
      isOpen: boolean;
    };
  };
  setIsOpen: (value: boolean, name: TValue) => void;
  setFormType: (key: TValue, type: TOpType) => void;
  setUpdateItem: <K extends TValue>(
    key: K,
    item: UpdateItemMap[K] | null,
  ) => void;
};
