// import createHTMLMapMarker from "./html-map-marker.js";

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 8,
  center: {
    lat: 48.11111,
    lng: 15.11111
  },
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

var centerControlDiv = document.createElement('div');
var centerControl = new CenterControl(centerControlDiv, map);

centerControlDiv.index = 1;
map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

var marker_list = {}

var delete_marker = function(uuid) {
  var delete_candidate = marker_list[uuid];
  delete_candidate.setMap(null);
}

// panTo(LatLng) panTo(position)

// var infoWindow = function(uuid) {
//   var infowindow = new google.maps.InfoWindow({
//     content: "<table style=\"width:100%\">\r\n  <tr>\r\n    <td>Ersin<\/td>\r\n    <td>Daniel<\/td> \r\n  <\/tr>\r\n<\/table>"
//   });
//   infowindow.open(map, marker_list[uuid]);
// }

var iw = function() {
  // var infowindow = new google.maps.InfoWindow;
  // google.maps.event.addListener(marker, 'click', (function() {
  //        return function() {
  //            marker.setIcon('http://i.stack.imgur.com/t7vAK.png')
  //            // infowindow.setContent("<table style=\"width:100%\">\r\n  <tr>\r\n    <td>Ersin<\/td>\r\n    <td>Daniel<\/td> \r\n  <\/tr>\r\n<\/table>");
  //            // infowindow.open(map, marker);
  //        }
  //      })
  // (marker));

  google.maps.event.addListener(marker, 'click', function() {
    if (this.clicked == false) {
      this.setIcon('https://www.ruralshores.com/assets/marker-icon.png')
      this.clicked = true
    } else {
      this.setIcon()
      this.clicked = false
    }
  });

  // google.maps.event.addListener(marker, 'mouseover', function() {
  //     marker.setIcon('https://www.ruralshores.com/assets/marker-icon.png');
  // });
  //
  // google.maps.event.addListener(marker, 'mouseout', function() {
  //     marker.setIcon();
  // });
}
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function placeMarker(position, map) {
  var marker_uuid = uuidv4();
  marker = new google.maps.Marker({
    position: position,
    map: map,
    id: marker_uuid,
    clicked: false
  });
  map.panTo(position);
  marker_list[marker_uuid] = marker;
  marker.addListener('click', iw(marker_uuid));
  iw();
  // marker_list[marker_uuid].addListener('click', infoWindow(marker_uuid));
  // marker_list[marker_uuid].addListener('hover', infoWindow(marker_uuid));
  // google.maps.event.addListener(marker, "rightclick", function (point) { id = this.uuid; delete_marker(id) });
}

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#8B0000';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(255,255,255)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Pick Trip Center';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    map.panTo({lat: 48.11111, lng: 15.11111});
  });

}



// This event listener calls addMarker() when the map is clicked.
google.maps.event.addListener(map, 'click', function(e) {
  placeMarker(e.latLng, map);
});
