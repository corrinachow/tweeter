/**
 * ------------------------------------------------------------------------
 * CONSTRUCTING TWEET ELEMENT
 * ------------------------------------------------------------------------
 */

// Creates element with specified tag
function createIconElement(tag, divClass = "", fontAwesomeClass = "", title = "") {
  return $(`<${tag}>`)
    .addClass(divClass)
    .append(
      $("<i>")
        .attr("title", title)
        .addClass(fontAwesomeClass)
    );
}

function createTweetElement(tweet) {
  const { name, avatars, handle } = tweet.user;
  const { text } = tweet.content;

  // FIXME: shouldn't use _id directly
  const $tweet = $('<article>').addClass('tweet').css("display", "none").attr('data-tweetID', tweet['_id']);

  // Tweet header
  const avatar = $("<img>").attr("src", avatars.regular);
  const $h2 = $("<h2>").text(name);
  const $handle = $('<span>').addClass('handle').text(handle);
  const $header = $("<header>")
    .css("opacity", "0.8")
    .append(avatar, $("<div>").append($h2, $handle));

  // Tweet body
  const $tweetBody = $('<p>').addClass("tweet-body").text(text);

  // Tweet footer
  const $date = $("<span>").text(moment.utc(tweet.created_at).fromNow());
  const $report = createIconElement(
    "span",
    "report",
    "fab fa-font-awesome-flag",
    "Report post"
  );
  const $retweet = createIconElement(
    "span",
    "retweet",
    "fas fa-retweet",
    "Retweet post"
  );

  const $like = $("<span>").addClass('like').append($("<i>").attr('title', 'Like post').addClass('fas fa-heart'))

  if (tweet.like) {
    $like.css("color", "rgb(255, 0, 0)");
  }
  const $likes = $('<span>').addClass('likes').text(tweet.likes);

  const $tweetActions = $('<div>').addClass("tweet-actions")
    .css("visibility", "hidden")
    .append($report, $retweet, $like);
  const $footer = $("<footer>").append($date, $tweetActions, $likes);
  return $tweet.append($header, $tweetBody, $footer);
}

function renderTweets(tweets) {
  for (let tweet of tweets) {
    $("#tweets-container").append(createTweetElement(tweet));
  }
  $("article.tweet").slideDown();
}

function loadTweets() {
  let tweetData = [];
  $.get("/tweets", function(data) {
    tweetData = data;
  }).then(function() {
    renderTweets(tweetData);
  });
}