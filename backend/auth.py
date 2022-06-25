import json
from this import d
from flask import Response, request
import jwt
from database import db
import hashlib
from bson.json_util import dumps
from datetime import datetime, timedelta, timezone


jwt_signing_key = "SecretSigningKey"


def update_password(username, password):
    encrypted_pass = hashlib.sha256(password.encode())
    db.users.update_one(
        {"usernname": username}, {"$set": {"password": encrypted_pass.hexdigest()}})

    print(encrypted_pass.hexdigest())


def create_account(username, password, role):
    encrypted_pass = hashlib.sha256(password.encode())
    db.users.update_one({"username": username}, {
                        "$set": {"password": encrypted_pass.hexdigest(),
                                 "role": role}}, upsert=True)
    print(
        f"Account created for {username} with role of {role} with password {password}")


def initialize_db():
    accounts = ["sudhanshu", "pranav", "rishabh",
                "kartikya", "revanth", "ashwath"]

    for index, account in enumerate(accounts):
        role = "employee"
        if index < 3:
            role = "admin"
        create_account(account, account, role)


def login(username, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    db_user = db.users.find_one({"username": username})
    if (db_user["password"] == hashed_password):
        db_user_json = json.loads(dumps(db_user))
        dt = datetime.now(tz=timezone.utc) + timedelta(minutes=5)
        db_user_json["exp"] = dt
        token = jwt.encode(
            payload=db_user_json, key=jwt_signing_key, algorithm="HS256")
        return token
    else:
        return "invalid password"


def is_logged_in(func):
    def wrapper(*args, **kwargs):
        if not "Authorization" in request.headers:
            return {
                "message": "Authorization token not sent"
            }, 401

        jwt_token = request.headers["Authorization"]
        try:
            user = jwt.decode(jwt_token, jwt_signing_key, "HS256")
        except jwt.ExpiredSignatureError:
            return {
                "message": "Signature Expired"
            }, 401
        except Exception as e:
            print(e)
            return {
                "message": "Some Error Occured"
            }, 401
        request.user = user
        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper


def is_admin(func):
    def wrapper(*args, **kwargs):
        if not "Authorization" in request.headers:
            return {
                "message": "Authorization token not sent"
            }, 401

        jwt_token = request.headers["Authorization"]
        try:
            user = jwt.decode(jwt_token, jwt_signing_key, "HS256")
        except jwt.ExpiredSignatureError:
            return {
                "message": "Signature Expired"
            }, 401
        except Exception as e:
            print(e)
            return {
                "message": "Some Error Occured"
            }, 401

        if user["role"] != "admin":
            return {
                "message": "Admin access required"
            }, 403

        request.user = user
        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper
