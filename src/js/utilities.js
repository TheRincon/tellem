
function send_spike_info(lat, lng, marker) {
  let url = 'http://127.0.0.1:8080/spike';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST'
    },
    body: JSON.stringify({
      'lat': lat,
      'lng': lng,
      'spike_type': `${marker.spike_type}`,
      'spike_id': `${marker.id}`
    })
  })
  .then(response => response.json())
  .catch((error) => { console.error('Error:', error); });
}

const load_spikes = async () => {
  let url = 'http://127.0.0.1:8080/load_spikes';
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .catch((error) => { console.error('Error:', error); });
  return res
}

function parse_spike(spike) {
  spike_json = {
    'spike_id': spike[1],
    'lat': spike[2],
    'lng': spike[3],
    'spike_type': spike[4]
  }

  return spike_json
}

async function load_spike_media(marker_id) {
  let url = `http://127.0.0.1:8080/load_spikes?spike_id=${marker_id}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST'
    }
  })
  .then(function(response) {
    console.log(response);
    return response.json();
  })
  .catch((error) => { console.error('Error:', error); });
  return res
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
