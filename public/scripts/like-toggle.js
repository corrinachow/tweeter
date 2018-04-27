$(function() {
  $("#tweets-container").on("click", ".tweet-actions .like", function() {
    $id = $(this)
      .parent()
      .parent()
      .parent()
      .data("tweetid");
    $.post("/tweets/" + $id, res => {
      $(this)
        .parent()
        .siblings(".likes")
        .text(res[0].likes + 1);
    });
    // Use arrow function to select current element & scope $(this) in $.post
    if ($(this).css("color") === "rgb(255, 0, 0)") {
      $(this).css("color", "rgb(36, 71, 81)");
    } else {
      $(this).css("color", "rgb(255, 0, 0)");
    }
  });
});
