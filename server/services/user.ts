import { sql } from "kysely";
import BaseService from "./base";

export default class UserService extends BaseService {
  public async getUserByEmail(email: string) {
    return this.db
      .selectFrom("user")
      .selectAll()
      .where("email", "=", email.trim().toLowerCase())
      .executeTakeFirst();
  }

  public async getUserById(userId: string) {
    return this.db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();
  }

  public async listDomainsForUser(userId: string) {
    return this.db
      .selectFrom("domain")
      .selectAll()
      .where("ownerId", "=", userId)
      .orderBy("createdAt", "desc")
      .execute();
  }

  public async createContactForUser(userId: string, values: {
    fullName: string;
    email: string;
    organization?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    city?: string | null;
    stateProvince?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
  }) {
    const existing = await this.db
      .selectFrom("contact")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (existing) {
      await sql`
        UPDATE contact
        SET
          fullName = ${values.fullName},
          organization = ${values.organization ?? null},
          email = ${values.email},
          phone = ${values.phone ?? null},
          addressLine1 = ${values.addressLine1 ?? null},
          city = ${values.city ?? null},
          stateProvince = ${values.stateProvince ?? null},
          postalCode = ${values.postalCode ?? null},
          countryCode = ${values.countryCode ?? null},
          updatedAt = ${new Date()}
        WHERE userId = ${userId}
      `.execute(this.db);

      return existing.id;
    }

    const result = await sql`
      INSERT INTO contact (
        id,
        userId,
        fullName,
        organization,
        email,
        phone,
        addressLine1,
        city,
        stateProvince,
        postalCode,
        countryCode,
        createdAt,
        updatedAt
      ) VALUES (
        ${crypto.randomUUID()},
        ${userId},
        ${values.fullName},
        ${values.organization ?? null},
        ${values.email},
        ${values.phone ?? null},
        ${values.addressLine1 ?? null},
        ${values.city ?? null},
        ${values.stateProvince ?? null},
        ${values.postalCode ?? null},
        ${values.countryCode ?? null},
        ${new Date()},
        ${new Date()}
      )
      RETURNING id
    `.execute(this.db);

    const createdId = (result.rows?.[0] as { id: string } | undefined)?.id;
    if (!createdId) {
      throw new Error("Failed to create contact record.");
    }

    return createdId;
  }
}
