$(document).ready(function() {
  $('.nav-container').find('.nav-toggle').click(function() {
    let target = $(this.getAttribute('href'));
    let visibleCallback = target.attr('visible-callback');
    target.slideToggle('fast', () => {
      if (target.css('display') === 'block') eval(visibleCallback);
    });
    $('.collapse').not($(target)).slideUp('fast');
  });
});
