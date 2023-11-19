from flask import Blueprint, jsonify, request, g, session
from bson import ObjectId

from db.models import Group, Event
from db.db_client import db

events = Blueprint(name="events", import_name=__name__)

# Create event is in Groups


@events.route("/<id>", methods=["GET"])
def get_group(id: str):
    group = db.client["events"].find_one({"_id": ObjectId(id)})
    return jsonify(group)
