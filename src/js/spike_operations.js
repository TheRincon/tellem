

function set_bubble(marker) {
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
     '<div id="hid" style="display: none;"></div>' +
     `<div id="exit-marker-${marker.id}">` +
     `<img src="img/bb.png" width="30" height="30">` +
     '</div>'
  );
}

function set_spike(marker) {
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
           `<div class="${marker.spike_type}"></div>`
  );
}

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  let dropArea = document.getElementById("drop-area")
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  let dropArea = document.getElementById("drop-area")
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

function uploadFile(file) {
  let url = 'YOUR URL HERE'
  let formData = new FormData()

  formData.append('file', file)

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(() => { /* Done. Inform the user */ })
  .catch(() => { /* Error. Inform the user */ })
}
