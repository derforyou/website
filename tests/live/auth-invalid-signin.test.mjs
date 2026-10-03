import assert from "node:assert/strict";
import test from "node:test";

import { liveRequest } from "./helpers.mjs";

test("sign-in endpoint rejects malformed input without a server error", async () => {
  const response = await liveRequest("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });

  assert.ok(
    response.status >= 400 && response.status < 500,
    `malformed sign-in should return a 4xx response, received ${response.status}`,
  );
});
