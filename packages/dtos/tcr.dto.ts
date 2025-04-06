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


export interface QueryTcr {
  name?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}