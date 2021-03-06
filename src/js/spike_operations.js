function updateDisplay(marker) {
  document.getElementById(`gallery-${marker.id}`).innerHTML = "";
  marker.display_array.forEach(file => {
    handleMedia(file, marker);
  });
}

function handleMedia(file, marker) {
  let media_type = classify_media(file);
  switch(media_type) {
    case 'image':
      setupImage(file, marker);
      break;
    case 'video':
      setupVideo(file, marker);
      break;
    case 'video':
      setupApplication(file, marker);
      break;
  }
}

function setupImage(file, marker) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img');
    img.src = reader.result;
    document.getElementById(`gallery-${marker.id}`).appendChild(img);
  }
}

function setupVideo(file, marker) {
  let ext = file.name.split('.').pop().toLowerCase();
  let ihtml = `<video width="70" height="70"><source src="${file.name}#t=0.1" type="video/${ext}" /></video>`
  console.log(ext)
  document.getElementById(`gallery-${marker.id}`).insertAdjacentHTML('afterbegin', ihtml);
}

function setupApplication(file, marker) {
  let ext = file.name.split('.').pop().toLowerCase();
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    console.log(`application/${ext}`);
    let emb = document.createElement('embed');
    emb.src = reader.result;
    emb.setAttribute('height', 70);
    emb.setAttribute('width', 70);
    emb.setAttribute('type', `application/${ext}`);
    document.getElementById(`gallery-${marker.id}`).appendChild(emb);
  }
}

function set_bubble(marker) {
  // https://css-tricks.com/the-shapes-of-css/
  marker.setContent('<style>' +
     `#talkbubble-${marker.spike_type}-${marker.id} {` +
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
     `#talkbubble-${marker.spike_type}-${marker.id}:before {` +
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
     `#drop-area-${marker.id} {` +
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
     `#drop-area-${marker.id}.highlight { border-color: purple; max-width: 450px; }` +
     `#drop-area-${marker.id}.opened { border-color: green; max-width: 450px; }` +
     `#gallery-${marker.id} { max-height: 75px; max-width: 450px; }` +
     `#exit-marker-${marker.id} {` +
     'float: left;' +
     'max-width: 40px;' +
     'max-height: 40px;' +
     'shadow: none;' +
     'position: absolute;' +
     'top: -15px;' +
     'right: -15px; }' +
     '#fileElem { display: none; }' +
     '</style>' +
     `<div id="talkbubble-${marker.spike_type}-${marker.id}">` +
     `<div id="drop-area-${marker.id}">` +
     '<form class="dz">' +
     '<input type="file" id="fileElem" multiple accept="image/*,video/*,audio/*,.pdf" onchange="handleFiles(this.files)">' +
     '</form>' +
     `<div id="gallery-${marker.id}" class="gallery" />` +
     '</div>' +
     '<img src="img/new_blue.svg" alt="plus" width="70" height="70" id=""> ' +
     '</form>' +
     '</div>' +
     `<div id="hid-${marker.id}" style="display: none;"></div>` +
     `<div id="exit-marker-${marker.id}">` +
     `<img src="img/bb.png" width="30" height="30">` +
     '</div>'
  );

  updateDisplay(marker);
  document.getElementById(`drop-area-${marker.id}`).classList.add('opened')
}

function classify_media(file) {
  switch(file.name.split('.').pop().toLowerCase()) {
    case 'jpeg':
      return 'image'
    case 'jpg':
      return 'image'
    case 'tiff':
      return 'image'
    case 'png':
      return 'image'
    case 'mp4':
      return 'video'
    case 'avi':
      return 'video'
    case 'flv':
      return 'video'
    case 'mkv':
      return 'video'
    case 'webm':
      return 'video'
    case 'ogg':
      return 'video'
    case 'mov':
      return 'video'
    case 'ogv':
      return 'video'
    case 'vob':
      return 'video'
    case 'gif':
      return 'video'
    case 'gifv':
      return 'video'
    case 'pdf':
      return 'application'
    case 'mp3':
      return 'audio'
    case 'wma':
      return 'audio'
    case 'wav':
      return 'audio'
    case 'aax':
      return 'audio'
    case 'aax':
      return 'audio'
    case 'oga':
      return 'audio'
    case 'txt':
      return 'text'
    case 'rtf':
      return 'text'
    case 'doc':
      return 'text'
    case 'docx':
      return 'text'
    default:
      return 'unsupported'
  }
}

function add_selected_media(marker, media) {
  media_type = classify_media(media);
  var type_array = [];
  switch(media_type) {
    case 'image':
      type_array = marker.image_urls;
      break;
    case 'video':
      type_array = marker.video_urls;
      break;
    case 'application':
      type_array = marker.application_urls;
      break;
    case 'audio':
      type_array = marker.music_urls;
      break;
    case 'text':
      type_array = marker.notes_urls;
      break;
    default:
      break;
  }
  type_array.push(media);
  if (type_array.length == 1) {
    marker.display_array.push(type_array[0])
  }
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

function set_spike_color(spike_type) {
  switch(spike_type) {
    case 'start_spike':
      return '#004225'
    case 'normal_spike':
      return '#000000'
    case 'end_spike':
      return '#660000'
    case 'leg_spike':
      return '#660000'
    case 'ticket_spike':
      return '#000000'
    default:
      // code block
  }
}

function SpikeType() {
  return (started ? 'start_spike' : 'normal_spike')
}

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}
