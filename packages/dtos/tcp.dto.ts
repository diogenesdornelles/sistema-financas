export interface CreateTcp {
  name: string;
}

export interface UpdateTcp {
  name?: string;
  status?: boolean;
}

export interface TcpProps {
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface QueryTcp {
  id?: string;
  name?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}