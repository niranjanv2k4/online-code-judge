from flask import Flask
from flask import request, jsonify
from flask_cors import CORS

from services.compiling_service import process_code
from services.compiling_service import run_code

app = Flask(__name__)

CORS(app)

@app.route("/process_code", methods=['GET', 'POST'])
def recieve_code():

    code = request.json["code"]
    exit_code, status, output, container_id = process_code(code)

    return jsonify({
        "exit_code": exit_code,
        "status" : status,
        "output" : output,
        "container_id": container_id
    })

@app.route("/run", methods=['GET', 'POST'])
def recieve_input():
    input = request.json['input']
    expected = request.json['expected']
    container_id = request.json['container_id']
    exit_code, output = run_code(input, expected, container_id)
    return jsonify({
        "exit_code" : exit_code,
        "output" : output
    })


if __name__ == "__main__":
    app.run(debug=True)