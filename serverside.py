from flask import Flask, jsonify, request, make_response, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os
from requests_toolbelt import MultipartEncoder
import sqlite3
import json
import zipfile
import io
import pathlib
import magic

app = Flask(__name__)
CORS(app, support_credentials=True)

def sqlite_ops():
    sql_create_media = """ CREATE TABLE IF NOT EXISTS media (
                                        id INTEGER PRIMARY KEY,
                                        spike_id text NOT NULL,
                                        file_path text NOT NULL
                                    ); """

    sql_create_spikes = """ CREATE TABLE IF NOT EXISTS spikes (
                                    id INTEGER PRIMARY KEY,
                                    spike_id text NOT NULL,
                                    lat text NOT NULL,
                                    lng text NOT NULL,
                                    spike_type text NOT NULL
                                ); """

    conn = create_connection('tellem.db')
    # create tables
    if conn is not None:
        # create projects table
        create_table(conn, sql_create_media)
        create_table(conn, sql_create_spikes)
        return conn
    else:
        print("Error! cannot create the database connection.")

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

conn = sqlite_ops()
cursor = conn.cursor()

def insert_spike_media(conn, spike_id, file_path):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO media (spike_id, file_path ) VALUES (?, ?)",
        (spike_id, file_path)
    )
    conn.commit()

def load_spikes(conn):
    cursor = conn.cursor()
    cursor.execute(
        '''SELECT * FROM spikes;''',
    )
    data = cursor.fetchall()

    return json.dumps(data)


def load_spike_media_ids(conn, spike_id):
    spike_media = []
    cursor = conn.cursor()
    rc = cursor.execute(
        f'''SELECT id FROM media WHERE spike_id = '{spike_id}';'''
    )
    data = cursor.fetchall()
    spike_media = []
    if len(data) > 0:
        for index, i in enumerate(data):
            spike_media.append(i[0])
    return spike_media

def load_spike_media(conn, media_id, spike_id):
    cursor = conn.cursor()
    cursor.execute(
        f'''SELECT file_path FROM media WHERE spike_id = '{spike_id}' AND id = '{media_id}';'''
    )
    media_filepath = cursor.fetchall()
    if len(media_filepath) != 1:
        print('ERROR image query gone wrong')
    else:
        mime_type = magic.from_file(media_filepath[0][0], mime=True)
        print(mime_type)
        print(media_filepath[0][0])
        return media_filepath[0][0], mime_type


def add_spike(conn, spike_id, lat, lng, spike_type):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO spikes (spike_id, lat, lng, spike_type) VALUES (?, ?, ?, ?)",
        (spike_id, lat, lng, spike_type)
    )
    data = cursor.fetchall()
    return json.dumps(data)

@app.route('/media', methods=['POST'])
@cross_origin(supports_credentials=True)
def handle_image():
    file = request.files['file']
    spike_id = request.headers['spike_id']
    if not os.path.exists('media'):
        os.makedirs('media')
    if file.filename == '':
        return redirect(request.url)
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('media', filename)
        file.save(file_path)
        with sqlite3.connect("tellem.db") as con:
            insert_spike_media(con, spike_id, file_path)
    return jsonify({"status":"ok"})

@app.route('/spike', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_spike_to_db():
    body = json.loads(request.data.decode('utf-8'))
    with sqlite3.connect("tellem.db") as con:
        add_spike(con, body['spike_id'], body['lat'], body['lng'], body['spike_type'])
    return jsonify({"status":"ok"})

@app.route('/load_spikes', methods=['GET'])
@cross_origin(supports_credentials=True)
def load_spike_from_db():
    with sqlite3.connect("tellem.db") as con:
        spike_array = load_spikes(con)
    return spike_array

@app.route('/load_spike_media_ids', methods=['GET'])
@cross_origin(supports_credentials=True)
def load_spike_media_ids_from_db():
    spike_id = request.args.get('spike_id')
    with sqlite3.connect("tellem.db") as con:
        spike_media = load_spike_media_ids(con, spike_id)
        return json.dumps(spike_media)
        # if spike_media:
        #     with zipfile.ZipFile('data.zip', mode='w') as z:
        #         for i in spike_media:
        #             z.write(i)
        #     return send_file(
        #         'data.zip',
        #         mimetype='application/zip',
        #         as_attachment=True,
        #         attachment_filename='data.zip'
        #     )
        # else:
        #     empty_zip_data = b'PK\x05\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
        #
        #     with open('empty.zip', 'wb') as zip:
        #         zip.write(empty_zip_data)
        #         return send_file(
        #             'empty.zip',
        #             mimetype='application/zip',
        #             as_attachment=True,
        #             attachment_filename='empty.zip'
        #         )

@app.route('/load_spike_media_by_id', methods=['GET'])
@cross_origin(supports_credentials=True)
def load_spike_media_by_id():
    media_id = request.args.get('media_id')
    spike_id = request.args.get('spike_id')
    with sqlite3.connect("tellem.db") as con:
        media, mime_type = load_spike_media(con, media_id, spike_id)
        response = make_response(send_file(media, as_attachment=True))
        response.headers['filename'] = media
        return response

app.run(port=8080)

conn.close()
