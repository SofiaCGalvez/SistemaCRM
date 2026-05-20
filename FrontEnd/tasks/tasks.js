document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "crmTasks";
  const API_URL = "http://127.0.0.1:3000/api/tasks";
  const openTaskModalButton = document.getElementById("openTaskModal");
  const taskModal = document.getElementById("taskModal");
  const closeTaskModalButton = document.getElementById("closeTaskModal");
  const cancelTaskModalButton = document.getElementById("cancelTaskModal");
  const taskForm = document.getElementById("taskForm");
  const tasksTableBody = document.getElementById("tasksTableBody");
  const tasksCount = document.getElementById("tasksCount");
  const taskSearch = document.getElementById("taskSearch");
  const taskStatusFilter = document.getElementById("taskStatusFilter");
  const taskPriorityFilter = document.getElementById("taskPriorityFilter");
  const taskModalTitle = document.getElementById("taskModalTitle");
  const taskModalDescription = document.getElementById("taskModalDescription");
  const saveTaskButton = document.getElementById("saveTaskButton");
  const taskSuccessModal = document.getElementById("taskSuccessModal");
  const closeTaskSuccessModalButton = document.getElementById("closeTaskSuccessModal");

  if (!openTaskModalButton || !taskModal || !taskForm || !tasksTableBody) {
    return;
  }

  let tasks = [];
  let editingTaskId = null;

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const loggedUser = getStoredUser();

  const canViewTask = (task) => {
    return loggedUser?.role !== "staff" || task.assignee === "staff";
  };

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200"
  };

  const priorityStyles = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-gray-50 text-gray-700 border-gray-200"
  };

  const escapeHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formatLabel = (value) => {
    if (value === "in-progress") {
      return "In Progress";
    }

    return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const requestTasks = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Ocurrio un error con las tareas");
    }

    return data;
  };

  const loadTasks = async () => {
    try {
      showTableMessage("Loading tasks...");
      tasks = await requestTasks(API_URL);
      tasks = tasks.filter(canViewTask);
      saveTasks();
    } catch (error) {
      try {
        const storedTasks = JSON.parse(localStorage.getItem(storageKey));
        tasks = Array.isArray(storedTasks) ? storedTasks.filter(canViewTask) : [];
      } catch (storageError) {
        tasks = [];
      }
    }
  };

  const saveTasks = () => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  };

  const showTableMessage = (message) => {
    tasksTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-6 text-center text-sm text-gray-400">${message}</td>
      </tr>
    `;
  };

  const updateTasksCount = (visibleTotal = tasks.length) => {
    if (tasksCount) {
      tasksCount.textContent = `Showing ${visibleTotal} of ${tasks.length} tasks`;
    }
  };

  const getFilteredTasks = () => {
    const searchTerm = taskSearch?.value.trim().toLowerCase() || "";
    const selectedStatus = taskStatusFilter?.value || "all";
    const selectedPriority = taskPriorityFilter?.value || "all";

    return tasks.filter((task) => {
      const matchesSearch = [
        task.title,
        task.assignee,
        task.relatedTo
      ].some((value) => String(value || "").toLowerCase().includes(searchTerm));
      const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
      const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const renderTasks = () => {
    const entries = getFilteredTasks();

    if (!entries.length) {
      showTableMessage(tasks.length ? "No tasks match your filters." : "No tasks registered yet.");
      updateTasksCount(0);
      return;
    }

    tasksTableBody.innerHTML = entries.map((task, index) => {
      const statusClass = statusStyles[task.status] || statusStyles.pending;
      const priorityClass = priorityStyles[task.priority] || priorityStyles.medium;

      return `
        <tr class="hover:bg-gray-50 transition-colors" data-id="${task.id}">
          <td class="px-4 py-3.5 text-gray-400 font-mono text-xs">${index + 1}</td>
          <td class="px-4 py-3.5 font-semibold text-gray-900">${escapeHtml(task.title)}</td>
          <td class="px-4 py-3.5 text-gray-600">${escapeHtml(task.assignee)}</td>
          <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">${escapeHtml(task.dueDate)}</td>
          <td class="px-4 py-3.5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}">${escapeHtml(formatLabel(task.status))}</span>
          </td>
          <td class="px-4 py-3.5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityClass}">${escapeHtml(formatLabel(task.priority))}</span>
          </td>
          <td class="px-4 py-3.5 text-gray-600">${escapeHtml(task.relatedTo)}</td>
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-1">
              <button title="Edit" type="button" class="edit-task-button w-8 h-8 flex items-center justify-center rounded-md text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer">
                <i class="ri-edit-line text-base"></i>
              </button>
              <button title="Delete" type="button" class="delete-task-button w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                <i class="ri-delete-bin-line text-base"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    updateTasksCount(entries.length);
  };

  const setModalMode = (mode) => {
    const isEditing = mode === "edit";

    if (taskModalTitle) {
      taskModalTitle.textContent = isEditing ? "Edit Task" : "Add Task";
    }

    if (taskModalDescription) {
      taskModalDescription.textContent = isEditing ? "Update the task information" : "Fill in the task information";
    }

    if (saveTaskButton) {
      saveTaskButton.textContent = isEditing ? "Save Changes" : "Add Task";
    }
  };

  const openTaskModal = (mode = "add") => {
    setModalMode(mode);
    taskModal.classList.remove("hidden");
    taskModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    document.getElementById("taskTitle")?.focus();
  };

  const closeTaskModal = () => {
    taskModal.classList.add("hidden");
    taskModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    taskForm.reset();
    editingTaskId = null;
    setModalMode("add");
  };

  const openTaskSuccessModal = () => {
    taskSuccessModal?.classList.remove("hidden");
    taskSuccessModal?.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  };

  const closeTaskSuccessModal = () => {
    taskSuccessModal?.classList.add("hidden");
    taskSuccessModal?.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  };

  const getFieldValue = (fieldName) => {
    const field = taskForm.elements[fieldName];
    return field ? field.value.trim() : "";
  };

  const setFieldValue = (fieldName, value) => {
    const field = taskForm.elements[fieldName];

    if (field) {
      field.value = value || "";
    }
  };

  const getTaskFromForm = () => ({
    title: getFieldValue("title"),
    assignee: getFieldValue("assignee"),
    dueDate: getFieldValue("dueDate"),
    status: getFieldValue("status") || "pending",
    priority: getFieldValue("priority") || "medium",
    relatedTo: getFieldValue("relatedTo")
  });

  const fillTaskForm = (task) => {
    setFieldValue("title", task.title);
    setFieldValue("assignee", task.assignee);
    setFieldValue("dueDate", task.dueDate);
    setFieldValue("status", task.status);
    setFieldValue("priority", task.priority);
    setFieldValue("relatedTo", task.relatedTo);
  };

  openTaskModalButton.addEventListener("click", () => openTaskModal("add"));
  closeTaskModalButton?.addEventListener("click", closeTaskModal);
  cancelTaskModalButton?.addEventListener("click", closeTaskModal);
  closeTaskSuccessModalButton?.addEventListener("click", closeTaskSuccessModal);
  taskSearch?.addEventListener("input", renderTasks);
  taskStatusFilter?.addEventListener("change", renderTasks);
  taskPriorityFilter?.addEventListener("change", renderTasks);

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!taskForm.checkValidity()) {
      taskForm.reportValidity();
      return;
    }

    const task = getTaskFromForm();
    const isCreatingTask = !editingTaskId;

    try {
      if (saveTaskButton) {
        saveTaskButton.disabled = true;
        saveTaskButton.textContent = editingTaskId ? "Saving..." : "Adding...";
      }

      if (editingTaskId) {
        const updatedTask = await requestTasks(`${API_URL}/${editingTaskId}`, {
          method: "PUT",
          body: JSON.stringify(task)
        });

        tasks = tasks
          .map((currentTask) =>
            String(currentTask.id) === String(editingTaskId) ? updatedTask : currentTask
          )
          .filter(canViewTask);
      } else {
        const createdTask = await requestTasks(API_URL, {
          method: "POST",
          body: JSON.stringify(task)
        });

        if (canViewTask(createdTask)) {
          tasks.push(createdTask);
        }
      }

      saveTasks();
      closeTaskModal();
      renderTasks();

      if (isCreatingTask && loggedUser?.role === "staff") {
        openTaskSuccessModal();
      }
    } catch (error) {
      alert(error.message);
    } finally {
      if (saveTaskButton) {
        saveTaskButton.disabled = false;
        setModalMode(editingTaskId ? "edit" : "add");
      }
    }
  });

  tasksTableBody.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-id]");
    const editButton = event.target.closest(".edit-task-button");
    const deleteButton = event.target.closest(".delete-task-button");

    if (!row) {
      return;
    }

    const task = tasks.find((currentTask) => String(currentTask.id) === row.dataset.id);

    if (editButton && task) {
      editingTaskId = task.id;
      fillTaskForm(task);
      openTaskModal("edit");
      return;
    }

    if (!deleteButton || !task) {
      return;
    }

    const shouldDelete = window.confirm(`Delete ${task.title}?`);

    if (!shouldDelete) {
      return;
    }

    requestTasks(`${API_URL}/${task.id}`, {
      method: "DELETE"
    })
      .then(() => {
        tasks = tasks.filter((currentTask) => String(currentTask.id) !== String(task.id));
        saveTasks();
        renderTasks();
      })
      .catch((error) => {
        alert(error.message);
      });
  });

  loadTasks().finally(renderTasks);
});
