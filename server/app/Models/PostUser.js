"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class PostUser extends Model {
  static get table() {
    return "post_user";
  }
  static get updatedAtColumn() {
    return null;
  }
  static get createdAtColumn() {
    return null;
  }
}

module.exports = PostUser;
