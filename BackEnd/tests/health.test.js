const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  test("debe responder que la API funciona", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API funcionando");
  });
});
