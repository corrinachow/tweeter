function createTweetElement(tweet) {
  const { name, avatars, handle } = tweet.user;
  const { text } = tweet.content;

  const $tweet = $("<article>")
    .addClass("tweet")
    .css("display", "none");

  // Tweet header
  const avatar = $("<img>").attr("src", avatars.regular);
  const $h2 = $("<h2>").text(name);
  const $handle = $("<span>")
    .addClass("handle")
    .text(handle);
  const $header = $("<header>")
    .css("opacity", "0.8")
    .append(avatar, $("<div>").append($h2, $handle));

  // Tweet body
  const $tweetBody = $("<p>").text(text);

  // Tweet footer
  const $date = $("<span>").text(moment.utc(tweet.created_at).fromNow());
  const $tweetActions = `<div class='tweet-actions' style="visibility: hidden">
  <span class='report'><i title="Report post" class="fab fa-font-awesome-flag"></i></span>
      <span class='retweet'><i title="Retweet" class="fas fa-retweet"></i></span>
      <span class='like'><i title="Like post" class="fas fa-heart"></i></span>
    </div>`;
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

function validateTweet(tweet) {
  let $div = $("<div>")
    .addClass("error")
    .css("display", "none");

  if (!tweet) {
    const $error = $("<p>").text("Tweets must be more than one character");
    if ($("section.new-tweet").find(".error").length === 0) {
      $div.append($error);
      $("section.new-tweet").prepend($div);
      $(".error").slideDown();
    } else {
      $("section.new-tweet")
        .find(".error")
        .html($error);
    }
    return false;
  } else if (tweet.length > 140) {
    console.log("error");
    const $error = $("<p>").text("The tweet is too long");
    if ($("section.new-tweet").find(".error").length === 0) {
      $div.append($error);
      $("section.new-tweet").prepend($div);
      $(".error").slideDown();
    } else {
      $("section.new-tweet")
        .find(".error")
        .html($error);
    }
    return false;
  }
  return true;
}

$(function() {
  loadTweets();
  $(".new-tweet form").submit(function(e) {
    e.preventDefault();
    const $tweetData = $(this).serialize();
    console.log($tweetData);
    if (validateTweet($tweetData.substr(5))) {
      $.ajax({
        url: "/tweets",
        type: "POST",
        cache: false,
        data: $tweetData,
        success: function(data) {
          $(".new-tweet")
            .find("textarea")
            .val("");
          $("#tweets-container").prepend(createTweetElement(data[0]));
          $("article.tweet").slideDown();
        }
      });
    }
  });
});
