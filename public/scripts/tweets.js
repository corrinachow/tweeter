const dateIntervals = {
  years: { intervalName: "year", ms: 31536000 },
  month: { intervalName: "month", ms: 2592000 },
  days: { intervalName: "days", ms: 86400 },
  minutes: { intervalName: "minutes", ms: 3600 }
};

function timeSince(date) {
  // Gets seconds difference between now and post date
  const secondsDifference = Math.floor((new Date() - date) / 1000);
  for (const interval in dateIntervals) {
    const timeInterval = Math.floor(
      secondsDifference / dateIntervals[interval].ms
    );
    if (timeInterval > 1) {
      return `${timeInterval} ${dateIntervals[interval].intervalName}`;
    }
  }
  return `${Math.floor(secondsDifference)} seconds`;
}

$(function() {
  const $tweetActions = $(".tweet-actions");
  const $header = $(".tweet").find("header");
  const $tweetTime = $("article.tweet .date").text();

  $("article.tweet").mouseenter(e => {
    $tweetActions.css("visibility", "visible");
    $header.css("opacity", "1");
  });
  $("article.tweet").mouseleave(e => {
    $tweetActions.css("visibility", "hidden");
    $header.css("opacity", "0.8");
  });
  $(".date").text(timeSince($tweetTime));
});
