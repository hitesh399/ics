"use strict";

const { Command } = require("@adonisjs/ace");
const NewsCrawler = use("App/Lib/NewsCrawler");
const BulkQuery = use("App/Lib/BulkQueryBuilder");
const Database = use("Database");

class Crawl extends Command {
  static get signature() {
    return "crawl";
  }

  static get description() {
    return "crawls the news pages and extract the data";
  }

  async handle(args, options) {
    const crawler = new NewsCrawler();
    const data = await crawler.crawls();
    const query = BulkQuery.insertUpdateQuery(
      data,
      "posts",
      ["post_url", "title", "up_votes", "age", "no_of_comments"],
      true
    );
    try {
      const result = await Database.raw(query);
      this.completed("Done", result[0].message);
    } catch (e) {
      this.error("Some Error " + e.message);
    }
    Database.close();
  }
}

module.exports = Crawl;
