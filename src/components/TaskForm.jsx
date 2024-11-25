import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskForm = ({ showToast, taskToEdit, onTaskCreated, onTaskUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found!");
      showToast("You must be logged in to create or update tasks!", "error");
    }
    return token;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Task created successfully!");
      onTaskCreated();
    } catch (error) {
      console.error("Error creating task:", error);
      showToast("Error creating task!", "error");
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskToEdit.id}`,
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Task updated successfully!");
      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("Error updating task!", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {taskToEdit ? "Edit Task" : "Create New Task"}
      </h1>
      <form onSubmit={taskToEdit ? handleUpdateTask : handleCreateTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full p-2 mb-4 border rounded"
          required
        ></textarea>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          {taskToEdit ? "Update Task" : "Create Task"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default TaskForm;
