
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

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
