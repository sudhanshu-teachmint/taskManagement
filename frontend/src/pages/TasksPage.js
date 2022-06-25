import React, { useState } from "react";
import TasksTable from "../components/TasksTable";

const TasksPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", assignee: "SS", status: 0 },
    { id: 2, title: "Task 2", assignee: "RR", status: 1 },
    { id: 3, title: "Task 3", assignee: "PD", status: 2 },
    { id: 4, title: "Task 4", assignee: "KJ", status: 0 },
    { id: 5, title: "Task 5", assignee: "RE", status: 1 },
    { id: 6, title: "Task 6", assignee: "AS", status: 2 },
  ]);

  var updateTasks = (newTasks) => {
    setTasks(newTasks);
    console.log("tasks updated", tasks, newTasks);
  };

  const addNewTask = (title, assignee) => {
    var newTasks = [...tasks];
    var id = tasks.length + 1;
    var task = {
      id: id,
      title: title,
      assignee: assignee,
      staus: 0,
    };
    newTasks.push(task);
    console.log(newTasks);
    setTasks(newTasks);
  };

  return (
    <>
      Here Goes Navbar
      <hr />
      <div style={{ padding: "0 50px" }}>
        <TasksTable
          tasks={tasks}
          onUpdateTasks={updateTasks}
          onAddNewTask={addNewTask}
        />
      </div>
    </>
  );
};

export default TasksPage;
