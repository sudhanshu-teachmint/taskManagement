import React, { useState } from "react";
import styles from "./TasksTable.module.css";
import TaskItem from "./TaskItem";
import TaskFilters from "./TaskFilters";
import _ from "lodash";
import TaskAdd from "./TaskAdd";

const TasksTable = ({ tasks, onUpdateTasks, onAddNewTask }) => {
  const [statusFilter, updateStatusFilter] = useState({
    0: true,
    1: true,
    2: true,
  });

  const onUpdateStatusFilter = (newStatusFilter) => {
    updateStatusFilter(newStatusFilter);
  };

  var assignees = Object.keys(_.countBy(tasks, (task) => task.assignee));
  //   console.log(assignees);
  var allAssigneeFilter = {};
  for (var assignee in assignees) {
    allAssigneeFilter[assignees[assignee]] = true;
  }
  //   console.log(allAssigneeFilter);

  const [assigneeFilter, updateAssigneeFilter] = useState(allAssigneeFilter);

  const onUpdateAssigneeFilter = (newAssigneeFilter) => {
    updateAssigneeFilter(newAssigneeFilter);
    console.log("assignee filter updated");
  };

  const updateTaskStatus = (task_id, newStatus) => {
    var newTasks = [...tasks];
    var task = newTasks.find((task) => task.id === task_id);
    task.status = newStatus;
    onUpdateTasks(newTasks);
  };

  const addTask = (title, assignee) => {
    console.log(title, assignee);
    onAddNewTask(title, assignee);
  };

  return (
    <div>
      <TaskFilters
        onUpdateStatusFilter={onUpdateStatusFilter}
        assignees={assignees}
        allAssigneeFilter={allAssigneeFilter}
        onUpdateAssigneeFilter={onUpdateAssigneeFilter}
      />
      <hr />
      <table className={styles.tasks}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Assignee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              statusFilter={statusFilter}
              assigneeFilter={assigneeFilter}
              onUpdateTaskStatus={updateTaskStatus}
            />
          ))}
        </tbody>
      </table>
      <br />
      <TaskAdd onAddNewTask={addTask} />
    </div>
  );
};

export default TasksTable;
