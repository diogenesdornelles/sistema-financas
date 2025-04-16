export type ResultSet = {
    cfId: string;
    cfNumber: string;
    totalIn: number;
    totalOut: number;
    balance: number;
    cfInitial: number;
}

export interface DbBalanceProps {
    result: ResultSet[]
    date: string;
}
