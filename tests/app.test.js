const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");

const testUser = {
  email: "testuser@example.com",
  first_name: "Test",
  last_name: "User",
  password: "testpass1234"
};
let token = "";

beforeAll(async () => {
  await db.query(
    "DELETE FROM transactions WHERE user_id = (SELECT id FROM users WHERE email = $1)",
    [testUser.email]
  );
  await db.query(
    "DELETE FROM balances WHERE user_id = (SELECT id FROM users WHERE email = $1)",
    [testUser.email]
  );
  await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
});

afterAll(async () => {
  await db.query(
    "DELETE FROM transactions WHERE user_id = (SELECT id FROM users WHERE email = $1)",
    [testUser.email]
  );
  await db.query(
    "DELETE FROM balances WHERE user_id = (SELECT id FROM users WHERE email = $1)",
    [testUser.email]
  );
  await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  await db.pool.end();
});

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/registration").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
  });

  it("should not register with same email", async () => {
    const res = await request(app).post("/registration").send(testUser);
    expect(res.statusCode).toBe(400);
  });

  it("should login and return JWT token", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });
});

describe("Profile Endpoints", () => {
  it("should get user profile", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put("/profile/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ first_name: "Updated", last_name: "User" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(res.body.data.first_name).toBe("Updated");
  });
});

describe("Banner & Services Endpoints", () => {
  it("should get banners (public)", async () => {
    const res = await request(app).get("/banner");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get services (private)", async () => {
    const res = await request(app)
      .get("/services")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("Transaction Endpoints", () => {
  let serviceCode = "PULSA";
  it("should get balance", async () => {
    const res = await request(app)
      .get("/balance")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(res.body.data.balance).toBeDefined();
  });

  it("should top up balance", async () => {
    const res = await request(app)
      .post("/topup")
      .set("Authorization", `Bearer ${token}`)
      .send({ top_up_amount: 100000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(Number(res.body.data.balance)).toBeGreaterThanOrEqual(100000);
  });

  it("should make a transaction", async () => {
    const res = await request(app)
      .post("/transaction")
      .set("Authorization", `Bearer ${token}`)
      .send({ service_code: serviceCode });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(res.body.data.invoice_number).toBeDefined();
  });

  it("should get transaction history", async () => {
    const res = await request(app)
      .get("/transaction/history")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(0);
    expect(Array.isArray(res.body.data.records)).toBe(true);
  });
});
