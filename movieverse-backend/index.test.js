import { expect } from "chai";
import {
  initializeTestDb,
  getToken,
  insertTestUser,
  insertTestReview,
} from "./middleware/test.js";

const base_url = "http://localhost:10000";

before(async () => {
  await initializeTestDb();
});

describe("POST login", () => {
  const email = "login2@foo.com";
  const password = "login123";
  const first_name = "LoginName";
  const last_name = "LoginLastName";
  const unique_url = "loginurl";
  before(async () => {
    await insertTestUser(email, password, first_name, last_name, unique_url);
  });

  it("should login with valid credentials", async () => {
    const response = await fetch(base_url + "/api/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
        unique_url: unique_url,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys(
      "token",
      "profileUrl",
      "firstName",
      "lastName"
    );
  });

  it("should not login with invalid credentials", async () => {
    const response = await fetch(base_url + "/api/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "wrong@foo.com",
        password: "wrongpassword",
      }),
    });
    expect(response.status).to.equal(500);
    const data = await response.json();
    expect(data).to.have.property("error", "Invalid email or password");
  });
});

describe("POST logout", () => {
  const email = "logout@foo.com";
  const password = "logout123";
  const first_name = "LogoutName";
  const last_name = "LogoutLastName";
  const unique_url = "logouturl";
  let token;

  before(async () => {
    const userId = await insertTestUser(
      email,
      password,
      first_name,
      last_name,
      unique_url
    );
    token = getToken(userId, email);
  });

  it("should logout successfully with a valid token", async () => {
    const response = await fetch(base_url + "/api/auth/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.be.an("object");
    expect(data).to.include({ success: true });
  });

  it("should not logout without a token", async () => {
    const response = await fetch(base_url + "/api/auth/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.status).to.equal(401);
    const data = await response.json();
    expect(data).to.have.property("message", "Access token required");
  });
});

describe("POST register", () => {
  let email = "register@foo.com";

  it("should register with valid email and password", async () => {
    const password = "register123";
    const first_name = "RegisterName";
    const last_name = "RegisterLastName";

    const response = await fetch(base_url + "/api/auth/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        firstName: first_name,
        lastName: last_name,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.have.property("message", "User registered successfully");
    expect(data.user).to.include.all.keys(
      "email",
      "first_name",
      "id",
      "is_active",
      "last_name",
      "link",
      "password",
      "profileUrl",
      "unique_profile_url"
    );
  });
});

describe("DELETE account", () => {
  const email = "deleteaccount@foo.com";
  const password = "deleteaccount123";
  const first_name = "delete";
  const last_name = "account";

  let token;
  before(async () => {
    const userId = await insertTestUser(email, password, first_name, last_name);
    token = getToken(userId, email);
  });

  it("should delete all the account-related data", async () => {
    const response = await fetch(base_url + "/api/auth/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
      }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.have.property("message", "Account deleted successfully");
  });

  it("should not delete the account with invalid password", async () => {
    const response = await fetch(base_url + "/api/auth/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: "wrongpassword",
      }),
    });
    expect(response.status).to.equal(404);
    const data = await response.json();
    expect(data).to.have.property("message", "User not found");
  });
});

describe("GET reviews", () => {
  it("should get all reviews", async () => {
    await insertTestReview();
    const response = await fetch(base_url + "/api/reviews");
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("array").that.is.not.empty;
    const review = data[0];
    expect(review).to.include.all.keys(
      "id",
      "movie_id",
      "movie_poster_path",
      "title",
      "description",
      "rating",
      "review_date",
      "like_count",
      "author"
    );
  });

  it("should hanld no reviews", async () => {
    await initializeTestDb(); // Reset DB to ensure no reviews
    const response = await fetch(base_url + "/api/reviews");
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("array").that.is.empty;
  });
});
