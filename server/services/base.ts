import type { Kysely } from "kysely";
import type { Tables } from "../database/tables";

export default class BaseService {
  constructor(protected db: Kysely<Tables>) {}
}
