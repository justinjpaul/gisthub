from flask import Blueprint, jsonify, request, g, session
from bson import ObjectId

from db.models import Event, Note
from db.db_client import db
from datetime import datetime, timedelta

events = Blueprint(name="events", import_name=__name__)
from cloud_storage import storage_client, credentials
import time

# Create event is in Groups


@events.route("/<id>", methods=["GET"])
def get_event(id: str):
    event = Event(**db.client["events"].find_one({"_id": ObjectId(id)}))
    bucket = storage_client.bucket("gisthub-files")

    for note in event.notes:
        blob = bucket.blob(note.object_key)
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=15),
            method="GET",
            service_account_email="api-account@gisthub.iam.gserviceaccount.com",
            access_token=credentials.token,
        )
        note.object_key = url

    return jsonify(event.dict(by_alias=True))


@events.route("/<event_id>/notes", methods=["POST"])
def upload_note(event_id: str):
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    f = request.files["file"]
    f.save("tmp.txt")

    bucket = storage_client.bucket("gisthub-files")
    blob_name = f"notes/{session['user_id']}/{int(time.time())}.txt"
    blob = bucket.blob(blob_name)
    blob.upload_from_filename("tmp.txt")

    events = db.client["events"]

    requested_note = Note(
        object_key=blob_name,
        timestamp=datetime.now(),
        user_id=session["user_id"],
        author_name=session["name"],
    )

    result = events.update_one(
        {"_id": ObjectId(event_id)},
        {"$push": {"notes": requested_note.dict(by_alias=True)}},
    )

    if result.modified_count == 0:
        return jsonify({"error": "Event not updated"}), 400

    return jsonify(requested_note.dict(by_alias=True))
