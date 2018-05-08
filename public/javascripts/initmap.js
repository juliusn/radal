let map;

function initMap() {
  let latLng = new google.maps.LatLng(-34.397, 150.644);
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    draggable: false,
  });

  let marker = new google.maps.Marker({
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

    marker.setPosition(latLng);
    map.panTo(latLng);
  }

  function hideSpinner() {
    let spinner = document.querySelector('#spinner');
    if (spinner) spinner.parentNode.removeChild(spinner);
  }
};
