$(function() {
  $('#tweets-container').on('click', '.tweet-actions .like' , function() {
    if ($(this).css('color') === 'rgb(255, 0, 0)') {
      $(this).css('color', 'rgb(36, 71, 81)');
    } else {
      $(this).css('color', 'rgb(255, 0, 0)');
    }

    // .tweet: $(this).parent().parent().parent().data()
  })
});
