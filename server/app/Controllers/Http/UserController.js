"use strict";

const Hash = use("Hash");
const { validateAll } = use("Validator");
const User = use("App/Models/User");

class UserController {
  async login({ request, auth, response }) {
    const { email, password } = request.all();

    const validation = await validateAll(request.all(), {
      email: "required",
      password: "required|max:12|min:8",
    });

    if (validation.fails()) {
      response.api.throw422(validation.messages());
    }
    const user = await User.query()
      .where("email", email)
      .orWhere("username", email)
      .first();

    if (!user) {
      response.api.throw422({ email: ["User credentials does not match."] });
    }
    const isSame = await Hash.verify(password, user.password);

    if (!isSame) {
      response.api.throw422({ email: ["User credentials does not match."] });
    }

    const authData = await auth.generate(user);

    await user.tokens().create({
      token: authData.token,
      type: authData.type,
    });
    return response.api
      .setData({
        user,
        token: authData.token,
      })
      .out();
  }
  async register({ request, response }) {
    const { email, password, username } = request.all();

    const validation = await validateAll(request.all(), {
      email: "required|email|unique:users",
      username:
        "required|string|string|max:10|min:4|regex:^[0-9a-z_-]+$|unique:users",
      password: "required|string|max:12|min:8",
    });
    if (validation.fails()) {
      response.api.throw422(validation.messages());
    }
    const user = await User.create({ email, password, username });
    return response.api.setData({ user }).out();
  }
  async show({ response, auth }) {
    const user = await auth.getUser();
    return response.api.setData({ user }).out();
  }
}

module.exports = UserController;
