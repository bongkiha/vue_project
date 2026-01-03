<template>
  <div class="app" :class="{ 'dark-theme': isDarkTheme }">
    <div class="header">
      <h1>ZZB</h1>
      <div class="header-actions">
        <button class="theme-btn" @click="toggleTheme">
          <span class="theme-icon" :class="{ rotate: isDarkTheme }">
            {{ isDarkTheme ? "☀️" : "🌙" }}
          </span>
          <span class="theme-text">{{ isDarkTheme ? "亮色" : "暗色" }}</span>
        </button>
        <button class="add-btn" @click="showAddModal = true">+ 新建任务</button>
      </div>
    </div>

    <div class="board">
      <div class="column" v-for="column in columns" :key="column.key">
        <div class="column-header">
          <h2>{{ column.title }}</h2>
          <span class="count">{{ getTasksByStatus(column.key).length }}</span>
        </div>
        <div
          class="task-list"
          @dragover.prevent="onDragOver($event, column.key)"
          @dragleave="onDragLeave($event)"
          @drop="onDrop($event, column.key)"
          :class="{ 'drag-over': dragOverColumn === column.key }"
        >
          <div
            v-for="task in getTasksByStatus(column.key)"
            :key="task._id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
            @dragend="onDragEnd($event)"
            :class="{ dragging: draggedTask && draggedTask._id === task._id }"
          >
            <div class="task-title">{{ task.title }}</div>
            <div class="task-description">{{ task.description }}</div>
            <div class="task-actions">
              <button class="edit-btn" @click="editTask(task)">编辑</button>
              <button class="delete-btn" @click="deleteTask(task._id)">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="showAddModal || showEditModal">
      <div class="modal-content">
        <h2>{{ showEditModal ? "编辑任务" : "新建任务" }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>任务标题</label>
            <input
              v-model="formData.title"
              type="text"
              required
              placeholder="请输入任务标题"
            />
          </div>
          <div class="form-group">
            <label>任务描述</label>
            <textarea
              v-model="formData.description"
              placeholder="请输入任务描述"
            ></textarea>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="formData.status">
              <option value="todo">待办</option>
              <option value="inprogress">进行中</option>
              <option value="done">已完成</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeModal">
              取消
            </button>
            <button type="submit" class="submit-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./services/api";

const tasks = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const currentTask = ref(null);
const isDarkTheme = ref(false);
const formData = ref({
  title: "",
  description: "",
  status: "todo",
});

const columns = [
  { key: "todo", title: "待办" },
  { key: "inprogress", title: "进行中" },
  { key: "done", title: "已完成" },
];

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem("theme", isDarkTheme.value ? "dark" : "light");
};

const getSystemTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const loadTasks = async () => {
  try {
    const response = await api.getTasks();
    tasks.value = response.data;
  } catch (error) {
    console.error("加载任务失败:", error);
  }
};

const getTasksByStatus = (status) => {
  return tasks.value.filter((task) => task.status === status);
};

const handleSubmit = async () => {
  try {
    if (showEditModal.value) {
      await api.updateTask(currentTask.value._id, formData.value);
    } else {
      await api.createTask(formData.value);
    }
    closeModal();
    loadTasks();
  } catch (error) {
    console.error("保存任务失败:", error);
  }
};

const editTask = (task) => {
  currentTask.value = task;
  formData.value = {
    title: task.title,
    description: task.description,
    status: task.status,
  };
  showEditModal.value = true;
};

const deleteTask = async (id) => {
  if (confirm("确定要删除这个任务吗？")) {
    try {
      await api.deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error("删除任务失败:", error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  currentTask.value = null;
  formData.value = {
    title: "",
    description: "",
    status: "todo",
  };
};

let draggedTask = null;
const dragOverColumn = ref(null);

const onDragStart = (event, task) => {
  draggedTask = task;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", task._id);
  event.target.style.opacity = "0.5";
};

const onDragEnd = (event) => {
  event.target.style.opacity = "1";
  draggedTask = null;
  dragOverColumn.value = null;
};

const onDragOver = (event, columnKey) => {
  dragOverColumn.value = columnKey;
  event.dataTransfer.dropEffect = "move";
};

const onDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverColumn.value = null;
  }
};

const onDrop = async (event, status) => {
  event.preventDefault();
  if (draggedTask && draggedTask.status !== status) {
    try {
      await api.updateTask(draggedTask._id, { ...draggedTask, status });
      loadTasks();
    } catch (error) {
      console.error("更新任务状态失败:", error);
    }
  }
  draggedTask = null;
  dragOverColumn.value = null;
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDarkTheme.value = savedTheme === "dark";
  } else {
    isDarkTheme.value = getSystemTheme() === "dark";
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        isDarkTheme.value = e.matches;
      }
    });

  loadTasks();
});
</script>

<style scoped>
.app {
  padding: 20px;
  min-height: 100vh;
  background: #ffffff;
  transition: background 0.5s ease;
}

.dark-theme {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
}

.header h1 {
  color: #333;
  font-size: 2.5rem;
  text-shadow: none;
  transition: color 0.3s;
}

.dark-theme .header h1 {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.1);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.theme-btn {
  /* background: #000; */
  background: rgba(218, 216, 216, 0.2);
  color: rgb(24, 24, 24);
  border: 3px solid rgba(68, 68, 68, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-icon {
  font-size: 1.2rem;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
}

.theme-icon.rotate {
  transform: rotate(360deg);
}

.theme-text {
  transition: opacity 0.3s;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-btn:active {
  transform: translateY(0);
}

.add-btn {
  background: rgba(218, 216, 216, 0.2);
  border: 3px solid rgba(68, 68, 68, 0.3);
  /* background: white; */
  color: #667eea;
  /* border: none; */
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.column {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
  border: 1px solid #e0e0e0;
}
.column:hover {
  background-color: rgba(240, 240, 240, 0.8);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.dark-theme .column {
  background: rgba(30, 30, 50, 0.95);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.column-header {
  /* border: 2px solid #d41818; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
}

.column-header h2 {
  font-size: 1.3rem;
  color: #333;
}

.dark-theme .column-header h2 {
  color: #e0e0e0;
}

.count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.task-list {
  min-height: 200px;
  border-radius: 8px;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.task-list.drag-over {
  background-color: rgba(102, 126, 234, 0.1);
  box-shadow: inset 0 0 0 2px #667eea;
}

.dark-theme .task-list.drag-over {
  background-color: rgba(102, 126, 234, 0.2);
}

.task-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: move;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s,
    background-color 0.3s;
  border-left: 4px solid #667eea;
  border: 1px solid #e0e0e0;
  border-left-width: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.dark-theme .task-card {
  background: rgba(50, 50, 70, 0.9);
  border-left-color: #8b9dc3;
  border-color: #4a4a6a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.task-card.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-card.dragging:hover {
  transform: scale(0.95);
}

.task-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.dark-theme .task-title {
  color: #e0e0e0;
}

.task-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 12px;
  line-height: 1.5;
}

.dark-theme .task-description {
  color: #a0a0a0;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: opacity 0.2s, background-color 0.2s;
}

.edit-btn {
  background: #667eea;
  color: white;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.dark-theme .edit-btn {
  background: #8b9dc3;
}

.dark-theme .delete-btn {
  background: #e74c3c;
}

.edit-btn:hover,
.delete-btn:hover {
  opacity: 0.8;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
}

.dark-theme .modal-content {
  background: rgba(30, 30, 50, 0.98);
}

.modal-content h2 {
  margin-bottom: 24px;
  color: #333;
}

.dark-theme .modal-content h2 {
  color: #e0e0e0;
}

.form-group {
  border: 2px solid #d41818;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.dark-theme .form-group label {
  color: #e0e0e0;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, background-color 0.3s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dark-theme .form-group input,
.dark-theme .form-group textarea,
.dark-theme .form-group select {
  background: rgba(50, 50, 70, 0.8);
  border-color: #4a4a6a;
  color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.dark-theme .form-group input:focus,
.dark-theme .form-group textarea:focus,
.dark-theme .form-group select:focus {
  border-color: #8b9dc3;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s, background-color 0.2s;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}

.dark-theme .cancel-btn {
  background: #4a4a6a;
  color: #e0e0e0;
}

.submit-btn {
  background: #667eea;
  color: white;
}

.cancel-btn:hover,
.submit-btn:hover {
  opacity: 0.8;
}
</style>
