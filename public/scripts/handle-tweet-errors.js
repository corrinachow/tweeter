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