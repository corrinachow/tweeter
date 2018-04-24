$(function() {

  // const $header = $(".tweet").find("header");
  // const $tweetTime = $("article.tweet .date").text();

  $("article.tweet").mouseenter(function() {
    const $tweetActions = $(this).find('.tweet-actions');
    const $header = $(this).find('header');
    $tweetActions.css("visibility", "visible");
    $header.css("opacity", "1");
  });
  $("article.tweet").mouseleave(function() {
    const $tweetActions = $(this).find('.tweet-actions');
    const $header = $(this).find('header');
    $tweetActions.css("visibility", "hidden");
    $header.css("opacity", "0.8");
  });
});
