const statusChangeCallback = (response) => {
  if (response.status === 'connected') {
    testAPI();
  }
}

const checkLoginState = () => {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

const finishedRendering = () => {
  console.log('finished rendering plugins');
  const spinner = document.getElementById('spinner');
  spinner.removeAttribute('style');
  spinner.removeChild(spinner.childNodes[0]);
}

window.fbAsyncInit = function() {
  console.log('initializing FB SDK');
  FB.init({
    appId: '152386338928593',
    cookie: true,
    xfbml: true,
    version: 'v2.12'
  });

  FB.getLoginStatus(function(response) {
    console.log('FB SDK initialized', response);
    finishedRendering();
    statusChangeCallback(response);
  });
};

((d, s, id) => {
  let js;
  let fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk/debug.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
