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
    requested_group.user_ids.append(session["user_id"])

    new_group = db.client["groups"].insert_one(requested_group.dict(by_alias=True))
    created_group = db.client["groups"].find_one({"_id": new_group.inserted_id})

    return jsonify(created_group)


@groups.route("/<id>", methods=["GET"])
def get_group(id: str):
    group = db.client["groups"].find_one({"_id": ObjectId(id)})
    return jsonify(group)


# get all groups the LOGGED IN USER belongs to
@groups.route("/", methods=["GET"])
def get_groups():
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    groups = list(db.client["groups"].find({"user_ids": {"$in": [session["user_id"]]}}))
    return jsonify({"groups": groups})


@groups.route("/<group_id>/events", methods=["POST"])
def create_event(group_id: str):
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

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


@groups.route("/<group_id>/events", methods=["GET"])
def get_events(group_id: str):
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    group_id = ObjectId(group_id)
    groups = db.client["groups"]
    events = db.client["events"]

    try:
        group = Group(**groups.find_one({"_id": group_id}))
    except:
        return jsonify({"error": "group not found"}), 404

    group_events = events.find({"_id": {"$in": group.event_ids}})

    resp = []
    for raw_event in group_events:
        event = Event(**raw_event)
        did_contribute = False
        for note in event.notes:
            if note.user_id == session["user_id"]:
                did_contribute = True
                break
        serialized_event = event.dict(by_alias=True, exclude={"gists", "notes"})
        serialized_event["did_contribute"] = did_contribute
        resp.append(serialized_event)

    return jsonify({"events": resp})


@groups.route("/<group_id>/join", methods=["POST"])
def join_group(group_id: str):
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    curr_groups = list(
        db.client["groups"].find({"user_ids": {"$in": [session["user_id"]]}})
    )
    for g in curr_groups:
        if g["_id"] == ObjectId(group_id):
            return jsonify({"error": "User already in group"}), 400

    result = db.client["groups"].update_one(
        {"_id": ObjectId(group_id)}, {"$push": {"user_ids": session["user_id"]}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Unable to add user to group"}), 500

    return jsonify({}), 200
