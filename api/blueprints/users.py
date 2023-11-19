import json

from flask import Blueprint, jsonify, request, g, session
from pydantic import BaseModel, validator, Extra, ValidationError
from bson import ObjectId

from utils.utils import generic_api_requests
from db.models import User
from db.db_client import db

import bcrypt

users = Blueprint(name="users", import_name=__name__)


@users.route("/", methods=["POST"])
def create_user():
    requested_user = User(**request.get_json())
    requested_user.password = bcrypt.hashpw(
        requested_user.password.encode(), bcrypt.gensalt()
    ).decode()

    new_user = db.client["users"].insert_one(requested_user.dict(by_alias=True))
    created_user = db.client["users"].find_one({"_id": new_user.inserted_id})

    return jsonify(created_user)


@users.route("/<id>", methods=["GET"])
def get_user(id: str):
    user = db.client["users"].find_one({"_id": ObjectId(id)})
    del user["password"]
    return jsonify(user)


@users.route("/me", methods=["GET"])
def get_me():
    if not session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 401

    user = db.client["users"].find_one({"_id": ObjectId(session["user_id"])})
    del user["password"]
    return jsonify(user)
