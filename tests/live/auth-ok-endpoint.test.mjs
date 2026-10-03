import assert from "node:assert/strict";
import test from "node:test";

import { liveRequest } from "./helpers.mjs";

test("Better Auth health endpoint responds successfully", async () => {
  const response = await liveRequest("/api/auth/ok");

  assert.equal(response.status, 200, "GET /api/auth/ok should return HTTP 200");
  assert.match(response.headers.get("content-type") ?? "", /application\/json/i);
});
