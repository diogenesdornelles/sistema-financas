import { AuthPayloadInterface } from './auth-payload.interface'
import { Request } from 'express'

export interface CustomRequestInterface extends Request {
  token: AuthPayloadInterface
}
