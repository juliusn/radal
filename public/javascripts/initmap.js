function initMap() {

  let latLng;
  let map;
  let marker;
  let mapEnabled = false;
  let mapElmnt = document.getElementById('map');

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
    if (!mapEnabled) enableMapUI();
  }
}
