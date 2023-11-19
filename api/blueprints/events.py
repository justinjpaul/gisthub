from flask import Blueprint, jsonify, request, g, session
from bson import ObjectId

from db.models import Event, Note, Gist
from db.db_client import db
from datetime import datetime, timedelta

events = Blueprint(name="events", import_name=__name__)
from cloud_storage import storage_client, credentials
import time
from openai import AzureOpenAI
import os
import threading
import um_gpt

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

    blob_name = f"notes/{session['user_id']}/{int(time.time())}.txt"
    local_filename = blob_name.replace("/", "-")

    f = request.files["file"]
    f.save(local_filename)

    bucket = storage_client.bucket("gisthub-files")

    blob = bucket.blob(blob_name)
    blob.upload_from_filename(local_filename)

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

    print("Starting gist generation thread...")
    gist_thread = threading.Thread(
        target=lambda: update_gist(
            ObjectId(event_id), requested_note.id, local_filename
        )
    )
    gist_thread.start()

    return jsonify(requested_note.dict(by_alias=True))


def update_gist(event_id: ObjectId, new_note_id: ObjectId, local_filename: str):
    # 1. pull current gist OR first note to merge
    event = Event(**db.client["events"].find_one({"_id": event_id}))

    merge_with_filename = ""
    if len(event.gists) == 0:  # no gist yet, check if there's enough notes to merge
        print("no gist yet... generating new")

        if len(event.notes) != 2:
            print(f"not enough notes to generate new gist {len(event.notes)}")
            return

        other_note = (
            event.notes[1] if event.notes[0].id == new_note_id else event.notes[0]
        )

        bucket = storage_client.bucket("gisthub-files")
        blob = bucket.blob(other_note.object_key)
        merge_with_filename = other_note.object_key.replace("/", "-")

    else:  # there's already a gist, so we merge with it
        print("merging with existing gist...")
        sorted_gists = sorted(event.gists, key=lambda x: x.timestamp, reverse=True)
        merge_with_filename = sorted_gists[0].object_key

    print(local_filename)
    print(merge_with_filename)

    # 2. send gpt prompt w/ log + new note

    blob.download_to_filename(merge_with_filename)
    note_text = um_gpt.read_file(local_filename)
    merge_text = um_gpt.read_file(merge_with_filename)

    messages = um_gpt.prepare_combine_query([note_text, merge_text])
    response = um_gpt.query_gpt(messages)
    x = response.choices[0]
    summary = um_gpt.read_gpt_multi_output(x)
    print(summary)

    # um_gpt.create_file("summary.md", summary)

    # 3. parse gist -> upload to gcs

    # 4. create new Gist object and push to document

    ...
