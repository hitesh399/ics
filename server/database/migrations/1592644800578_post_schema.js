"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PostSchema extends Schema {
  up() {
    this.create("posts", (table) => {
      table.increments();
      table.integer("post_id").unsigned().notNullable().unique().index();
      table.string("post_url", 800);
      table.string("title", 800);
      table.integer("up_votes").unsigned();
      table.string("age", 100);
      table.integer("no_of_comments").unsigned();
      table.timestamps();
      table.datetime("deleted_at").nullable().defaultTo(null);
    });
  }

  down() {
    this.drop("posts");
  }
}

module.exports = PostSchema;
