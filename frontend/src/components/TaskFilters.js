import React from "react";

const TaskFilters = ({
  onUpdateStatusFilter,
  assignees,
  allAssigneeFilter,
  onUpdateAssigneeFilter,
}) => {
  var handleStatusChange = (event) => {
    // console.log(event.target.value);
    var newStatusFilter = {
      0: false,
      1: false,
      2: false,
    };
    if (event.target.value === "all") {
      newStatusFilter[0] = true;
      newStatusFilter[1] = true;
      newStatusFilter[2] = true;
    } else {
      newStatusFilter[+event.target.value] = true;
    }

    onUpdateStatusFilter(newStatusFilter);
  };

  var handleAssigneeChange = (event) => {
    console.log(event.target.value);
    if (event.target.value === "all") {
      onUpdateAssigneeFilter(allAssigneeFilter);
    } else {
      var newFilter = {};
      for (var assignee in assignees) {
        newFilter[assignees[assignee]] = false;
      }
      newFilter[event.target.value] = true;
      onUpdateAssigneeFilter(newFilter);
    }
  };

  return (
    <div>
      Here are Filters:
      <br />
      Assignee:
      <select defaultValue="all" onChange={handleAssigneeChange}>
        <option value="all">All</option>
        {assignees.map((assignee) => (
          <option key={assignee} value={assignee}>
            {assignee}
          </option>
        ))}
      </select>
      <br />
      Status :{" "}
      <select defaultValue="all" onChange={handleStatusChange}>
        <option value="all">All</option>
        <option value="0">Backlog</option>
        <option value="1">In Progress</option>
        <option value="2">Completed</option>
      </select>
      <br />
    </div>
  );
};

export default TaskFilters;
