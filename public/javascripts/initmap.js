function initMap() {

  let latLng;
  let map;
  let mapEnabled = false;
  let mapElmnt = document.getElementById('map');
  const icon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    strokeColor: '#4267b2',
    strokeWeight: 4,
  };
  const invisible = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 0,
    strokeColor: '#ffffff',
    strokeWeight: 0,
  };

  updateCurrentLocation();

  updateUserEmoji();

  function updateCurrentLocation() {
    try {
      let watchId = navigator.geolocation.watchPosition(updateMap,
          handleLocationError);
    } catch (e) {
      alert(e.message);
    }
  }

  function handleLocationError(error) {
    alert(error.message);
  }

  function updateMap(position) {
    latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude);

    if (map) {
      map.panTo(latLng);
    } else {
      map = new google.maps.Map(mapElmnt, {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: false,
      });
    }

    if (marker) {
      marker.setPosition(latLng);
    } else {
      marker = new google.maps.Marker({
        position: latLng,
        icon: !emoji ? icon : invisible,
        label: emoji ? {
          text: emoji,
          fontSize: '14px',
        } : null,
        draggable: false,
        map: map,
      });
    }
    if (!mapEnabled) enableMapUI();
  }

  function updateUserEmoji() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/users');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
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
    xhr.send();
  }
}
