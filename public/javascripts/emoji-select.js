const container = document.querySelector('.emoji-select');
emoji.map((e, i) => {
  const button = document.createElement('button');
  button.innerHTML = e;
  button.addEventListener('click', function(ev) {
    socket.emit('emojiSelect', {
      emoji: e,
    });
  });
  container.appendChild(button);
});
