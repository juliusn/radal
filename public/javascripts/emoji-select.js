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
          if (marker) {
            const label = {text: emoji, fontSize: '14px'};
            marker.setLabel(label);
            marker.set('icon', {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
              strokeColor: '#ffffff',
              strokeWeight: 0,
            });
          }
          document.querySelectorAll('.user-emoji').forEach((elmnt) => {
            elmnt.innerHTML = emoji;
          });
        }
      };
      xhr.send(JSON.stringify(data));
    });
    container.appendChild(button);
  });
});
