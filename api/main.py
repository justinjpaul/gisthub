import os
from flask import Flask, jsonify, Response, g, request, session
import config
import json
import time
import uuid

from blueprints.groups import groups
from blueprints.users import users
from blueprints.events import events
from db.db_client import db

from datetime import datetime, date
from bson import ObjectId
from flask.json import JSONEncoder
from werkzeug.routing import BaseConverter
from fixed_session import FixedSession

from db.models import LoginInput, User
import bcrypt
from cloud_storage import storage_client
from flask_cors import CORS


class MongoJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        else:
            return super().default(o)


class ObjectIdConverter(BaseConverter):
    def to_python(self, value):
        return ObjectId(value)

    def to_url(self, value):
        return str(value)


def create_app():
    app = Flask(__name__)
    app.json_encoder = MongoJSONEncoder
    app.url_map.converters["_id"] = ObjectIdConverter

    app.register_blueprint(groups, url_prefix="/api/v1/groups")
    app.register_blueprint(users, url_prefix="/api/v1/users")
    app.register_blueprint(events, url_prefix="/api/v1/events")

    # Error 404 handler
    @app.errorhandler(404)
    def resource_not_found(e):
        return jsonify(error=str(e)), 404

    # Error 405 handler
    @app.errorhandler(405)
    def resource_not_found(e):
        return jsonify(error=str(e)), 405

    # Error 401 handler
    @app.errorhandler(401)
    def custom_401(error):
        return Response("API Key required.", 401)

    @app.errorhandler(Exception)
    def handle_exception(e: Exception):
        """Return JSON instead of HTML for HTTP errors."""
        # start with the correct headers and status code from the error
        response = Response()
        # replace the body with JSON
        response.data = json.dumps({"msg": str(e)})
        response.content_type = "application/json"
        response.status = 500
        return response

    @app.route("/version", methods=["GET"], strict_slashes=False)
    def version():
        response_body = {
            "success": 1,
        }
        return jsonify(response_body)

    @app.route("/ping")
    def hello_world():
        return "pong"

    @app.route("/api/v1/login", methods=["POST"])
    def login():
        login_request = LoginInput(**request.get_json())
        user = db.client["users"].find_one({"email": login_request.email})
        if user:
            user = User(**user)
            if bcrypt.checkpw(login_request.password.encode(), user.password.encode()):
                session["user_id"] = user.id
                session["name"] = user.first_name + " " + user.last_name
                return jsonify(user.dict(by_alias=True)), 200
            else:
                return jsonify({"error": "Invalid password"}), 400
        else:
            return jsonify({"error": "Invalid username"}), 400

    @app.route("/api/v1/logout", methods=["POST"])
    def logout():
        del session["user_id"]
        return jsonify({}), 200

    @app.before_request
    def before_request_func():
        execution_id = uuid.uuid4()
        g.start_time = time.time()
        g.execution_id = execution_id

        print(g.execution_id, "ROUTE CALLED ", request.url)

    @app.after_request
    def after_request(response):
        if response and response.get_json():
            data = response.get_json()

            data["time_request"] = int(time.time())
            data["version"] = config.VERSION

            response.set_data(json.dumps(data))

        return response

    return app


app = create_app()
CORS(app, supports_credentials=True)
db.connect()

app.config["SESSION_PERMANENT"] = True  # this is flipped/broken lol
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_MONGODB"] = db.root_client
app.config["SESSION_MONGODB_DB"] = "mhacks"
app.config["SESSION_MONGODB_COLLECTION"] = "sessions"
FixedSession(app)

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5050)
