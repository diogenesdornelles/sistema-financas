export interface CreateTcf {
  // required na criação
  name: string;
}

export interface UpdateTcf {
  name?: string;
  status?: boolean;
}

export interface TcfProps {
  id: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
