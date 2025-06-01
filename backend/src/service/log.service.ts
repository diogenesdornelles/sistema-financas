import { Log } from '../models/log.js';

interface CreateLogInput {
  userId?: string | null;
  action: string;
  ip?: string | null;
  userAgent?: string | null;
  tokenIdentifier?: string | null;
  expiredAt?: Date | null;
  details?: object | null;
}

export class LogService {
  public static async create(input: CreateLogInput): Promise<Log | null> {
    try {
      const logEntry = await Log.create({
        userId: input.userId || null,
        action: input.action,
        ip: input.ip || null,
        userAgent: input.userAgent || null,
        token: input.tokenIdentifier || null,
        expiredAt: input.expiredAt || null,
        details: input.details || null,
        loggedAt: new Date(),
      });
      console.log(`Log criado: ${input.action} para userId ${input.userId || 'N/A'}`);
      return logEntry;
    } catch (error) {
      console.error('Erro ao criar log:', error);
      return null;
    }
  }
}