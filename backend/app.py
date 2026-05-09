from flask import Flask
from flask import request 

from services.compiling_service import process_code

app = Flask(__name__)

@app.route("/process_code", methods=['GET', 'POST'])
def recieve_code():

    code = request.form["code"]
    result = process_code(code)
    return result


if __name__ == "__main__":
    app.run(debug=True)