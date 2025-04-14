export interface CreateCat {
  name: string;
  description?: string;
  user: string;
  obs?: string;
}

export interface UpdateCat {
  name?: string;
  description?: string;
  obs?: string;
  status?: boolean;
}

export interface CatProps {
  id: string;
  name: string;
  description: string;
  status: boolean;
  obs: string;
  createdAt: string;
  updatedAt: string;
}


export interface QueryCat {
  id?: string;
  name?: string;
  description?: string;
  status?: boolean;
  obs?: string;
  createdAt?: string;
  updatedAt?: string;
}