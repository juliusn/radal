$(document).ready(function() {
  $('.nav-container').find('.nav-toggle').click(function() {
    let target = $(this.getAttribute('href'));
    target.slideToggle('fast');
    $('.collapse').not($(target)).slideUp('fast');
  });
});
