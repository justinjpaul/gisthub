import config
import json

from flask import Blueprint, jsonify, request, g
from pydantic import BaseModel, validator, Extra, ValidationError

from utils.utils import generic_api_requests
from db.models import Group
from db.db_client import db

groups = Blueprint(name="groups", import_name=__name__)


@groups.route("/", methods=["POST"], strict_slashes=False)
def create_group():
    request_body = json.loads(Group(**request.get_json()).json())

    new_group = db.client["groups"].insert_one(request_body)
    created_group = db.client["groups"].find_one({"_id": new_group.inserted_id})

    return jsonify(created_group)
