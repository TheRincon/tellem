class AbstractMediaTile {
  constructor(urls) {
    this.urls = urls
  }

  throwNotImplemented(name) {
    throw new Error(`Provide ${name} for ${this.constructor.name}`)
  }

  get mediaIconSvg() {
    this.throwNotImplemented("mediaIconSvg")
  }

  renderMediaIcon(node) {
    if (!this._mediaIcon) {
      const mediaIcon = document.createElement("div");
      mediaIcon.classList.add("media_icon")
      mediaIcon.insertAdjacentHTML(
        "afterbegin",
        this.mediaIconSvg
      );
  
      this._mediaIcon = mediaIcon;
    }

    node.appendChild(this._mediaIcon);
    return this._mediaIcon;
  }

  get actionOverlayIconSvg() {
    this.throwNotImplemented("actionOverlayIconSvg")
  }

  handleActionOverlayClick() {
    this.throwNotImplemented("handleActionOverlayClick()")
  }

  renderActionOverlay(node) {  
    if (!this._actionOverlay) {
      const actionOverlay = document.createElement("div");
      actionOverlay.classList.add("action_overlay");
      actionOverlay.insertAdjacentHTML(
        "afterbegin",
        this.actionOverlayIconSvg
      );
  
      actionOverlay.addEventListener("click", () => {
        this.handleActionOverlayClick()
      })
      this._actionOverlay = actionOverlay;
    }

    node.appendChild(this._actionOverlay);
    return this._actionOverlay;
  }

  renderInto(node) {
    this.throwNotImplemented("renderInto(node)")
  }
}

class LoadingAbstractMediaTile extends AbstractMediaTile {
  loadPreview(fileIndex) {
    this.throwNotImplemented("loadPreview(fileIndex)");
  }

  renderLoaderInto(node) {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.insertAdjacentHTML(
      "afterbegin",
      `<div class="lds-facebook"><div></div><div></div><div></div></div>`
    );

    node.appendChild(loader);
    return loader
  }

  fileExtension(fileIndex) {
    return this.urls[fileIndex].name.split('.').pop().toLowerCase();
  }

  dataCache = []

  loadDataFromCache(fileIndex) {
    if (!this.dataCache[fileIndex]) {
      return readFileAsDataUrl(this.urls[fileIndex]).then(dataUrl => {
        this.dataCache[fileIndex] = dataUrl
        return dataUrl
      })
      
    }
    return Promise.resolve(this.dataCache[fileIndex])
  }

  get mediaType() {
    this.throwNotImplemented("mediaType")
  }

  renderSingle(fileIndex) {
    this.throwNotImplemented("renderSingle(fileIndex)")
  }

  onSingleClose(fileIndex) {}

  handleActionOverlayClick() {
    showModal(
      `${this.mediaType} / ${this.urls[0].name}`,
      this.renderSingle(0),
      () => this.onSingleClose(0)
    )
  }

  renderInto(node) {
    if (this.urls.length === 0) return
    if (!this._tile) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      this._tile = tile
    }
    this._tile.innerHTML = ``;

    // if (this.urls.length > 1) {
    //   const icon = this.renderMediaIcon(this.tile);
    //   icon.insertAdjacentHTML("afterend", `<div class="count">${this.urls.length}</div>`)
    // } else {

      if (!this._preview) {
        this._preview = this.loadPreview(0)
      }
      const mediaIcon = this.renderMediaIcon(this._tile);
      const loader = this.renderLoaderInto(this._tile);
      this._preview.then(preview => {
        loader.remove()
        if (preview instanceof HTMLElement) {
          mediaIcon.replaceWith(preview);
        } else {
          mediaIcon.remove();
          this._tile.insertAdjacentHTML("afterbegin", preview)
        }
        this.renderActionOverlay(this._tile)
      })
      node.appendChild(this._tile);
    // }
  }
}

class ImageLoadingTile extends LoadingAbstractMediaTile {
  mediaType = "Images"

  mediaIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
    </svg>
  `;

  actionOverlayIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="28" width="28">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/>
    </svg>
  `;

  imgs = []

  loadPreview(fileIndex) {
    return this.loadDataFromCache(fileIndex).then(dataUrl => {
      let img = document.createElement('img');
      img.src = dataUrl;
     
      this.imgs[fileIndex] = img;
      return img
    })
  }

  renderSingle(fileIndex) {
    return this.imgs[fileIndex].cloneNode()
  }
}

class VideoLoadingTile extends LoadingAbstractMediaTile {
  mediaType = "Videos"

  mediaIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/>
    </svg>
  `;

  actionOverlayIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" height="28" width="28">
      <g>
        <rect fill="none" height="24" width="24" y="0"/>
      </g>
      <g>
        <g>
          <polygon points="9.5,7.5 9.5,16.5 16.5,12"/>
          <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18.01H4V5.99h16V18.01z"/>
        </g>
      </g>
    </svg>
  `;

  loadPreview(fileIndex) {
    return this.loadDataFromCache(fileIndex).then(dataUrl => {
      let ext = this.fileExtension(fileIndex);
      return `
        <video width="70" height="70">
          <source src="${dataUrl}#t=0.1" type="video/${ext}" />
        </video>`
    })
  }

  renderSingle(fileIndex) {
    return `
        <video width="480" height="320" controls autoplay>
          <source src="${this.dataCache[fileIndex]}#t=0.1" type="video/${this.fileExtension(fileIndex)}" />
        </video>`
  }
}

class ApplicationLoadingTitle extends LoadingAbstractMediaTile {
  mediaType = "Application"

  mediaIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
      <path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
    </svg>`;
  
  actionOverlayIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px">
      <g><rect fill="none" height="24" width="24" x="0"/></g>
      <g><path d="M22.47,5.2C22,4.96,21.51,4.76,21,4.59v12.03C19.86,16.21,18.69,16,17.5,16c-1.9,0-3.78,0.54-5.5,1.58V5.48 C10.38,4.55,8.51,4,6.5,4C4.71,4,3.02,4.44,1.53,5.2C1.2,5.36,1,5.71,1,6.08v12.08c0,0.58,0.47,0.99,1,0.99 c0.16,0,0.32-0.04,0.48-0.12C3.69,18.4,5.05,18,6.5,18c2.07,0,3.98,0.82,5.5,2c1.52-1.18,3.43-2,5.5-2c1.45,0,2.81,0.4,4.02,1.04 c0.16,0.08,0.32,0.12,0.48,0.12c0.52,0,1-0.41,1-0.99V6.08C23,5.71,22.8,5.36,22.47,5.2z M10,16.62C8.86,16.21,7.69,16,6.5,16 c-1.19,0-2.36,0.21-3.5,0.62V6.71C4.11,6.24,5.28,6,6.5,6C7.7,6,8.89,6.25,10,6.72V16.62z M19,0.5l-5,5V15l5-4.5V0.5z"/></g>
    </svg>`;

  embs = []

  loadPreview(fileIndex) {
    const ext = this.fileExtension(fileIndex);
    return this.loadDataFromCache(fileIndex).then(dataUrl => {
      const emb = document.createElement('embed');
      emb.src = dataUrl;
      emb.setAttribute('height', 70);
      emb.setAttribute('width', 70);
      emb.setAttribute('type', `application/${ext}`);
      this.embs[fileIndex] = emb;
      return emb
    })
  }

  renderSingle(fileIndex) {
    const emb = this.embs[fileIndex].cloneNode()
    emb.setAttribute('height', 480);
    emb.setAttribute('width', 320);
    return emb
  }
}

class AudioLoadingTile extends LoadingAbstractMediaTile {
  mediaType = "Audios"

  mediaIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>
    </svg>`;

  actionOverlayIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M10 16.5l6-4.5-6-4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>`;

  loadPreview(fileIndex) {
    return this.loadDataFromCache(fileIndex).then(dataUrl => {
      let ext = this.fileExtension(fileIndex);
      return this.renderMediaIcon(this._tile)
    })
  }

  singleRendered = []

  removeSingleRendered(fileIndex) {
    if (this.singleRendered[fileIndex]) {
      document.getElementById(this.singleRendered[fileIndex]).remove()
      this.singleRendered[fileIndex] = undefined
    }
  }

  onSingleClose = this.removeSingleRendered

  renderSingle(fileIndex) {
    this.removeSingleRendered(fileIndex)

    const audioId = `${this.mediaType}/${this.urls[fileIndex].name}/${Date.now()}`
    this.singleRendered[fileIndex] = audioId

    return `
      <audio controls autoplay id="${audioId}">
        <source src="${this.dataCache[fileIndex]}" type="audio/${this.fileExtension(fileIndex)}">
        Your browser does not support the audio element.
      </audio>`;
  }
}

function createTiles(marker) {
  return [new ImageLoadingTile(marker.image_urls),
    new VideoLoadingTile(marker.video_urls),
    new ApplicationLoadingTitle(marker.application_urls),
    new AudioLoadingTile(marker.music_urls)
  ]//.map(urls => 
   // new LoadingAbstractMediaTile(urls)
  //)
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
    case 'application':
      setupApplication(file, marker);
      break;
    case 'audio':
      setupAudio(file, marker);
      break;

    default:
      console.warn(`Unsupported media type ${media_type} on file`, file, marker)
  }
}

function readFileAsDataUrl(file) {
  return new Promise((res, rej) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      // random delay to show the loader
      setTimeout(() => res(reader.result), 4000 * Math.random())
    }
    reader.onerror = rej
  })
}

function set_bubble(marker, handleFiles) {
  const fileUploadId = `file-upload-${marker.id}`
  // https://css-tricks.com/the-shapes-of-css/
  marker.setContent(`
    <div id="talkbubble-${marker.spike_type}-${marker.id}" class="talkbubble">
      <div id="drop-area-${marker.id}" class="drop-area">
        <div id="gallery-${marker.id}" class="gallery"></div>
        <form class="dz">
          <label for="${fileUploadId}" class="add-btn-wrapper">
            <img src="img/new_blue.svg" alt="plus" width="70" height="70">
            <input type="file" id="${fileUploadId}" class="file-input" multiple accept="image/*,video/*,audio/*,.pdf">
          </label>
        </form>
        
      </div>
      <div id="hid-${marker.id}" class="hid" style="display: none;"></div>
      <div id="exit-marker-${marker.id}" class="exit-marker">
      <img src="img/bb.png" width="30" height="30">
    </div>`
  );

  const gallery = document.getElementById(`gallery-${marker.id}`)

  if (!marker.tiles) {
    marker.tiles = createTiles(marker)
  }
  marker.tiles.forEach(tile => tile.renderInto(gallery));
  document.getElementById(fileUploadId).addEventListener("change", e => { handleFiles(e.target.files) });
  document.getElementById(`drop-area-${marker.id}`).classList.add('opened');
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
    case 'x-wav':
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
