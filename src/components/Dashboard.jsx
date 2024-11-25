import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        showToast("Error fetching tasks!", "error");
      }
    };
    fetchTasks();
  }, []);

  const toggleTaskForm = () => {
    setIsCreating(!isCreating);
    setTaskToEdit(null);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsCreating(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((task) => task.id !== taskId));
      showToast("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Error deleting task!", "error");
    }
  };

  const showToast = (message, type = "success") => {
    if (type === "error") {
      toast.error(message, { position: "top-right" });
    } else {
      toast.success(message, { position: "top-right" });
    }
  };

  const handleTaskCreated = () => {
    setIsCreating(false);
    setTaskToEdit(null);
    window.location.reload();  // Refresh page after task creation
  };

  const handleTaskUpdated = () => {
    setIsCreating(false);
    setTaskToEdit(null);
    window.location.reload();  // Refresh page after task update
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      {!isCreating && (
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">Task Dashboard</h1>
      )}

      <button
        onClick={toggleTaskForm}
        className="mb-4 py-2 px-4 bg-green-500 text-white rounded w-full sm:w-auto"
      >
        {isCreating ? "Cancel" : "Create New Task"}
      </button>

      {isCreating ? (
        <TaskForm
          showToast={showToast}
          taskToEdit={taskToEdit}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
        />
      ) : tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul className="w-full max-w-lg sm:max-w-2xl">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="mb-2 p-4 border rounded cursor-pointer flex justify-between items-center bg-white shadow"
            >
              <div>
                <h2 className="text-xl">{task.title}</h2>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
              </div>
              <div className="flex space-x-2">
                <FaEdit
                  onClick={() => handleEditTask(task)}
                  className="text-blue-500 cursor-pointer"
                />
                <FaTrash
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
