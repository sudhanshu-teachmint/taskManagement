from ast import dump
import json
import re
from flask import Flask, request, Response
from pymongo import MongoClient
from bson.json_util import dumps
from auth import is_admin, is_logged_in, login
from bson.objectid import ObjectId
from taskApis import task_apis

app = Flask(__name__)
client = MongoClient('mongodb://root:example@localhost:27018')
db = client.sastaJira

# This Could go in a constants file
data_not_provided_msg = {"message": "data not provided"}


app.register_blueprint(task_apis, url_prefix="/tasks/")


@app.route('/login', methods=['GET', 'POST'])
def login_route():
    username = request.form.get('username')
    password = request.form.get('password')
    if password is None or username is None:
        return data_not_provided_msg, 400
    jwt_token = login(username, password)
    return {"jwt_token": jwt_token}


@app.route('/user')
@is_logged_in
def get_user():
    user_object_id = request.user["_id"]["$oid"]
    user = db.users.find_one(
        {"_id": ObjectId(user_object_id)})
    user_json = json.loads(dumps(user))
    return user_json, 200


# main driver function
if __name__ == '__main__':
    app.run(debug=False)
