const containers = document.querySelectorAll('.emoji-select');
containers.forEach((container) => {
  emojis.map((e, i) => {
    const button = document.createElement('button');
    button.innerHTML = e;
    button.addEventListener('click', function(ev) {
      const data = {emoji: e};
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/users/emoji');
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.responseType = 'json';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          emoji = xhr.response.emoji;
          updateUI();
          $('.collapse').slideUp('fast');
        }
        if (xhr.readyState === 4 && xhr.status === 500) alert(xhr.responseText);
      };
      xhr.send(JSON.stringify(data));
    });
    container.appendChild(button);
  });
});
