"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("login", "UserController.login");
Route.post("register", "UserController.register");
Route.group(() => {
  Route.get("post", "PostController.index");
  Route.delete("post/:id", "PostController.destroy");
  Route.get("post/crawl", "PostController.crawl");
  Route.put("post/read/:id", "PostController.read");
  Route.delete("post/delete/:id/user", "PostController.userDelete");
  Route.get("profile", "UserController.show");
}).middleware(["auth"]);
