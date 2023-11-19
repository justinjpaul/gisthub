from flask import Blueprint, jsonify, request, g, session
from bson import ObjectId

from db.models import Event, Note
from db.db_client import db
from datetime import datetime

events = Blueprint(name="events", import_name=__name__)
from cloud_storage import storage_client
import time

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
    f.save("tmp.txt")

    bucket = storage_client.bucket("gisthub-files")
    blob_name = f"{session['user_id']}/{int(time.time())}.txt"
    blob = bucket.blob(blob_name)
    blob.upload_from_filename("tmp.txt")

    events = db.client["events"]

    requested_note = Note(
        object_key=blob_name, timestamp=datetime.now(), user_id=session["user_id"]
    )

    result = events.update_one(
        {"_id": ObjectId(event_id)},
        {"$push": {"event_ids": requested_note.dict(by_alias=True)}},
    )

    if result.modified_count == 0:
        return jsonify({"error": "Event not updated"}), 400

    return jsonify(requested_note.dict(by_alias=True))
