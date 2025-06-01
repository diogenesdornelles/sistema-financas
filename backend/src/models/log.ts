import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize.db.config.js';

interface LogAttributes {
  id: string;
  userId: string | null;
  loggedAt: Date;
  expiredAt: Date | null;
  action: string;
  token?: string | null;
  ip: string | null;
  userAgent: string | null;
  details?: object | null;
}

type LogCreationAttributes = Optional<
  LogAttributes,
  'id' | 'expiredAt' | 'token' | 'ip' | 'userAgent' | 'details'
>;

export class Log
  extends Model<LogAttributes, LogCreationAttributes>
  implements LogAttributes
{
  public id!: string;
  public userId!: string | null;
  public loggedAt!: Date;
  public expiredAt!: Date | null;
  public action!: string;
  public token?: string | null;
  public ip!: string | null;
  public userAgent!: string | null;
  public details?: object | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Log.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    loggedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'logs',
    timestamps: true,
  },
);
