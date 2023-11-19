import config
import json

from flask import Blueprint, jsonify, request, g, session
from pydantic import BaseModel, validator, Extra, ValidationError
from bson import ObjectId

from utils.utils import generic_api_requests
from db.models import Group
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
    print(f"I am user {session.get('user_id')}")
    group = db.client["groups"].find_one({"_id": ObjectId(id)})
    return jsonify(group)
