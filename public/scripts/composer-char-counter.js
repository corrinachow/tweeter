$(document).ready(function() {
  $(".new-tweet")
    .find("form")
    .on("keyup", "textarea", function() {
      let counter = $(".counter");
      let length = $(this).val().length;
      counter.text(140 - length);
      length <= 140
        ? counter.css("color", "black")
        : counter.css("color", "red");
    });
});
