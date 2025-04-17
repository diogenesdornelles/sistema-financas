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
