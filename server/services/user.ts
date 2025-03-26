import * as bcrypt from "bcryptjs";
import { sql } from "kysely";
import { toUnix } from "../lib/dates";
import BaseService from "./base";

export default class UserService extends BaseService {
  public async loginUser(email: string, password: string) {
    const result = await this.db
      .selectFrom("logins")
      .innerJoin("users", "logins.id", "users.loginId")
      .where((eb) =>
        eb.and([
          eb("logins.email", "=", email.trim().toLowerCase()),
          eb("users.verified", "=", true),
        ])
      )
      .select(["users.id as userId", "logins.password as loginPassword"])
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    const loginResult = await bcrypt.compare(password, result.loginPassword);

    return loginResult ? result.userId : false;
  }

  public async createUser({
    email,
    password,
    userName,
  }: {
    email: string;
    password: string;
    userName: string;
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const userResult = await this.db
      .insertInto("users")
      .values({
        id: userId,
        name: userName.trim(),
        namespace: userName.trim().toLowerCase(),
        loginId: (
          await this.db
            .insertInto("logins")
            .values({
              email: email.trim().toLowerCase(),
              password: hashedPassword,
            })
            .returning("id")
            .executeTakeFirstOrThrow()
        ).id, // Insert login and retrieve its ID
        verified: true,
        verificationCode: crypto.randomUUID(),
        createdOn: toUnix(new Date()),
      })
      .returning(["id"])
      .executeTakeFirst();

    if (!userResult?.id) {
      throw new Error("Something went wrong creating the user!");
    }

    await this.db
      .insertInto("logins")
      .values({
        id: undefined, // Auto-incremented
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      })
      .execute();

    return userResult.id;
  }

  public async checkIfUserExists(email: string, name: string) {
    return this.db
      .selectFrom("logins")
      .innerJoin("users", "users.loginId", "logins.id")
      .selectAll()
      .where((eb) =>
        eb.and([
          eb.or([
            eb("logins.email", "=", email.trim().toLowerCase()),
            eb(
              sql`LOWER(${eb.ref("users.namespace")})`,
              "=",
              name.trim().toLowerCase()
            ),
          ]),
          eb("users.verified", "=", true),
        ])
      )
      .limit(1)
      .executeTakeFirst();
  }
}
