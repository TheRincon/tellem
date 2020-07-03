function loadMarker(spike_id, lati, longi, spike_type, map) {
  var spike_color = set_spike_color(spike_type);
  var new_lat = Number(parseFloat(lati).toFixed(5)); // ugly as sin
  var new_lng = Number(parseFloat(longi).toFixed(5)); // ugly as sin
  var position = new google.maps.LatLng(new_lat, new_lng);
  var marker = new RichMarker({
    position: position,
    map: map,
    optimized: false,
    id: spike_id,
    clicked: false,
    shadow: false,
    media_types: [],
    media_length: 0,
    pdf_urls: [],
    image_urls: [],
    video_urls: [],
    notes_urls: [],
    music_urls: [],
    spike_color: spike_color,
    spike_type: spike_type,
    cursor: 'pointer',
    content: '<style>' +
             `.${spike_type} {` +
 	           'width: 0;' +
	           'height: 0;' +
	           'border-left: 10px solid transparent;' +
	           'border-right: 10px solid transparent;' +
	           `border-top: 20px solid ${spike_color}; }` +
             '</style>' +
             `<div class="${spike_type}"></div>` +
             `<div id="exit-marker-${spike_id}">` +
             '</div>'
  });

  markers[marker.id] = marker

  function delete_marker(marker) {
    marker.setMap(null);
  }

  google.maps.event.addListener(marker, 'click', function(event) {
    // bug that if the bubble clicked twice it has to be double clicked closed.
    if ((marker.clicked == true) && (document.getElementById(`hid-${marker.id}`) == null)) {
      marker.clicked = false;
    } else if (marker.clicked == false) {
      set_bubble(marker);
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
      dropArea.addEventListener('drop', set_width)

      function handleDrop(e) {
        var dt = e.dataTransfer
        var files = dt.files

        handleFiles(files)
      }

      function previewFile(file) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        if (marker.media_length < 5) {
          reader.onloadend = function() {
            let img = document.createElement('img')
            img.src = reader.result
            document.getElementById(`gallery-${marker.id}`).appendChild(img)
          }
        }
      }

      function handleFiles(files) {
        files = [...files]
        files.forEach(uploadFile)
        files.forEach(previewFile)
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

      function set_width() {
        var bubble = document.getElementById(`talkbubble-${marker.spike_type}-${marker.id}`)
        marker.media_length += 1;
        gallery_width = marker_width(marker.media_length);
        bubble.style.width = `${gallery_width}px`;
      }

      function marker_width(len) {
        return len >= 5 ? '450' : ((len + 1) * 75).toString();
      }

      function pick_media_type(filename) {
        return filename.split('.').pop();
      }

      function add_media_types(file) {
        switch(pick_media_type(file)) {
          case 'jpeg':
            // code block
            break;
          case 'jpg':
            // code block
            break;
          case 'png':
            // code block
            break;
          default:
            // code block
        }
      }

      document.getElementById(`exit-marker-${marker.id}`).addEventListener("click", function(e) {
        set_spike(marker);
      });
      marker.clicked = true;
    }
  });
  // map.panTo(position);
  return marker
}
