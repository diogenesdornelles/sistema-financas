export interface CreateTcr {
  name: string;
}

export interface UpdateTcr {
  name?: string;
  status?: boolean;
}

export interface TcrProps {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
