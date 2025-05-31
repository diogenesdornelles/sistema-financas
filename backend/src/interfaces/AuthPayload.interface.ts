import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayloadInterface extends JwtPayload {
  cpf: string;
  name: string;
}
