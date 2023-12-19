const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Qwerty Boss",
      age: 28,
      email: "vy323334@gmail.com",
      password: "test123",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      name: "Qwerty Boss",
    },
  });
  expect(user.password).not.toBe("test123");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);

  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should login non-existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "thisIsNotThePass",
    })
    .expect(400);
});

test("Should get user profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get user profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete user profile", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user).toBeNull();
});

test("Should not delete user profile for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload profile picture", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/avatar.png")
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Asdfgh",
    })
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.name).toEqual("Asdfgh");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Gurgaon",
    })
    .expect(400);
});
