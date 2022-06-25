import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const TaskAdd = ({ onAddNewTask }) => {
  const [show, updateShow] = useState(false);
  const [inputs, setInputs] = useState({});

  var handleShow = () => {
    updateShow(true);
  };

  var handleClose = (e) => {
    updateShow(false);
  };

  var handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  var handleSubmit = (event) => {
    event.preventDefault();
    if ("title" in inputs && "assignee" in inputs) {
      onAddNewTask(inputs["title"], inputs["assignee"]);
      setInputs({});
      updateShow(false);
    } else {
      alert("input fields not touched");
    }
  };
  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Add new Task
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                placeholder="Title Goes Here"
                value={inputs.title || ""}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                name="assignee"
                type="text"
                placeholder="Enter Assignee"
                value={inputs.assignee || ""}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskAdd;
