const container = document.querySelector('.emoji-select');
emoji.map((e, i) => {
  const button = document.createElement('button');
  button.innerHTML = e;
  button.addEventListener('click', function(ev) {
    const data = {emoji: e};
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/users');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
  });
  container.appendChild(button);
});
