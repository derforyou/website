import BaseService from "./base";
import type { Kysely } from "kysely";
import * as jose from "jose";
import type { Context } from "hono";
import type { Tables } from "../database/tables";

export async function getKeyPair(algorithm: string, priv: string, pub: string) {
  const privateKey = await jose.importPKCS8(priv, algorithm);
  const publicKey = await jose.importSPKI(pub, algorithm);

  return { algorithm, privateKey, publicKey };
}

export type KeyPair = Awaited<ReturnType<typeof getKeyPair>>;

export class AuthService extends BaseService {
  constructor(protected db: Kysely<Tables>, protected keyPair: KeyPair) {
    super(db);
  }

  public async createToken(userId: string, noExpire?: boolean) {
    const jwt = new jose.SignJWT()
      .setSubject(userId)
      .setIssuer("crosspad")
      .setIssuedAt()
      .setProtectedHeader({ alg: this.keyPair.algorithm });

    if (noExpire) {
      jwt.setExpirationTime("5y"); // Ustaw czas wygaśnięcia tylko jeśli token nie jest tokenem sesji
    } else {
      jwt.setExpirationTime("4h");
    }
    return jwt.sign(this.keyPair.privateKey);
  }

  public async verifyToken(token: string) {
    const { payload } = await jose.jwtVerify(token, this.keyPair.publicKey);

    if (!payload.sub || !payload.iat || !payload.exp) {
      throw new Error("Invalid token");
    }

    return {
      userId: payload.sub,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
    };
  }

  public async verifyRequest(c: Context) {
    const cookie = c.req.header("login-session-token");

    if (!cookie) {
      return null;
    }

    const userSession = await this.verifyToken(cookie).catch(() => null);

    if (!userSession) {
      return null;
    }

    return userSession;
  }
}
AuthService;
