from flask import Blueprint, jsonify, request, g, session
from bson import ObjectId

from db.models import Group, Event
from db.db_client import db

groups = Blueprint(name="groups", import_name=__name__)


@groups.route("/", methods=["POST"])
def create_group():
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    body = request.get_json()
    body["owner_id"] = session["user_id"]
    requested_group = Group(**body)

    new_group = db.client["groups"].insert_one(requested_group.dict(by_alias=True))
    created_group = db.client["groups"].find_one({"_id": new_group.inserted_id})

    return jsonify(created_group)


@groups.route("/<id>", methods=["GET"])
def get_group(id: str):
    group = db.client["groups"].find_one({"_id": ObjectId(id)})
    return jsonify(group)


@groups.route("/<group_id>/events", methods=["POST"])
def create_event(group_id: str):
    groups = db.client["groups"]
    events = db.client["events"]

    body = request.get_json()
    requested_event = Event(**body)

    new_event = events.insert_one(requested_event.dict(by_alias=True))
    created_event = Event(**events.find_one({"_id": new_event.inserted_id}))

    result = groups.update_one(
        {"_id": ObjectId(group_id)}, {"$push": {"event_ids": created_event.id}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Group not updated"}), 400

    return jsonify(created_event.dict(by_alias=True))
