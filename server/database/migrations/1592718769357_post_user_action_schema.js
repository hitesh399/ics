"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PostUserActionSchema extends Schema {
  up() {
    this.create("post_user", (table) => {
      table.increments();
      table.integer("user_id").notNullable().unsigned();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.integer("post_id").notNullable().unsigned();
      table
        .foreign("post_id")
        .references("id")
        .inTable("posts")
        .onDelete("CASCADE");
      table.unique(["user_id", "post_id"]);
      table.enu("is_read", ["Yes", "No"]).defaultTo("No");
      table.enu("is_deleted", ["Yes", "No"]).defaultTo("No");
    });
  }

  down() {
    this.drop("post_user");
  }
}

module.exports = PostUserActionSchema;
