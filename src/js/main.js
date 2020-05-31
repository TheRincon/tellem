var marker_list = {}

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 8,
  center: {
    lat: 48.11111,
    lng: 15.11111
  },
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

function placeMarker(position, map, started) {
  var marker_uuid = uuidv4();
  spike_color = SpikeColor(started);
  var marker = new RichMarker({
    position: position,
    map: map,
    optimized: false,
    id: marker_uuid,
    clicked: false,
    content: '<style>' +
             '.triangle-down {' +
 	           'width: 0;' +
	           'height: 0;' +
	           'border-left: 10px solid transparent;' +
	           'border-right: 10px solid transparent;' +
	           `border-top: 20px solid #660000; }` +
             '</style>' +
             '<div class="triangle-down"></div>',
    spike_type: SpikeType()
  });

  marker_list[marker_uuid] = marker;

  // var marker = createHTMLMapMarker({
  //   position: position,
  //   map: map,
  //   id: marker_uuid,
  //   clicked: false,
  //   map: map,
  //   spike_color: SpikeColor(),
  //   html: '<style>' +
  //            '.triangle-down {' +
 	//            'width: 0;' +
	//            'height: 0;' +
	//            'border-left: 10px solid transparent;' +
	//            'border-right: 10px solid transparent;' +
	//            `border-top: 20px solid ${spike_color}; }` +
  //            '</style>' +
  //            '<div class="triangle-down"></div>'
  // });

  // marker.addListener('click', function() {
  //   if (this.clicked == false) {
  //     this.setContent('<style>' +
  //              '.triangle-down {' +
  //              'width: 0;' +
  //              'height: 0;' +
  //              'border-left: 10px solid transparent;' +
  //              'border-right: 10px solid transparent;' +
  //              'border-top: 20px solid #555500}' +
  //              '</style>' +
  //              '<div class="triangle-down"></div>')
  //     this.clicked = true
  //   } else {
  //     this.setContent('<style>' +
  //              '.triangle-down {' +
  //              'width: 0;' +
  //              'height: 0;' +
  //              'border-left: 10px solid transparent;' +
  //              'border-right: 10px solid transparent;' +
  //              'border-top: 20px solid #ff0000}' +
  //              '</style>' +
  //              '<div class="triangle-down"></div>')
  //     this.clicked = false
  //   }
  // });

  (function(marker) {
                 // add click event
                 google.maps.event.addListener(marker, 'click', function() {
                   if (this.clicked == false) {
                     this.setContent('<style>' +
                     '#talkbubble {' +
                           'width: 80px;' +
                           'height: 80px;' +
                           'background: #660000;' +
                           'position: relative;' +
                           'bottom: 20px;' +
                           '-moz-border-radius: 5px;' +
                           '-webkit-border-radius: 5px;' +
                           'border-radius: 10px;}' +
                         '#talkbubble:before {' +
                           'content: "";' +
                           'position: absolute;' +
                           'top: 100%;' +
                           'right: 38%;' +
                           // 'top: 7px;' +
                           'width: 0;' +
                           'height: 0;' +
                           'border-left: 10px solid transparent;' +
                           'border-right: 10px solid transparent;' +
	                         `border-top: 20px solid #660000; }` +
                              '</style>' +
                              '<div id="talkbubble"></div>')
                     this.clicked = true
                   } else {
                     spike_color = SpikeColor(started);
                     this.setContent('<style>' +
                              '.triangle-down {' +
                              'width: 0;' +
                              'height: 0;' +
                              'border-left: 10px solid transparent;' +
                              'border-right: 10px solid transparent;' +
                              'border-top: 20px solid #660000}' +
                              '</style>' +
                              '<div class="triangle-down"></div>')
                     this.clicked = false
                   }
                 });
             })(marker);

  // marker.addListener("click", function() {
  //   // e.stopPropagation();
  //   if (this.clicked == false) {
  //     this.setContent('<style>' +
  //              '.triangle-down {' +
  //              'width: 0;' +
  //              'height: 0;' +
  //              'border-left: 10px solid transparent;' +
  //              'border-right: 10px solid transparent;' +
  //              'border-top: 20px solid #555500}' +
  //              '</style>' +
  //              '<div class="triangle-down"></div>')
  //     this.clicked = true
  //   } else {
  //     this.setContent('<style>' +
  //              '.triangle-down {' +
  //              'width: 0;' +
  //              'height: 0;' +
  //              'border-left: 10px solid transparent;' +
  //              'border-right: 10px solid transparent;' +
  //              'border-top: 20px solid #ff0000}' +
  //              '</style>' +
  //              '<div class="triangle-down"></div>')
  //     this.clicked = false
  //   }
  // });
  map.panTo(position);
}


var startTripDiv = document.createElement('div');
var endTripDiv = document.createElement('div');
var startTrip = new TripControl(startTripDiv, map, 'Start Trip', '#004225');
var endTrip = new TripControl(startTripDiv, map, 'End Trip', '#880000');
startTripDiv.index = 1;
endTripDiv.index = 2;
map.controls[google.maps.ControlPosition.TOP_LEFT].push(startTripDiv);
map.controls[google.maps.ControlPosition.TOP_CENTER].push(endTripDiv);

var started = false

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

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function SpikeColor() {
  if (started == true) {
    return '#004225'
  } else {
    return '#660000'
  }
}

function SpikeType() {
  if (started == true) {
    return 'start_spike'
  } else {
    return 'normal_spike'
  }
}

function TripControl(tripDiv, map, inner_html, color) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = color;
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  tripDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(255,255,255)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = inner_html;
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function() {
    if (started == false) {
      started = true
    } else {
      started = false
    }
  });

}

// This event listener calls addMarker() when the map is clicked.
google.maps.event.addListener(map, 'click', function(e) {
  placeMarker(e.latLng, map, started);
});
