from flask import Blueprint, jsonify, request, g, session
from bson import ObjectId

from db.models import Event, Note
from db.db_client import db
from datetime import datetime

events = Blueprint(name="events", import_name=__name__)

# Create event is in Groups


@events.route("/<id>", methods=["GET"])
def get_group(id: str):
    group = db.client["events"].find_one({"_id": ObjectId(id)})
    return jsonify(group)


@events.route("/<event_id>/notes", methods=["POST"])
def upload_note(event_id: str):
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    f = request.files["file"]
    f.save(f.filename)

    events = db.client["events"]

    requested_note = Note(
        object_key=f.filename, timestamp=datetime.now(), user_id=session["user_id"]
    )

    result = events.update_one(
        {"_id": ObjectId(event_id)},
        {"$push": {"event_ids": requested_note.dict(by_alias=True)}},
    )

    if result.modified_count == 0:
        return jsonify({"error": "Event not updated"}), 400

    return jsonify(requested_note.dict(by_alias=True))
