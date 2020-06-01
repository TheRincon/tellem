var started = false
var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 8,
  center: {
    lat: 48.11111,
    lng: 15.11111
  },
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

function placeMarker(position, map) {
  var marker_uuid = uuidv4();
  spike_type_ = SpikeType();
  spike_color_ = '';
  if (spike_type_ == 'start_spike') {
    spike_color_ = '#004225'
  } else {
    spike_color_ = '#660000'
  }
  var marker = new RichMarker({
    position: position,
    map: map,
    optimized: false,
    id: marker_uuid,
    clicked: false,
    spike_color: spike_color_,
    spike_type: spike_type_,
    cursor: 'pointer',
    content: '<style>' +
             `.${spike_type_} {` +
 	           'width: 0;' +
	           'height: 0;' +
	           'border-left: 10px solid transparent;' +
	           'border-right: 10px solid transparent;' +
	           `border-top: 20px solid ${spike_color_}; }` +
             '</style>' +
             `<div class="${spike_type_}"></div>`
  });

  (function(marker) {
                 // https://css-tricks.com/the-shapes-of-css/
                 google.maps.event.addListener(marker, 'click', function() {
                   if (this.clicked == false) {
                     this.setContent('<style>' +
                     `#talkbubble-${this.spike_type} {` +
                           'width: 80px;' +
                           'height: 80px;' +
                           'background: #ffffff;' +
                           'position: relative;' +
                           'bottom: 15px;' +
                           '-moz-border-radius: 5px;' +
                           '-webkit-border-radius: 5px;' +
                           `border: thick solid ${this.spike_color};` +
                           'border-radius: 10px;}' +
                         `#talkbubble-${this.spike_type}:before {` +
                           'content: "";' +
                           'position: absolute;' +
                           'top: 100%;' +
                           'right: 38%;' +
                           'width: 0;' +
                           'height: 0;' +
                           '-moz-box-shadow: none;' +
                           '-webkit-box-shadow: none;' +
                           'box-shadow: none;' +
                           'border-left: 10px solid transparent;' +
                           'border-right: 10px solid transparent;' +
	                         `border-top: 20px solid ${this.spike_color}; }` +
                              '</style>' +
                              `<div id="talkbubble-${this.spike_type}">` +
                              '<form action="/file-upload" class="dropzone"' +
                              'id="upload-dropzone"></form>' +
                              '</div>')
                     this.clicked = true
                   } else {
                     this.setContent('<style>' +
                              `.${this.spike_type} {` +
                              'width: 0;' +
                              'height: 0;' +
                              'border-left: 10px solid transparent;' +
                              'border-right: 10px solid transparent;' +
                              `border-top: 20px solid ${this.spike_color}}` +
                              '</style>' +
                              `<div class="${this.spike_type}"></div>`)
                     this.clicked = false
                   }
                 });
             })(marker);
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

var delete_marker = function(uuid) {
  var delete_candidate = marker_list[uuid];
  delete_candidate.setMap(null);
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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
    }
  });

}

// This event listener calls addMarker() when the map is clicked.
google.maps.event.addListener(map, 'click', function(e) {
  placeMarker(e.latLng, map);
  if (started == true) {
    started = false;
  }
});
