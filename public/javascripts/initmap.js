function initMap() {
  let latLng = new google.maps.LatLng(-34.397, 150.644);

  let map;
  let marker;

  updateCurrentLocation();

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
    hideSpinner();
    latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude);

    if (map) {
      map.panTo(latLng);
    } else {
      map = new google.maps.Map(document.getElementById('map'), {
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
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          strokeColor: '#4267b2',
          strokeWeight: 4,
        },
        draggable: false,
        map: map,
      });
    }
  }

  function hideSpinner() {
    let spinner = document.querySelector('#spinner');
    if (spinner) spinner.parentNode.removeChild(spinner);
  }
}
