import assert from "node:assert/strict";
import test from "node:test";

import { liveRequest } from "./helpers.mjs";

test("session endpoint handles an anonymous request", async () => {
  const response = await liveRequest("/api/auth/get-session");

  assert.equal(response.status, 200, "anonymous GET /api/auth/get-session should return HTTP 200");
  assert.match(response.headers.get("content-type") ?? "", /application\/json/i);
});
