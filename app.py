from flask import Flask
from flask.ext.cors import CORS

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello iusis"