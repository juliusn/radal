window.fbAsyncInit = () => {
  FB.init({
    appId: '152386338928593',
    cookie: true,
    xfbml: true,
    version: 'v2.12',
  });

  FB.AppEvents.logPageView();
};

(function(d, s, id) {
  let js;
  let fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
