import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "./env";

const JWT_SECRET = ENV.JWT_SECRET || "dev_secret";

type ExpiresIn = SignOptions["expiresIn"];

export function signToken(payload: string | object | Buffer, expiresIn: ExpiresIn = "2h") {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
