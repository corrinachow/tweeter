$(function() {
  $('#tweets-container').on('click', '.tweet-actions .like' , function() {
    $id = $(this).parent().parent().parent().data('tweetid');

     $.post('/tweets/' + $id, function (res) {
      console.log(res)
     })

    if ($(this).css('color') === 'rgb(255, 0, 0)') {
      $(this).css('color', 'rgb(36, 71, 81)');
    } else {
      $(this).css('color', 'rgb(255, 0, 0)');
    }


  })
});
