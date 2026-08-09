from werkzeug.sansio import response
from docker.utils import json_stream
from flask import Flask
from flask import request, jsonify
from flask_cors import CORS

from services.compiling_service import process_code
from services.authentication import validate
from services.authentication import new_user
from services.authentication import validate_token
from services.redis_client import r
from services.utils import llm_service

from dotenv import load_dotenv
import os, json

import psycopg2 
from psycopg2 import pool


load_dotenv()

app = Flask(__name__)

db_pool = pool.SimpleConnectionPool(
    1,              #minimum 1 connection
    10,             #maximum 10 connections
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
    token = request.json['token']

    if validate_token(token) == False:
        return jsonify({
            "exit_code": 1,
            "status" : "REQUEST FAILED",
            "output" : "",
        })
    
    job_id, status = process_code(code, language, input, expected)

    return jsonify({
        "job_id": job_id,
        "status" : status,
    })

@app.route("/login", methods=['POST'])
def login():
    username = request.json["username"]
    password = request.json["password"]

    output , token = validate(db_pool, username, password)

    return jsonify({
        "output": output,
        "token" : token
    })

@app.route("/register", methods=['POST'])
def register():
    username = request.json["username"]
    password = request.json["password"]

    output, token = new_user(db_pool, username, password)
    return jsonify({
        "output" : output,
        "token" : token
    })

@app.route("/verify_token", methods=['POST'])
def check_token():
    token = request.json['token']

    if validate_token(token) == False:
        return jsonify({
            "valid": False
        })
    return jsonify({
        "valid": True
    })

@app.route("/get_result", methods=['POST'])
def get_result():

    job_id = request.json['job_id']
    
    result = r.get(f"result:{job_id}")

    if result is None:
        return jsonify({
            "status" : "PENDING"
        })
    
    result = json.loads(result)
    
    return jsonify({
        "exit_code" : result['exit_code'],
        "status" : result['status'],
        "output" : result['output']
    })

@app.route("/generate_code", methods=['POST'])
def generate_code():
    prompt = request.json['prompt']
    language = request.json['language']
    
    response = llm_service.process_prompt(prompt, language)

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)