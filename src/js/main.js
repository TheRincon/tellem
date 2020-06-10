// look into this: https://github.com/atmist/snazzy-info-window

var started = false
var marker_list = {}
var singleClick = false;
function init() {
  var map = new google.maps.Map(document.getElementById('map'), {
    disableDoubleClickZoom: true,
    zoom: 8,
    center: {
      lat: 48.11111,
      lng: 15.11111
    },
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });

  google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);
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

function placeMarker(position, map) {
  var marker_uuid = uuidv4();
  spike_type_ = SpikeType();
  spike_color_ = '';
  if (spike_type_ == 'start_spike') {
    spike_color_ = '#004225'
  } else {
    spike_color_ = '#000000'
  }
  var marker = new RichMarker({
    position: position,
    map: map,
    optimized: false,
    id: marker_uuid,
    clicked: false,
    shadow: false,
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
             `<div class="${spike_type_}"></div>` +
             `<div id="exit-marker-${marker_uuid}">` +
             '</div>'
  });

  clearSingleClick = function(fun){
      singleClick = false;
  };

  function delete_marker(marker) {
    marker.setMap(null);
  }

  google.maps.event.addListener(marker, 'rightclick', function(e) {
    console.log('42893748');
    delete_marker(this);
  });

  // this works, just saving for another use
  // google.maps.event.addListener(marker, 'dblclick', function(e) {
  //   delete_marker(this);
  // });

  google.maps.event.addListener(marker, 'click', function(event) {
    if (marker.clicked == true) {
      var el = document.getElementById(`exit-marker-${marker.id}`);
      // var mark = document
      if (el.contains(event.target)) {
              marker.clicked = false;
      }
      marker.clicked = false;
    } else if (marker.clicked == false) {
      // https://css-tricks.com/the-shapes-of-css/
      marker.setContent('<style>' +
           `#talkbubble-${marker.spike_type} {` +
           'width: 80px;' +
           'height: 80px;' +
           'background: #ffffff;' +
           'z-index: 999;' +
           'position: relative;' +
           'bottom: 15px;' +
           '-moz-border-radius: 5px;' +
           '-webkit-border-radius: 5px;' +
           `border: thick solid ${marker.spike_color};` +
           'border-radius: 10px;}' +
           `#talkbubble-${marker.spike_type}:before {` +
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
           `border-top: 20px solid ${marker.spike_color}; }` +
           '#drop-area {' +
           'background: white;' +
           'border-radius: 5px;' +
           'border: 2px dashed rgb(0, 135, 247);' +
           'border-image: none;' +
           'max-width: 70px;' +
           'max-height: 70px;' +
           'margin-top: 3px;' +
           'margin-bottom: 5px;' +
           'margin-left: auto;' +
           'margin-right: auto; }' +
           '#drop-area.highlight { border-color: purple; }' +
           `#exit-marker-${marker.id} {` +
           'max-width: 40px;' +
           'max-height: 40px;' +
           'shadow: none;' +
           'position: absolute;' +
           'top: -15px;' +
           'right: -15px; }' +
           '#fileElem { display: none; }' +
           '</style>' +
           `<div id="talkbubble-${marker.spike_type}">` +
           '<div id="drop-area">' +
           '<form class="dz">' +
           '<input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)">' +
           '</form>' +
           '<div id="gallery" /></div>' +
           '<img src="img/new_blue.svg" alt="plus" width="70" height="70"> ' +
           '</form>' +
           '</div>' +
           `<div id="exit-marker-${marker.id}">` +
           `<img src="img/bb.png" width="30" height="30">` +
           '</div>')
          let dropArea = document.getElementById("drop-area")

          // Prevent default drag behaviors
          ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
            document.body.addEventListener(eventName, preventDefaults, false)
          })

          // Highlight drop area when item is dragged over it
          ;['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false)
          })

          ;['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false)
          })

          // Handle dropped files
          dropArea.addEventListener('drop', handleDrop, false)

          function preventDefaults (e) {
            e.preventDefault()
            e.stopPropagation()
          }

          function highlight(e) {
            dropArea.classList.add('highlight')
          }

          function unhighlight(e) {
            dropArea.classList.remove('active')
          }

          function handleDrop(e) {
            var dt = e.dataTransfer
            var files = dt.files

            handleFiles(files)
          }

          function handleFiles(files) {
            files = [...files]
            files.forEach(uploadFile)
            files.forEach(previewFile)
          }

          function previewFile(file) {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = function() {
              let img = document.createElement('img')
              img.src = reader.result
              document.getElementById('gallery').appendChild(img)
            }
          }

          function uploadFile(file, i) {
            var url = ''
            var xhr = new XMLHttpRequest()
            var formData = new FormData()
            xhr.open('POST', url, true)
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

            xhr.addEventListener('readystatechange', function(e) {
              if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('4234');
              }
              else if (xhr.readyState == 4 && xhr.status != 200) {
                // Error. Inform the user
              }
            })

            formData.append('upload_preset', 'ujpu6gyk')
            formData.append('file', file)
            xhr.send(formData)
          }
      marker.clicked = true;
      document.getElementById(`exit-marker-${marker.id}`).addEventListener("click", function(e) {
        marker.setContent('');
        marker.setContent('<style>' +
                 `.${marker.spike_type} {` +
                 'width: 0;' +
                 'height: 0;' +
                 'border-left: 10px solid transparent;' +
                 'border-right: 10px solid transparent;' +
                 `border-top: 20px solid ${marker.spike_color}; }` +
                 '</style>' +
                 `<div id="exit-marker-${marker.id}">` +
                 `<div class="${marker.spike_type}"></div>`);
      });
    }
  });
  map.panTo(position);
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
