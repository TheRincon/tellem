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
                                        id integer PRIMARY KEY,
                                        spike_id text NOT NULL,
                                        file_path text NOT NULL
                                    ); """

    sql_create_spikes = """ CREATE TABLE IF NOT EXISTS spikes (
                                    spike_id text PRIMARY KEY,
                                    lat text NOT NULL,
                                    lon text NOT NULL,
                                    spike_type text NOT NULL
                                ); """

    conn = create_connection('media.db')
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

def insert_spike_media(spike_id):
    pass

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
        file.save(os.path.join('media', filename))
    return jsonify({"status":"ok"})

@app.route('/spike', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_spike_to_db():
    body = json.loads(request.data.decode('utf-8'))
    return jsonify({"status":"ok"})


app.run(port=8080)
