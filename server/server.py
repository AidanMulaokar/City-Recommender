from flask import Flask

app = Flask(__name__)


@app.route("/results")
def results():
    return {"lat": 47.6062, "lon": -122.3321}


if __name__ == "__main__":
    app.run(debug=True)
