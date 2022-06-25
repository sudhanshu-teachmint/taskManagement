import React from "react";

const TaskItem = ({
  task,
  statusFilter,
  assigneeFilter,
  onUpdateTaskStatus,
}) => {
  if (statusFilter[task.status] && assigneeFilter[task.assignee]) {
    return (
      <tr>
        <td>{task.id}</td>
        <td>{task.title}</td>
        <td>{task.assignee}</td>
        <td>
          <select
            defaultValue={task.status}
            onChange={(e) => {
              console.log(e.target.value, task.title);
              onUpdateTaskStatus(task.id, e.target.value);
            }}
          >
            <option value="2">Completed</option>
            <option value="1">In Progress</option>
            <option value="0">Backlog</option>
          </select>
        </td>
      </tr>
    );
  } else {
    return;
  }
};

export default TaskItem;
