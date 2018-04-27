/**
 * ------------------------------------------------------------------------
 * RE-INITIALISE STATE AFTER SUCCESSFUL POST
 * ------------------------------------------------------------------------
 */

function getInitialState() {
  $("section.new-tweet")
    .find("textarea")
    .val("");
  $("section.new-tweet")
    .find(".error")
    .slideUp();
  $("section.new-tweet")
    .find(".counter")
    .text("140");
}