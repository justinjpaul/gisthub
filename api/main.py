import os
from flask import Flask, jsonify, Response, g, request
import config
import json
import time
import uuid

from blueprints.groups import groups
from db.db_client import db

from datetime import datetime, date
from bson import ObjectId
from flask.json import JSONEncoder
from werkzeug.routing import BaseConverter


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
    app.url_map.converters["objectid"] = ObjectIdConverter

    app.register_blueprint(groups, url_prefix="/api/v1/groups")

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
        response.response = json.dumps({"msg": str(e)})
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
db.connect()

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5050)
