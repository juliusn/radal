const statusChangeCallback = (response) => {
  console.log('statusChangeCallback', response);
  switch (response.status) {
    case 'connected':
      console.log('connected');
      break;
    case 'not_authorized':
      console.log('connected, not authorized');
      break;
    case 'unknown':
      console.log('not connected');
      break;
  }
};

const finishedRendering = () => {
  const spinner = document.querySelector('#spinner');
  spinner.removeAttribute('style');
  spinner.parentNode.removeChild(spinner);
};

window.fbAsyncInit = () => {
  FB.init({
    appId: '152386338928593',
    cookie: true,
    xfbml: true,
    version: 'v2.12',
  });

  finishedRendering();

  FB.getLoginStatus(statusChangeCallback);
};

(function(d, s, id) {
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
