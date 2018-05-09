const container = document.querySelector('.emoji-select');
emoji.map((e, i) => {
  const button = document.createElement('button');
  button.innerHTML = e;
  button.addEventListener('click', function(ev) {
    const request = new XMLHttpRequest();
    request.onload = (ev) => {
      if (request.status === 200) {
        uploadForm.reset();
        alert('OK');
      } else {
        alert(request.statusText);
      }
    };
    request.open('POST', '/users', true);
  });
  container.appendChild(button);
});
