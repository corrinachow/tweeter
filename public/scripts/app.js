/**
 * ------------------------------------------------------------------------
 * RE-INITIALISE STATE AFTER SUCCESSFUL POST
 * ------------------------------------------------------------------------
 */

function getInitialState() {
  $("section.new-tweet")
    .find("textarea")
    .val("");
  $("section.new-tweet")
    .find(".error")
    .slideUp();
  $("section.new-tweet")
    .find(".counter")
    .text("140");
}

/**
 * ------------------------------------------------------------------------
 * TWEET ERROR HANDLING
 * ------------------------------------------------------------------------
 */

// Checks if Tweets are between 1 and 140 (inclusive) chars
function validateTweet(tweet) {
  // Checks for empty Tweet
  if (!tweet) {
    const $error = $("<p>").text("Tweets must be more than one character");
    return handleErrorDiv($error);

    // Checks if Tweet is > 140 chars
  } else if (tweet.length > 140) {
    const $error = $("<p>").text("Tweets must be under 140 characters");
    return handleErrorDiv($error);
  }
  return true;
}

function handleErrorDiv(errorHTML) {
  let $div = $("<div>")
    .addClass("error")
    .css("display", "none");

  // If .error div does not exist, create & inserts error message
  if ($("section.new-tweet").find(".error").length === 0) {
    $div.append(errorHTML);
    $("section.new-tweet").prepend($div);
    $(".error").slideDown();

    // If .error div exists, just insert HTML
  } else {
    $("section.new-tweet")
      .find(".error")
      .html(errorHTML);
  }
  return false;
}

/**
 * ------------------------------------------------------------------------
 * CONSTRUCTING TWEET ELEMENT
 * ------------------------------------------------------------------------
 */

// Creates element with specified tag
function createElement(tag, divClass = "", fontAwesomeClass = "", title = "") {
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
  const $tweet = createElement("article", "tweet").css("display", "none");

  // Tweet header
  const avatar = $("<img>").attr("src", avatars.regular);
  const $h2 = $("<h2>").text(name);
  const $handle = createElement("span", "handle").text(handle);
  const $header = $("<header>")
    .css("opacity", "0.8")
    .append(avatar, $("<div>").append($h2, $handle));

  // Tweet body
  const $tweetBody = createElement("p", "tweet-body").text(text);

  // Tweet footer
  const $date = $("<span>").text(moment.utc(tweet.created_at).fromNow());
  const $report = createElement(
    "span",
    "report",
    "fab fa-font-awesome-flag",
    "Report post"
  );
  const $retweet = createElement(
    "span",
    "retweet",
    "fas fa-retweet",
    "Retweet post"
  );
  const $like = createElement("span", "like", "fas fa-heart", "Like post");
  const $tweetActions = createElement('div', 'tweet-actions')
    .css("visibility", "hidden")
    .append($report, $retweet, $like);
  const $footer = $("<footer>").append($date, $tweetActions);
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

/**
 * ------------------------------------------------------------------------
 * DOCUMENT READY
 * ------------------------------------------------------------------------
 */

$(function() {
  // Retrieves and contructs existing Tweets
  loadTweets();
  $(".new-tweet form").submit(function(e) {
    e.preventDefault();
    const $tweetData = $(this).serialize();

    // Only makes AJAX call upon Tweet validation
    if (validateTweet($tweetData.substr(5))) {
      $.ajax({
        url: "/tweets",
        type: "POST",
        cache: false,
        data: $tweetData,
        success: function(data) {
          // Resets initial state of .new-tweet
          getInitialState();
          $("#tweets-container").prepend(createTweetElement(data[0]));
          $("article.tweet").slideDown();
        }
      });
    }
  });
});
