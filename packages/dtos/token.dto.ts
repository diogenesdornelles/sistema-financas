export interface CreateToken {
  cpf: string;
  pwd: string;
}


export interface UpdateToken {
  cpf?: string;
  pwd?: string;
}
// Removed UpdateToken interface as it is equivalent to CreateToken

export interface TokenProps {
  user: {
    cpf: string;
    name: string;
    id: string;
  };
  token: string;
}
