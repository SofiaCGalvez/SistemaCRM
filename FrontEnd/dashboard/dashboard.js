document.addEventListener("DOMContentLoaded", () => {
  const tasksStorageKey = "crmTasks";
  const TASKS_API_URL = `${window.API_BASE_URL}/api/tasks`;
  const companiesCount = document.getElementById("dashboardCompaniesCount");
  const activeMembersCount = document.getElementById("dashboardActiveMembersCount");
  const upcomingEventsCount = document.getElementById("dashboardUpcomingEventsCount");
  const growthChart = document.getElementById("membershipGrowthChart");
  const growthSubtitle = document.getElementById("membershipGrowthSubtitle");
  const pendingTasksList = document.getElementById("pendingTasksList");
  const pendingTasksCount = document.getElementById("pendingTasksCount");
  const taskCompletedModal = document.getElementById("taskCompletedModal");
  const closeTaskCompletedModalButton = document.getElementById("closeTaskCompletedModal");

  if (!companiesCount && !activeMembersCount && !upcomingEventsCount && !growthChart && !pendingTasksList) {
    return;
  }

  let dashboardTasks = [];

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const loggedUser = getStoredUser();

  const canViewTask = (task) => {
    if (loggedUser?.role === "admin") {
      return task.assignee === "admin";
    }

    return loggedUser?.role === "staff" && task.assignee === "staff";
  };

  const priorityStyles = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-gray-50 text-gray-700 border-gray-200"
  };

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200"
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const requestData = async (url, options = {}, errorMessage = "There was an error loading the dashboard") => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    return data;
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

  const saveTasks = () => {
    localStorage.setItem(tasksStorageKey, JSON.stringify(dashboardTasks));
  };

  const openTaskCompletedModal = () => {
    taskCompletedModal?.classList.remove("hidden");
    taskCompletedModal?.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  };

  const closeTaskCompletedModal = () => {
    taskCompletedModal?.classList.add("hidden");
    taskCompletedModal?.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  };

  const getPendingTasks = () => {
    return dashboardTasks
      .filter(canViewTask)
      .filter((task) => task.status !== "completed")
      .sort((firstTask, secondTask) => {
        return String(firstTask.dueDate || "").localeCompare(String(secondTask.dueDate || ""));
      });
  };

  const showPendingTasksMessage = (message) => {
    if (pendingTasksList) {
      pendingTasksList.innerHTML = `<div class="px-5 py-6 text-center text-sm text-gray-400">${message}</div>`;
    }
  };

  const renderPendingTasks = () => {
    if (!pendingTasksList) {
      return;
    }

    const pendingTasks = getPendingTasks();

    if (pendingTasksCount) {
      pendingTasksCount.textContent = String(pendingTasks.length);
    }

    if (!pendingTasks.length) {
      showPendingTasksMessage("No pending tasks.");
      return;
    }

    pendingTasksList.innerHTML = pendingTasks.map((task) => {
      const priorityClass = priorityStyles[task.priority] || priorityStyles.medium;
      const statusClass = statusStyles[task.status] || statusStyles.pending;
      const relatedTo = task.relatedTo ? `
        <p class="text-[11px] text-gray-400 mt-1 truncate">${escapeHtml(task.relatedTo)}</p>
      ` : "";

      return `
        <div class="flex items-start gap-3 px-5 py-3.5 group hover:bg-gray-50/60 transition-colors" data-id="${escapeHtml(task.id)}">
          <span class="w-4 h-4 flex items-center justify-center mt-0.5 text-gray-300 group-hover:text-brand-400 transition-colors flex-shrink-0">
            <i class="ri-checkbox-blank-circle-line text-xs"></i>
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-800 leading-snug">${escapeHtml(task.title)}</p>
            ${relatedTo}
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <span class="text-[11px] text-gray-400">Due ${escapeHtml(task.dueDate)}</span>
              <span class="text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityClass}">${escapeHtml(formatLabel(task.priority))}</span>
              <span class="text-[10px] font-medium px-1.5 py-0.5 rounded border ${statusClass}">${escapeHtml(formatLabel(task.status || "pending"))}</span>
            </div>
          </div>
          <button type="button" title="Mark done" class="complete-dashboard-task-button w-8 h-8 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors flex-shrink-0 cursor-pointer">
            <i class="ri-check-line text-base"></i>
          </button>
        </div>
      `;
    }).join("");
  };

  const loadDashboardTasks = async () => {
    if (!pendingTasksList) {
      return;
    }

    try {
      showPendingTasksMessage("Loading tasks...");
      dashboardTasks = await requestData(TASKS_API_URL, {}, "There was an error loading the tasks");
      dashboardTasks = dashboardTasks.filter(canViewTask);
      saveTasks();
    } catch (error) {
      try {
        const storedTasks = JSON.parse(localStorage.getItem(tasksStorageKey));
        dashboardTasks = Array.isArray(storedTasks) ? storedTasks.filter(canViewTask) : [];
      } catch (storageError) {
        dashboardTasks = [];
      }
    } finally {
      renderPendingTasks();
    }
  };

  const completeTask = async (task) => {
    const updatedTask = {
      title: task.title,
      assignee: task.assignee,
      dueDate: task.dueDate,
      status: "completed",
      priority: task.priority,
      relatedTo: task.relatedTo
    };

    const savedTask = await requestData(
      `${TASKS_API_URL}/${task.id}`,
      {
        method: "PUT",
        body: JSON.stringify(updatedTask)
      },
      "There was an error completing the task"
    );

    dashboardTasks = dashboardTasks
      .map((currentTask) => String(currentTask.id) === String(task.id) ? savedTask : currentTask)
      .filter(canViewTask);
    saveTasks();
    renderPendingTasks();
    openTaskCompletedModal();
  };

  const setCounter = (element, value) => {
    if (element) {
      element.textContent = String(value);
    }
  };

  const getChartYear = (memberships) => {
    const currentYear = new Date().getFullYear();
    const years = memberships
      .map((membership) => Number(membership.year))
      .filter((year) => Number.isFinite(year));

    return years.includes(currentYear) ? currentYear : Math.max(currentYear, ...years);
  };

  const renderMembershipGrowthChart = (memberships) => {
    if (!growthChart) {
      return;
    }

    const chartYear = getChartYear(memberships);
    const monthlyCounts = MONTHS.map((month) => {
      return memberships.filter((membership) => {
        return Number(membership.year) === chartYear && membership.month === month;
      }).length;
    });
    const cumulativeCounts = monthlyCounts.reduce((totals, count, index) => {
      totals.push((totals[index - 1] || 0) + count);
      return totals;
    }, []);
    const maxValue = Math.max(1, ...monthlyCounts, ...cumulativeCounts);
    const width = 760;
    const height = 320;
    const padding = { top: 22, right: 28, bottom: 48, left: 42 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const step = plotWidth / (MONTHS.length - 1);
    const barWidth = Math.min(28, plotWidth / MONTHS.length * 0.44);
    const yFor = (value) => padding.top + plotHeight - (value / maxValue) * plotHeight;
    const xFor = (index) => padding.left + index * step;
    const linePoints = cumulativeCounts.map((value, index) => `${xFor(index)},${yFor(value)}`).join(" ");
    const yTicks = [0, Math.ceil(maxValue / 2), maxValue];

    if (growthSubtitle) {
      growthSubtitle.textContent = `By month - ${chartYear}`;
    }

    growthChart.innerHTML = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="white"></rect>
      ${yTicks.map((tick) => `
        <line x1="${padding.left}" y1="${yFor(tick)}" x2="${width - padding.right}" y2="${yFor(tick)}" stroke="#e5e7eb" stroke-width="1"></line>
        <text x="${padding.left - 12}" y="${yFor(tick) + 4}" text-anchor="end" font-size="11" fill="#9ca3af">${tick}</text>
      `).join("")}
      ${monthlyCounts.map((count, index) => {
        const x = xFor(index) - barWidth / 2;
        const y = yFor(count);
        const barHeight = padding.top + plotHeight - y;

        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="#10b981" opacity="0.22"></rect>
        `;
      }).join("")}
      <polyline points="${linePoints}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${cumulativeCounts.map((count, index) => `
        <circle cx="${xFor(index)}" cy="${yFor(count)}" r="4" fill="#2563eb"></circle>
        <text x="${xFor(index)}" y="${yFor(count) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="#374151">${count}</text>
      `).join("")}
      ${MONTH_LABELS.map((label, index) => `
        <text x="${xFor(index)}" y="${height - 20}" text-anchor="middle" font-size="11" fill="#6b7280">${label}</text>
      `).join("")}
      <line x1="${padding.left}" y1="${padding.top + plotHeight}" x2="${width - padding.right}" y2="${padding.top + plotHeight}" stroke="#d1d5db" stroke-width="1"></line>
    `;
  };

  const loadDashboardCounts = async () => {
    try {
      const [directoryEntries, memberships, events] = await Promise.all([
        requestData(`${window.API_BASE_URL}/api/directory`),
        requestData(`${window.API_BASE_URL}/api/memberships`),
        requestData(`${window.API_BASE_URL}/api/events`)
      ]);
      const upcomingEvents = events.filter((eventItem) => eventItem.status === "upcoming").length;

      setCounter(companiesCount, directoryEntries.length);
      setCounter(activeMembersCount, memberships.length);
      setCounter(upcomingEventsCount, upcomingEvents);
      renderMembershipGrowthChart(memberships);
    } catch (error) {
      console.error(error);
      setCounter(companiesCount, "0");
      setCounter(activeMembersCount, "0");
      setCounter(upcomingEventsCount, "0");
      renderMembershipGrowthChart([]);
    }
  };

  pendingTasksList?.addEventListener("click", (event) => {
    const completeButton = event.target.closest(".complete-dashboard-task-button");
    const taskItem = event.target.closest("[data-id]");

    if (!completeButton || !taskItem) {
      return;
    }

    const task = dashboardTasks.find((currentTask) => String(currentTask.id) === taskItem.dataset.id);

    if (!task) {
      return;
    }

    completeButton.disabled = true;
    completeButton.innerHTML = `<i class="ri-loader-4-line text-base"></i>`;

    completeTask(task).catch((error) => {
      completeButton.disabled = false;
      completeButton.innerHTML = `<i class="ri-check-line text-base"></i>`;
      alert(error.message);
    });
  });

  closeTaskCompletedModalButton?.addEventListener("click", closeTaskCompletedModal);

  loadDashboardCounts();
  loadDashboardTasks();
});
