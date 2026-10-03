import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersCacheConfig } from "@vinext/cloudflare/cache/config";

const cache = await createWorkersCacheConfig();

const vars = {
  APP_URL: bindings.text("https://nic.der.my.id"),
  CLOUDFLARE_ACCOUNT_ID: bindings.text("49e86ef059f7bb2e4d4b999dc8548a9c"),
  CLOUDFLARE_ZONE_ID: bindings.text("f2fe2b5b04530b11dde6d4e02507bc10"),
  GITHUB_CLIENT_ID: bindings.text("Ov23liUcDLRRMsf7N0WG"),
};

export default defineConfig({
  worker: defineWorker({
    ...cache,
    name: "open-der",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-02",
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      logs: {
        enabled: true,
        headSamplingRate: 1,
        invocationLogs: true,
        persist: true,
      },
      traces: {
        enabled: true,
        headSamplingRate: 1,
        persist: true,
      },
      issues: { enabled: true },
    },
    workersDev: true,
    previewUrls: false,
    domains: ["nic.der.my.id"],
    assets: { notFoundHandling: "none" },
    env: {
      ...cache.env,
      ...vars,
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      VINEXT_KV_CACHE: bindings.kv({ id: "f9c49d739df24700a338ab9df23223d0" }),
      DB: bindings.d1({ id: "7ad5ee3e-c69a-42d4-8beb-2b737fe4656c", name: "der-website" }),
      KV: bindings.kv({ id: "f9c49d739df24700a338ab9df23223d0" }),
      BUCKET: bindings.r2({ name: "der-website" }),
    },
    exports: { ...cache.exports },
  }),
});
