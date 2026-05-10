from flask import Flask
from flask import request, jsonify
from flask_cors import CORS

from services.compiling_service import process_code
from services.compiling_service import run_code

app = Flask(__name__)

CORS(app)

@app.route("/execute_code", methods=['GET', 'POST'])
def recieve_code():

    code = request.json["code"]
    input = request.json['input']
    expected = request.json['expected']

    exit_code, status, output = process_code(code,input, expected)

    return jsonify({
        "exit_code": exit_code,
        "status" : status,
        "output" : output,
    })


if __name__ == "__main__":
    app.run(debug=True)