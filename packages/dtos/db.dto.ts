/*
Dtos para o trânsito de dados de dashboard
*/

import { PartnerProps } from "./partner.dto";
import { TcpProps } from "./tcp.dto";
import { TcrProps } from "./tcr.dto";
import { PaymentStatus } from "./utils/enums";

export type ResultSet = {
    cfId: string;
    cfNumber: string;
    totalEntry: number;
    totalOutflow: number;
    firstBalance: number;
    currentBalance: number;
}

export interface DbBalanceProps {
    result: ResultSet[]
    date: string;
}


export interface DbCpsCrsProps {
    cps: Array<{
        id: string;
        value: number;
        type: TcpProps;
        supplier: PartnerProps;
        due: string;
        status: PaymentStatus;
    }>,
    crs: Array<{
        id: string;
        value: number;
        type: TcrProps;
        customer: PartnerProps;
        due: string;
        obs: string;
        status: PaymentStatus;
    }>
}