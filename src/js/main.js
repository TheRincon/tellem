// look into this: https://github.com/atmist/snazzy-info-window

var started = false
var singleClick = false;
function init() {
  var map = new google.maps.Map(document.getElementById('map'), {
    disableDoubleClickZoom: true,
    zoom: 6,
    center: {
      lat: 48.11111,
      lng: 15.11111
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  (async () => {
    var spikes = await load_spikes();
    parsed_spikes = spikes.map(parse_spike);
    parsed_spikes.forEach((spike, i) => {
      loadMarker(spike['spike_id'], spike['lat'], spike['lng'], spike['spike_type'], map)
    });
  })()

  google.maps.event.addListener(map, 'click', function(e) {
    var marker = placeMarker(e.latLng, map);
    send_spike_info(e.latLng.lat().toString(), e.latLng.lng().toString(), marker);
    if (started == true) {
      started = false;
    }
  });

  var startTripDiv = document.createElement('div');
  var endTripDiv = document.createElement('div');
  var startTrip = new TripControl(startTripDiv, map, 'Start Trip', '#004225');
  var endTrip = new TripControl(startTripDiv, map, 'End Trip', '#880000');
  startTripDiv.index = 1;
  endTripDiv.index = 2;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(startTripDiv);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(endTripDiv);
}

google.maps.event.addDomListener(window, 'load', init);
