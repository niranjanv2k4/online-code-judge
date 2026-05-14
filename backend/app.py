from flask import Flask
from flask import request, jsonify
from flask_cors import CORS

from services.compiling_service import process_code
from services.compiling_service import run_code
from services.authentication import validate
from services.authentication import new_user

from dotenv import load_dotenv
import os

import psycopg2


load_dotenv()

app = Flask(__name__)

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="authdb",
    user="postgres",
    password=os.getenv("DB_PASSWORD")
)

CORS(app)

@app.route("/execute_code", methods=['GET', 'POST'])
def recieve_code():

    code = request.json["code"]
    language = request.json["language"]
    input = request.json['input']
    expected = request.json['expected']

    exit_code, status, output = process_code(code, language, input, expected)

    return jsonify({
        "exit_code": exit_code,
        "status" : status,
        "output" : output,
    })

@app.route("/login", methods=['POST'])
def login():
    username = request.json["username"]
    password = request.json["password"]

    output , token = validate(conn, username, password)

    return jsonify({
        "output": output,
        "token" : token
    })

@app.route("/register", methods=['POST'])
def register():
    username = request.json["username"]
    password = request.json["password"]

    output, token = new_user(conn, username, password)
    return jsonify({
        "output" : output,
        "token" : token
    })

if __name__ == "__main__":
    app.run(debug=True)