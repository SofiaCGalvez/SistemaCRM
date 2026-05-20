document.addEventListener("DOMContentLoaded", () => {
  const calendarYear = 2026;
  const storageKey = "crmEvents2026";
  const API_URL = "http://127.0.0.1:3000/api/events";

  const monthTitle = document.getElementById("calendarMonthTitle");
  const calendarGrid = document.getElementById("calendarGrid");
  const prevMonthButton = document.getElementById("prevMonthButton");
  const nextMonthButton = document.getElementById("nextMonthButton");
  const openEventModalButton = document.getElementById("openEventModal");
  const eventModal = document.getElementById("eventModal");
  const closeEventModalButton = document.getElementById("closeEventModal");
  const cancelEventModalButton = document.getElementById("cancelEventModal");
  const eventForm = document.getElementById("eventForm");
  const eventMultiDayToggle = document.getElementById("eventMultiDayToggle");
  const eventMultiDayHandle = document.getElementById("eventMultiDayHandle");
  const eventDatesGrid = document.getElementById("eventDatesGrid");
  const eventEndDateWrapper = document.getElementById("eventEndDateWrapper");
  const eventDateInput = document.getElementById("eventDate");
  const eventEndDateInput = document.getElementById("eventEndDate");
  const eventDescription = document.getElementById("eventDescription");
  const eventDescriptionCount = document.getElementById("eventDescriptionCount");
  const saveEventButton = document.getElementById("saveEventButton");
  const eventsTotalCount = document.getElementById("eventsTotalCount");
  const eventsUpcomingCount = document.getElementById("eventsUpcomingCount");
  const eventsCompletedCount = document.getElementById("eventsCompletedCount");
  const eventsTopTypes = document.getElementById("eventsTopTypes");

  if (!monthTitle || !calendarGrid || !prevMonthButton || !nextMonthButton) {
    return;
  }

  const monthNames = [
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

  const typeStyles = {
    conference: {
      label: "Conference",
      pill: "bg-rose-100 text-rose-700"
    },
    workshop: {
      label: "Workshop",
      pill: "bg-amber-100 text-amber-700"
    },
    networking: {
      label: "Networking",
      pill: "bg-teal-100 text-teal-700"
    },
    summit: {
      label: "Summit",
      pill: "bg-indigo-100 text-indigo-700"
    },
    roundtable: {
      label: "Roundtable",
      pill: "bg-purple-100 text-purple-700"
    },
    expo: {
      label: "Expo",
      pill: "bg-green-100 text-green-700"
    },
    other: {
      label: "Other",
      pill: "bg-gray-100 text-gray-700"
    }
  };

  const defaultEvents = [
    {
      id: "sample-networking-2026-05-02",
      title: "Spring Networking Mixer",
      type: "networking",
      status: "upcoming",
      date: "2026-05-02",
      endDate: "",
      location: "Main hall",
      description: ""
    }
  ];

  const today = new Date();
  const initialMonth = today.getFullYear() === calendarYear ? today.getMonth() : 0;
  let currentMonth = initialMonth;
  let events = [];
  let isMultiDay = false;

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getTodayKey = () => {
    if (today.getFullYear() !== calendarYear) {
      return `${calendarYear}-01-01`;
    }

    return formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const requestEvents = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Ocurrio un error al guardar el evento");
    }

    return data;
  };

  const loadEvents = async () => {
    try {
      events = await requestEvents(`${API_URL}?year=${calendarYear}`);
      localStorage.setItem(storageKey, JSON.stringify(events));
    } catch (error) {
      try {
        const storedEvents = JSON.parse(localStorage.getItem(storageKey));
        events = Array.isArray(storedEvents) ? storedEvents : [...defaultEvents];
      } catch (storageError) {
        events = [...defaultEvents];
      }
    }
  };

  const saveEventsLocally = () => {
    localStorage.setItem(storageKey, JSON.stringify(events));
  };

  const getEventTypeStyle = (eventType) => {
    return typeStyles[eventType] || typeStyles.other;
  };

  const getUniqueEvents = () => {
    const uniqueEvents = new Map();

    events.forEach((eventItem) => {
      const eventKey = eventItem.id || `${eventItem.title}-${eventItem.type}-${eventItem.date}`;
      uniqueEvents.set(eventKey, eventItem);
    });

    return Array.from(uniqueEvents.values());
  };

  const getEventsForDate = (year, month, day) => {
    const dateKey = formatDateKey(year, month, day);

    return events.filter((eventItem) => {
      const endDate = eventItem.endDate || eventItem.date;
      return dateKey >= eventItem.date && dateKey <= endDate;
    });
  };

  const createEmptyDay = () => {
    const emptyDay = document.createElement("div");
    emptyDay.className = "min-h-[90px] p-1.5 border-r border-b border-gray-50 bg-gray-50/40";
    return emptyDay;
  };

  const createEventButton = (eventItem) => {
    const eventButton = document.createElement("button");
    const eventStyle = getEventTypeStyle(eventItem.type);

    eventButton.type = "button";
    eventButton.className = `w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer transition-opacity hover:opacity-80 ${eventStyle.pill}`;
    eventButton.title = eventItem.location ? `${eventItem.title} - ${eventItem.location}` : eventItem.title;
    eventButton.textContent = eventItem.title;
    return eventButton;
  };

  const createDay = (day) => {
    const dayCell = document.createElement("div");
    dayCell.className = "min-h-[90px] p-1.5 border-r border-b border-gray-50 bg-white";

    const dayNumber = document.createElement("div");
    const isToday =
      today.getFullYear() === calendarYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day;

    dayNumber.className = isToday
      ? "w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium mb-1 bg-brand-600 text-white"
      : "w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium mb-1 text-gray-700";
    dayNumber.textContent = day;

    const eventList = document.createElement("div");
    eventList.className = "space-y-0.5";

    getEventsForDate(calendarYear, currentMonth, day).forEach((eventItem) => {
      eventList.appendChild(createEventButton(eventItem));
    });

    dayCell.append(dayNumber, eventList);
    return dayCell;
  };

  const setNavigationState = () => {
    const isFirstMonth = currentMonth === 0;
    const isLastMonth = currentMonth === 11;

    prevMonthButton.disabled = isFirstMonth;
    nextMonthButton.disabled = isLastMonth;
    prevMonthButton.classList.toggle("opacity-40", isFirstMonth);
    nextMonthButton.classList.toggle("opacity-40", isLastMonth);
    prevMonthButton.classList.toggle("cursor-not-allowed", isFirstMonth);
    nextMonthButton.classList.toggle("cursor-not-allowed", isLastMonth);
  };

  const updateStats = () => {
    const uniqueEvents = getUniqueEvents();
    const typeCounts = uniqueEvents.reduce((counts, eventItem) => {
      counts[eventItem.type] = (counts[eventItem.type] || 0) + 1;
      return counts;
    }, {});

    if (eventsTotalCount) {
      eventsTotalCount.textContent = uniqueEvents.length;
    }

    if (eventsUpcomingCount) {
      eventsUpcomingCount.textContent = uniqueEvents.filter((eventItem) => eventItem.status === "upcoming").length;
    }

    if (eventsCompletedCount) {
      eventsCompletedCount.textContent = uniqueEvents.filter((eventItem) => eventItem.status === "completed").length;
    }

    if (eventsTopTypes) {
      eventsTopTypes.textContent = "";

      const topTypes = Object.entries(typeCounts)
        .sort((firstType, secondType) => secondType[1] - firstType[1])
        .slice(0, 3);

      if (!topTypes.length) {
        const emptyType = document.createElement("span");
        emptyType.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500";
        emptyType.textContent = "No events";
        eventsTopTypes.appendChild(emptyType);
        return;
      }

      topTypes.forEach(([type, total]) => {
        const eventStyle = getEventTypeStyle(type);
        const typeBadge = document.createElement("span");
        typeBadge.className = `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${eventStyle.pill}`;
        typeBadge.textContent = `${total} ${eventStyle.label.toLowerCase()}`;
        eventsTopTypes.appendChild(typeBadge);
      });
    }
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(calendarYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, currentMonth + 1, 0).getDate();
    const totalCalendarCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    monthTitle.textContent = `${monthNames[currentMonth]} ${calendarYear}`;
    calendarGrid.innerHTML = "";

    for (let cellIndex = 0; cellIndex < totalCalendarCells; cellIndex += 1) {
      const day = cellIndex - firstDayOfMonth + 1;

      if (day < 1 || day > daysInMonth) {
        calendarGrid.appendChild(createEmptyDay());
      } else {
        calendarGrid.appendChild(createDay(day));
      }
    }

    setNavigationState();
    updateStats();
  };

  const setMultiDayState = (nextState) => {
    isMultiDay = nextState;
    eventMultiDayToggle?.setAttribute("aria-pressed", String(isMultiDay));
    eventMultiDayToggle?.classList.toggle("bg-brand-600", isMultiDay);
    eventMultiDayToggle?.classList.toggle("bg-gray-200", !isMultiDay);
    eventMultiDayHandle?.classList.toggle("translate-x-5", isMultiDay);
    eventMultiDayHandle?.classList.toggle("translate-x-0.5", !isMultiDay);
    eventEndDateWrapper?.classList.toggle("hidden", !isMultiDay);
    eventDatesGrid?.classList.toggle("grid-cols-2", isMultiDay);

    if (eventEndDateInput) {
      eventEndDateInput.required = isMultiDay;

      if (!isMultiDay) {
        eventEndDateInput.value = "";
      }
    }
  };

  const openEventModal = () => {
    eventModal?.classList.remove("hidden");
    eventModal?.classList.add("flex");
    document.body.classList.add("overflow-hidden");

    if (eventDateInput && !eventDateInput.value) {
      eventDateInput.value = getTodayKey();
      eventEndDateInput?.setAttribute("min", eventDateInput.value);
    }

    document.getElementById("eventTitle")?.focus();
  };

  const closeEventModal = () => {
    eventModal?.classList.add("hidden");
    eventModal?.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    eventForm?.reset();
    setMultiDayState(false);

    if (eventDateInput) {
      eventDateInput.value = getTodayKey();
    }

    if (eventDescriptionCount) {
      eventDescriptionCount.textContent = "0/500";
    }
  };

  const getFieldValue = (fieldName) => {
    const field = eventForm?.elements[fieldName];
    return field ? field.value.trim() : "";
  };

  const createEventFromForm = () => {
    const date = getFieldValue("date");
    const endDate = isMultiDay ? getFieldValue("endDate") : "";

    return {
      id: `event-${Date.now()}`,
      title: getFieldValue("title"),
      type: getFieldValue("type") || "other",
      status: getFieldValue("status") || "upcoming",
      date,
      endDate,
      location: getFieldValue("location"),
      description: getFieldValue("description")
    };
  };

  prevMonthButton.addEventListener("click", () => {
    if (currentMonth > 0) {
      currentMonth -= 1;
      renderCalendar();
    }
  });

  nextMonthButton.addEventListener("click", () => {
    if (currentMonth < 11) {
      currentMonth += 1;
      renderCalendar();
    }
  });

  openEventModalButton?.addEventListener("click", openEventModal);
  closeEventModalButton?.addEventListener("click", closeEventModal);
  cancelEventModalButton?.addEventListener("click", closeEventModal);

  eventMultiDayToggle?.addEventListener("click", () => {
    setMultiDayState(!isMultiDay);
  });

  eventDateInput?.addEventListener("change", () => {
    if (!eventEndDateInput || !eventDateInput.value) {
      return;
    }

    eventEndDateInput.min = eventDateInput.value;

    if (eventEndDateInput.value && eventEndDateInput.value < eventDateInput.value) {
      eventEndDateInput.value = eventDateInput.value;
    }
  });

  eventDescription?.addEventListener("input", () => {
    if (eventDescriptionCount) {
      eventDescriptionCount.textContent = `${eventDescription.value.length}/500`;
    }
  });

  eventForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!eventForm.checkValidity()) {
      eventForm.reportValidity();
      return;
    }

    const newEvent = createEventFromForm();

    if (newEvent.endDate && newEvent.endDate < newEvent.date) {
      alert("End date cannot be before the start date.");
      return;
    }

    try {
      if (saveEventButton) {
        saveEventButton.disabled = true;
        saveEventButton.textContent = "Creating...";
      }

      const savedEvent = await requestEvents(API_URL, {
        method: "POST",
        body: JSON.stringify(newEvent)
      });

      events.push(savedEvent);
      saveEventsLocally();
      currentMonth = Number(savedEvent.date.slice(5, 7)) - 1;
      closeEventModal();
      renderCalendar();
    } catch (error) {
      alert(error.message);
    } finally {
      if (saveEventButton) {
        saveEventButton.disabled = false;
        saveEventButton.textContent = "Create Event";
      }
    }
  });

  if (eventDateInput) {
    eventDateInput.value = getTodayKey();
  }

  loadEvents().finally(renderCalendar);
});
