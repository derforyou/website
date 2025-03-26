import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";
// import type { Tables } from "server/database/tables";
// import { Kysely } from "kysely";
// import { D1Dialect } from "kysely-d1";



interface Env {
  // db: D1Database;
}

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    // db: Kysely<Tables>;
  }
}

export type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
  // const db = new Kysely<Tables>({
  //   dialect: new D1Dialect({
  //     database: context.cloudflare.env.db,
  //   }),
  // });

  return {
    ...context,
    // db,
  };
};
