import { expect } from "chai";

import {
  initializeTestDb,
  getToken,
  insertTestUser,
} from "./middleware/test.js";

const base_url = "http://localhost:3001";

describe("Get reviews", () => {
  before(async () => {
    await initializeTestDb();
  });

  it("should get all reviews", async () => {
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
});

describe("POST login", () => {
  const email = "login@foo.com";
  const password = "login123";
  const first_name = "name";
  const last_name = "last_name";
  const unique_url = "fnjsng";
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
});
