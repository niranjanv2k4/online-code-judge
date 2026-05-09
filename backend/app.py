from flask import Flask
from flask import request 

app = Flask(__name__)

@app.route("/process_code", methods=['GET', 'POST'])
def process_code():
    print(request.form["code"])
    return "code recieved"


if __name__ == "__main__":
    app.run(debug=True)