/**
 * On document load:
 * - retrieve & construct Tweets from DB
 * - Handles Tweet submission
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
