import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api",
});

export default {
  getTasks() {
    return api.get("/tasks");
  },
  createTask(task) {
    return api.post("/tasks", task);
  },
  updateTask(id, task) {
    return api.put(`/tasks/${id}`, task);
  },
  deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  },
};
