markers = {};

function placeMarker(
  map,
  position = false,
  spike_id = false,
  lati = false,
  longi = false,
  spike_type = false
) {
  var marker_uuid = (spike_id != false) ? spike_id : uuidv4();
  var spike_type_ = (spike_type != false) ? spike_type : SpikeType();
  var spike_color_ = set_spike_color(spike_type_);
  if (position == false) {
      var new_lat = Number(parseFloat(lati).toFixed(5)); // ugly as sin
      var new_lng = Number(parseFloat(longi).toFixed(5)); // ugly as sin
      position = new google.maps.LatLng(new_lat, new_lng);
  }

  var marker = new RichMarker({
    position: position,
    map: map,
    optimized: false,
    id: marker_uuid,
    clicked: false,
    shadow: false,
    display_array: [],
    image_urls: [],
    video_urls: [],
    notes_urls: [],
    music_urls: [],
    application_urls: [],
    spike_color: spike_color_,
    spike_type: spike_type_,
    cursor: 'pointer',
    content: `
      <style>
        :root {
          --spike-color: ${spike_color_};
        }
    
        .${spike_type_} {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 20px solid ${spike_color_};
        }
      </style>
      <div class="${spike_type_}"></div>
    <div id="exit-marker-${marker_uuid}"></div>`
  });

  (async () => {
    var spike_ids = await load_spike_media_ids(spike_id);
    spike_ids.forEach(async (id) => {
      var medium = await load_media_by_id(id, marker.id);
      var typed_array = add_selected_media(marker, medium); // saved return value for later
    });
  })()

  markers[marker.id] = marker;

  function delete_marker(marker) {
    marker.setMap(null);
  }

  google.maps.event.addListener(marker, 'click', function(event) {
    // bug that if the bubble clicked twice it has to be double clicked closed.
    if ((marker.clicked == true) && (document.getElementById(`hid-${marker.id}`) == null)) {
      marker.clicked = false;
    } else if (marker.clicked == false) {
      set_bubble(marker, handleFiles);
      
      // updateDisplay(marker);
      // https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      // https://codepen.io/joezimjs/pen/yPWQbd
      var dropArea = document.getElementById(`drop-area-${marker.id}`)
      function highlight(e) {
        dropArea.classList.add('highlight')
      }

      function unhighlight(e) {
        dropArea.classList.remove('active')
      }

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

      function handleDrop(e) {
        var dt = e.dataTransfer
        var files = dt.files

        handleFiles(files)
      }

      function addFile(file) {
        add_selected_media(marker, file);
        marker.tiles.forEach(tile => tile.renderInto(document.getElementById(`gallery-${marker.id}`)));
      }

      function handleFiles(files) {
        files = [...files]
        files.forEach(uploadFile)
        files.forEach(addFile)
      }

      function uploadFile(file) {
        let url = 'http://127.0.0.1:8080/media';
        let formData = new FormData();

        formData.append('file', file)

        fetch(url, {
          method: 'POST',
          headers: {
            'spike_id': `${marker.id}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'spike_id',
          },
          body: formData
        })
        .then(response => response.json())
        .catch((error) => { console.error('Error:', error); });
      }

      document.getElementById(`exit-marker-${marker.id}`).addEventListener("click", function(e) {
        set_spike(marker);
      });
      marker.clicked = true;
    }
  });
  // map.panTo(position);
  return marker // [marker.id, marker.spike_type]
}
