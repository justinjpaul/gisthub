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
    request_body = Group(**request.get_json())

    new_group = db.client["groups"].insert_one(request_body.dict())
    created_group = db.client["groups"].find_one({"_id": new_group.inserted_id})

    return jsonify(created_group)


@groups.route("/<id>", methods=["GET"])
def get_group(id: str):
    print(f"I am user {session.get('user_id')}")
    group = db.client["groups"].find_one({"_id": ObjectId(id)})
    return jsonify(group)
