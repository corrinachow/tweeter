$(function() {
  $("#nav-bar")
    .children("#compose")
    .on("click", function() {
      $("section.new-tweet").slideToggle("slow", function() {
        if ($(this).is(":visible")) {
          $("textarea").focus();
        }
      });
    });
});