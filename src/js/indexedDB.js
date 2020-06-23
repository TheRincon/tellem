// var dir = "Src/themes/base/images/";
// var fileextension = ".png";
// var regexp = new Regexp("\.png|\.jpg|\.gif");
// $.ajax({
//     //This will retrieve the contents of the folder if the folder is configured as 'browsable'
//     url: dir,
//     success: function (data) {
//         $(data).find("a").filter(function () {return regexp.test($(this).text());}).each(function () {
//             var filename = this.href.replace(window.location.host, "").replace("http://", "");
//             $("body").append("<img src='" + dir + filename + "'>");
//         });
//     }
// });

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var request = window.indexedDB.open("spikeMedia", 3);

request.onerror = function(e) {
	console.error('Unable to open database.');
}

request.onsuccess = function(e) {
	db = e.target.result;
	console.log('db opened');
}

request.onupgradeneeded = function(e) {
	let db = e.target.result;
	db.createObjectStore('cachedForms', {keyPath:'id', autoIncrement: true});
	dbReady = true;
}

function doFile(e) {
	console.log('change event fired for input field');
	let file = e.target.files[0];
	var reader = new FileReader();
	//reader.readAsDataURL(file);
	reader.readAsBinaryString(file);

	reader.onload = function(e) {
		//alert(e.target.result);
		let bits = e.target.result;
		let ob = {
			created:new Date(),
			data:bits
		};

		let trans = db.transaction(['cachedForms'], 'readwrite');
		let addReq = trans.objectStore('cachedForms').add(ob);

		addReq.onerror = function(e) {
			console.log('error storing data');
			console.error(e);
		}

		trans.oncomplete = function(e) {
			console.log('data stored');
		}
	}
}
