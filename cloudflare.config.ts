import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersCacheConfig } from "@vinext/cloudflare/cache/config";

const cache = await createWorkersCacheConfig();

export default defineConfig({
  worker: defineWorker({
    ...cache,
    name: "open-der",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-02",
    compatibilityFlags: ["nodejs_compat"],
    workersDev: true,
    previewUrls: true,
    domains: ["nic.der.my.id"],
    assets: { notFoundHandling: "none" },
    env: {
      ...cache.env,
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
