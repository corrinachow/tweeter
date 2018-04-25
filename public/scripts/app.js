const data = [
  {
    user: {
      name: "Newton",
      avatars: {
        small: "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        regular: "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        large: "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      handle: "@SirIsaac"
    },
    content: {
      text:
        "If I have seen further it is by standing on the shoulders of giants"
    },
    created_at: 1524605460438
  },
  {
    user: {
      name: "Descartes",
      avatars: {
        small: "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        regular: "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        large: "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      handle: "@rd"
    },
    content: {
      text: "Je pense , donc je suis"
    },
    created_at: 1461113959088
  },
  {
    user: {
      name: "Johann von Goethe",
      avatars: {
        small: "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        regular: "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        large: "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      handle: "@johann49"
    },
    content: {
      text: "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    created_at: 1461113796368
  }
];

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
  const $header = $("<header>").append(avatar, $("<div>").append($h2, $handle));

  // Tweet body
  const $tweetBody = $("<p>").text(text);

  // Tweet footer
  const $date = $("<span>").text(moment.utc(tweet.created_at).fromNow());
  const $tweetActions = `<div class='tweet-actions'>
  <span class='report'><i class="fab fa-font-awesome-flag"></i></span>
      <span class='retweet'><i class="fas fa-retweet"></i></span>
      <span class='like'><i class="fas fa-heart"></i></span>
    </div>`;
  const $footer = $("<footer>").append($date, $tweetActions);

  return $tweet.append($header, $tweetBody, $footer);
}

function renderTweets(tweets) {
  let tweetList = [];
  for (let tweet of tweets) {
    tweetList.push(createTweetElement(tweet));
  }
  return tweetList;
}

$(function() {
  $("#tweets-container").append(renderTweets(data));
});