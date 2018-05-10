function initMap() {
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

  navigator.geolocation.watchPosition(updateMap,
      handleLocationError);

  updateUserEmoji();

  function handleLocationError(error) {
    alert(error.message);
  }

  function updateMap(position) {
    const data = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/users/location');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
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
            disableDefaultUI: false,
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
      if (xhr.readyState === 4 && xhr.status === 500) alert(xhr.responseText);
    };
    xhr.send(JSON.stringify(data));


  }
}
