from turtle import title
from flask import Blueprint, request, Response
from auth import is_admin, is_logged_in
from database import db
import json
from bson.json_util import dumps
from bson.objectid import ObjectId

task_apis = Blueprint('task_api', __name__)
data_not_provided_msg = {"message": "data not provided"}


@task_apis.route('/all')
@is_logged_in
def get_all_tasks():
    tasks_cursor = db.tasks.find({})
    tasks = json.loads(dumps(list(tasks_cursor)))
    return {"data": tasks}


@task_apis.route('/update-status')
@is_logged_in
def update_my_task():
    user_id = request.user["_id"]["$oid"]
    task_id = request.form.get("task_id")
    task_status = request.form.get("task_status")

    if task_id is None or task_status is None:
        return data_not_provided_msg, 400

    # Checking for admin can be done here or can be a seperate function but doing it here so update status is one function

    task_filter = {
        "_id": ObjectId(task_id)
    }

    if not request.user["role"] == "admin":
        task_filter["assignee_id"] = ObjectId(user_id)

    updated = db.tasks.update_one(task_filter,
                                  {
                                      "$set": {"status": task_status}
                                  })
    if updated.matched_count:
        return Response("Updated", 200)
    else:
        return Response("You Might not have access to updating or this task might not exist", 400)


@task_apis.route("/update-assignee")
@is_admin
def update_any_task_assignee():
    task_id = request.form.get('task_id')
    assginee_id = request.form.get('assignee_id')
    if task_id is None or assginee_id is None:
        return data_not_provided_msg, 400

    updated = db.tasks.update_one({"_id": ObjectId(task_id)},
                                  {"$set": {
                                   "assignee_id": ObjectId((assginee_id))
                                   }})
    if updated.matched_count:
        return Response("Updated", 200)
    else:
        return Response("You Might not have access to updating or this task might not exist", 400)


@task_apis.route('/create-new-task')
@is_admin
def create_new_task():
    title = request.form.get("title")
    assginee_id = request.form.get('assignee_id')
    if title is None or assginee_id is None:
        return data_not_provided_msg, 400

    task = db.tasks.insert_one(
        {"title": title, "assignee_id": ObjectId(assginee_id), "status": "BACKLOG"})

    print(task)

    return {"new_task_id": str(task.inserted_id)}


@task_apis.route('/delete-task')
@is_admin
def delete_task():
    task_id = request.form.get('task_id')
    if title is None:
        return data_not_provided_msg, 400

    task = db.tasks.delete_one({
        "_id": ObjectId(task_id)
    })

    if task.deleted_count:
        return {
            "message": "Task Deleted"
        }, 200
    else:
        return{
            "message": "Task not found"
        }, 410
