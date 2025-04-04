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
  createdAt: Date;
  updatedAt: Date;
}
