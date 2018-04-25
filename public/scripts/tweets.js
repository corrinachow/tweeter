$(function() {
  $('#tweets-container').on('mouseenter', '.tweet' , function() {
    const $tweetActions = $(this).find('.tweet-actions');
    const $header = $(this).find('header');
    $tweetActions.css("visibility", "visible");
    $header.css("opacity", "1")
  });
  $('#tweets-container').on('mouseleave', '.tweet' , function() {
    const $tweetActions = $(this).find('.tweet-actions');
    const $header = $(this).find('header');
    $tweetActions.css("visibility", "hidden");
    $header.css("opacity", "0.8")
  });
});