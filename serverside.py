from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route('/', methods=['POST'])
@cross_origin(supports_credentials=True)
def stuff():
    file = request.files['file']
    if not os.path.exists('media'):
        os.makedirs('media')
    if file.filename == '':
        return redirect(request.url)
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join('media', filename))
    return jsonify({"status":"ok"})

app.run(port=8080)