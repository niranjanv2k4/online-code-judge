from flask import Flask
from flask import request, jsonify
from flask_cors import CORS

from services.compiling_service import process_code

app = Flask(__name__)

CORS(app)

@app.route("/process_code", methods=['GET', 'POST'])
def recieve_code():

    code = request.json["code"]
    exit_code, status, output = process_code(code)
    return jsonify({
        "exit_code": exit_code,
        "status" : status,
        "output" : output
    })


if __name__ == "__main__":
    app.run(debug=True)