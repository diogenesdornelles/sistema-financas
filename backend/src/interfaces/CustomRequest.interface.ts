import { Request } from "express";
import { AuthPayloadInterface } from "./AuthPayload.interface.js";

export interface CustomRequestInterface extends Request {
  token: AuthPayloadInterface;
}
