"use strict";

const PostUser = use("App/Models/PostUser");
const User = use("App/Models/User");

const NewsCrawler = use("App/Lib/NewsCrawler");
const BulkQuery = use("App/Lib/BulkQueryBuilder");
const Database = use("Database");
const Post = use("App/Models/Post");

class PostController {
  async index({
    request,
    response,
    auth: {
      user: { id: user_id },
    },
  }) {
    const { page, sort, page_size, search } = request.get();
    let posts = Post.query()
      .with("users", (builder) => {
        builder.where("post_user.user_id", user_id);
      })
      .whereDoesntHave("users", (builder) => {
        builder.where("post_user.user_id", user_id);
        builder.where("post_user.is_deleted", "Yes");
      });
    if (sort && sort.hasOwnProperty("title")) {
      posts.orderBy("posts.title", sort.title);
    }
    if (sort && sort.hasOwnProperty("created_at")) {
      posts.orderBy("posts.created_at", sort.created_at);
    }
    if (sort && sort.hasOwnProperty("updated_at")) {
      posts.orderBy("posts.updated_at", sort.updated_at);
    }

    if (search) {
      posts.where("title", "like", `%${search}%`);
    }
    posts = await posts.select("posts.*").paginate(page ? page : 1, page_size);

    response.api.setData(posts).setMessage("Role List").out();
  }
  async crawl({ response }) {
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
      Database.close();
      return response.api.setData({ ...result[0] }).out();
    } catch (e) {
      Database.close();
      return response.api.setMessage(e.message).out();
    }
  }
  /**
   * Delete a post with id.
   * DELETE post/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const post = await Post.find(params.id);
    post.delete();
    response.api.setData({ post }).out();
  }

  async read({ params, response, auth }) {
    const { id: post_id } = await Post.find(params.id);
    const { id: user_id } = auth.user;

    let postUser = await PostUser.query()
      .where("post_id", params.id)
      .where("user_id", user_id)
      .first();

    if (!postUser) {
      postUser = await PostUser.create({
        user_id,
        post_id,
        is_read: "Yes",
      });
    } else {
      postUser.is_read = postUser.is_read === "Yes" ? "No" : "Yes";
      await postUser.save();
    }

    return response.api.setData({ post: postUser }).out();
  }
  async userDelete({ params, response, auth }) {
    const { id: post_id } = await Post.find(params.id);
    const { id: user_id } = auth.user;

    let postUser = await PostUser.query()
      .where("post_id", params.id)
      .where("user_id", user_id)
      .first();

    if (!postUser) {
      postUser = await PostUser.create({
        user_id,
        post_id,
        is_deleted: "Yes",
      });
    } else {
      postUser.is_deleted = "Yes";
      await postUser.save();
    }

    return response.api.setData({ post: postUser }).out();
  }
}

module.exports = PostController;
