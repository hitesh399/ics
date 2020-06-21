"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Post extends Model {
  static boot() {
    super.boot();
    this.addTrait("@provider:Lucid/SoftDeletes");
  }
  static get deleteTimestamp() {
    return "deleted_at";
  }
  users() {
    return this.belongsToMany("App/Models/User")
      .pivotTable("post_user")
      .withPivot(["is_read", "is_deleted"]);
  }
}

module.exports = Post;
