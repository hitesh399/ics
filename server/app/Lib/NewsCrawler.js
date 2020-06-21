const cheerio = require("cheerio");
var request = require("request");

class NewsCrawler {
  baseURL = "https://news.ycombinator.com/";
  maxPageToRead = 3;

  async crawls() {
    let data = [];
    for (let i = 1; i <= 3; i++) {
      const posts = await this.read(this.baseURL + "news?p=" + i);
      data = data.concat(posts);
    }
    return data;
  }
  read(url) {
    return new Promise((reslove, reject) => {
      request({ url }, function (error, response, body) {
        const $ = cheerio.load(body);
        const data = [];
        $("table.itemlist tr").each(function () {
          const tr = $(this);
          const _postId = tr.attr("id");
          if (_postId) {
            const titleElement = tr.find("td.title a");
            const title = titleElement.text();
            const postUrl = titleElement.attr("href");
            const nextTr = tr.next("tr");
            const upVotes = parseInt(
              nextTr
                .find("span.score")
                .text()
                .toString()
                .replace("points", "")
                .trim()
            );
            const age = nextTr.find("span.age a").text();
            const comments = parseInt(
              nextTr
                .last()
                .find("a")
                .last()
                .text()
                .toString()
                .replace("comments", "")
                .trim()
            );

            data.push({
              post_id: parseInt(_postId),
              post_url: postUrl,
              title,
              up_votes: upVotes,
              age,
              no_of_comments: comments ? comments : 0,
            });
          }
        });
        reslove(data);
      });
    });
  }
}

module.exports = NewsCrawler;
