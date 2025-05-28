import { AuthPayloadInterface } from "./AuthPayload.interface";
import { Request } from "express";

export interface CustomRequestInterface extends Request {
  token: AuthPayloadInterface;
}
