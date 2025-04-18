import { Request, Response, NextFunction } from "express";
import { DbBalanceProps, DbCpsCrsProps } from "../../../packages/dtos/db.dto";
import { DbService } from "../service/db.service";


export default class DbController {
    public service: DbService
    constructor() {
        this.service = new DbService()
    }

    public getBalances = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { date } = req.params
            const items: DbBalanceProps | null = await this.service.getBalances(date);
            if (items) {
                res.status(200).json(items);
            } else {
                res.status(404).json({ message: "Balanços não encontrados" });
            }
            return;
        } catch (error) {
            next(error);
            return;
        }
    };

    public getCpsCrs = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { date } = req.params
            const items: DbCpsCrsProps | null = await this.service.getCpsCrs(date);
            if (items) {
                res.status(200).json(items);
            } else {
                res.status(404).json({ message: "Balanços não encontrados" });
            }
            return;
        } catch (error) {
            next(error);
            return;
        }
    };

}
