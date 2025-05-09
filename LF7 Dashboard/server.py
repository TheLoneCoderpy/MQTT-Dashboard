from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_value")
def f():
    return random.random() * 3.0 + 25


if __name__ == "__main__":
    app.run(debug = True, port = 666, host = "0.0.0.0")