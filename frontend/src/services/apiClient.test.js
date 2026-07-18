import test from "node:test";
import assert from "node:assert/strict";
import { normalizeApiResponse, toFormData } from "./apiClient.js";

test("normalizeApiResponse extracts data from the envelope", () => {
  const response = {
    data: {
      success: true,
      message: "ok",
      data: { id: 7, name: "Ada" },
      errors: null,
    },
  };

  assert.deepEqual(normalizeApiResponse(response), { id: 7, name: "Ada" });
});

test("normalizeApiResponse throws field errors for failed envelopes", () => {
  const response = {
    data: {
      success: false,
      message: "Validation failed",
      data: null,
      errors: {
        email: ["Enter a valid email."],
      },
    },
  };

  assert.throws(
    () => normalizeApiResponse(response),
    (error) => {
      assert.equal(error.message, "Validation failed");
      assert.deepEqual(error.fieldErrors, { email: ["Enter a valid email."] });
      return true;
    },
  );
});

test("toFormData converts payload values into multipart form data", () => {
  const payload = {
    title: "Demo",
    file: new File(["abc"], "demo.txt", { type: "text/plain" }),
  };

  const formData = toFormData(payload);

  assert.equal(formData.get("title"), "Demo");
  assert.equal(formData.get("file").name, "demo.txt");
});
