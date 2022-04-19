from flask import Flask, request
import json
import time


app = Flask(__name__)


@app.route("/results", methods=['POST'])
def results():
    inputs = request.get_json(force=True)
    time.sleep(10)
    print(inputs)
    return {"lat": 47.6062, "lon": -122.3321}


if __name__ == "__main__":
    app.run(debug=True)
