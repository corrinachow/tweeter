function createTweetElement(tweet) {
  const { name, avatars, handle } = tweet.user;
  const { text } = tweet.content;

  const $tweet = $("<article>").addClass("tweet");

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
}

function loadTweets() {
  let tweetData = [];
  $.get("/tweets", function(data) {
    tweetData = data;
  }).then(function() {
    renderTweets(tweetData.reverse());
  });
}

function validateTweet(tweet) {
  console.log(tweet);
  if (!tweet) {
    // Make blink effect
    $("section.new-tweet form").prepend("Your tweet is empty");
    return false
  }
  if (tweet.length > 140) {
    return $("section.new-tweet form").prepend("Your tweet is too long");
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
          $("#tweets-container").prepend(createTweetElement(data[data.length - 1]));
          // $('article.tweet').slideDown();
        }
      });
    }
  });
});
