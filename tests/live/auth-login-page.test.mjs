import assert from "node:assert/strict";
import test from "node:test";

import { liveRequest } from "./helpers.mjs";

test("login page renders successfully", async () => {
  const response = await liveRequest("/login");

  assert.equal(response.status, 200, "GET /login should return HTTP 200");
  assert.match(response.headers.get("content-type") ?? "", /text\/html/i);
});
