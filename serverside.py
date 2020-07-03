from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os
import sqlite3
import json

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

def insert(conn):
    print('wow')

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

def load_spike_media(conn, spike_id):
    cursor = conn.cursor()
    cursor.execute(
        '''SELECT file_path FROM media WHERE spike = ?;''', (spike_id, )
    )
    data = cursor.fetchall()

    return json.dumps(data)

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

@app.route('/load_spike_media', methods=['GET'])
@cross_origin(supports_credentials=True)
def load_spike_media():
    spike_id = request.args.get('spike_id')
    with sqlite3.connect("tellem.db") as con:
        spike_media = load_spike_media(con, spike_id)
    return spike_media


app.run(port=8080)
