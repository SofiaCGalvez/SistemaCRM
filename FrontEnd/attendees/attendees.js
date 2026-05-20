document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "crmAttendees";
  const API_URL = `${window.API_BASE_URL}/api/attendees`;
  const openAttendeeModalButton = document.getElementById("openAttendeeModal");
  const attendeeModal = document.getElementById("attendeeModal");
  const closeAttendeeModalButton = document.getElementById("closeAttendeeModal");
  const cancelAttendeeModalButton = document.getElementById("cancelAttendeeModal");
  const attendeeForm = document.getElementById("attendeeForm");
  const attendeesTableBody = document.getElementById("attendeesTableBody");
  const attendeesCount = document.getElementById("attendeesCount");
  const attendeeSearch = document.getElementById("attendeeSearch");
  const attendeeEventFilter = document.getElementById("attendeeEventFilter");
  const attendeeStatusFilter = document.getElementById("attendeeStatusFilter");
  const attendeeModalTitle = document.getElementById("attendeeModalTitle");
  const attendeeModalDescription = document.getElementById("attendeeModalDescription");
  const saveAttendeeButton = document.getElementById("saveAttendeeButton");

  if (!openAttendeeModalButton || !attendeeModal || !attendeeForm || !attendeesTableBody) {
    return;
  }

  let attendees = [];
  let editingAttendeeId = null;

  const statusStyles = {
    registered: "bg-blue-50 text-blue-700 border-blue-200",
    attended: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "no-show": "bg-red-50 text-red-700 border-red-200"
  };

  const escapeHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const requestAttendees = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Ocurrio un error con los asistentes");
    }

    return data;
  };

  const loadAttendees = async () => {
    try {
      showTableMessage("Loading attendees...");
      attendees = await requestAttendees(API_URL);
      saveAttendees();
    } catch (error) {
      try {
        const storedAttendees = JSON.parse(localStorage.getItem(storageKey));
        attendees = Array.isArray(storedAttendees) ? storedAttendees : [];
      } catch (storageError) {
        attendees = [];
      }
    }
  };

  const saveAttendees = () => {
    localStorage.setItem(storageKey, JSON.stringify(attendees));
  };

  const updateAttendeesCount = (visibleTotal = attendees.length) => {
    if (attendeesCount) {
      attendeesCount.textContent = `Showing ${visibleTotal} of ${attendees.length} attendees`;
    }
  };

  const showTableMessage = (message) => {
    attendeesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-6 text-center text-sm text-gray-400">${message}</td>
      </tr>
    `;
  };

  const getFilteredAttendees = () => {
    const searchTerm = attendeeSearch?.value.trim().toLowerCase() || "";
    const selectedEvent = attendeeEventFilter?.value || "all";
    const selectedStatus = attendeeStatusFilter?.value || "all";

    return attendees.filter((attendee) => {
      const matchesSearch = [
        attendee.name,
        attendee.email,
        attendee.company
      ].some((value) => String(value || "").toLowerCase().includes(searchTerm));
      const matchesEvent = selectedEvent === "all" || attendee.eventId === selectedEvent;
      const matchesStatus = selectedStatus === "all" || attendee.status === selectedStatus;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  };

  const getStatusLabel = (status) => {
    if (status === "no-show") {
      return "No-show";
    }

    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Registered";
  };

  const renderAttendees = () => {
    const entries = getFilteredAttendees();

    if (!entries.length) {
      showTableMessage(attendees.length ? "No attendees match your filters." : "No attendees registered yet.");
      updateAttendeesCount(0);
      return;
    }

    attendeesTableBody.innerHTML = entries.map((attendee, index) => {
      const statusClass = statusStyles[attendee.status] || statusStyles.registered;

      return `
        <tr class="hover:bg-gray-50 transition-colors" data-id="${attendee.id}">
          <td class="px-4 py-3.5 text-gray-400 font-mono text-xs">${index + 1}</td>
          <td class="px-4 py-3.5 font-semibold text-gray-900">${escapeHtml(attendee.name)}</td>
          <td class="px-4 py-3.5 text-gray-600">${escapeHtml(attendee.email)}</td>
          <td class="px-4 py-3.5 text-gray-600">${escapeHtml(attendee.company)}</td>
          <td class="px-4 py-3.5 text-gray-600">${escapeHtml(attendee.eventName)}</td>
          <td class="px-4 py-3.5">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}">${escapeHtml(getStatusLabel(attendee.status))}</span>
          </td>
          <td class="px-4 py-3.5">
            <div class="flex items-center gap-1">
              <button title="Edit" type="button" class="edit-attendee-button w-8 h-8 flex items-center justify-center rounded-md text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer">
                <i class="ri-edit-line text-base"></i>
              </button>
              <button title="Delete" type="button" class="delete-attendee-button w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                <i class="ri-delete-bin-line text-base"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    updateAttendeesCount(entries.length);
  };

  const setModalMode = (mode) => {
    const isEditing = mode === "edit";

    if (attendeeModalTitle) {
      attendeeModalTitle.textContent = isEditing ? "Edit Attendee" : "Add Attendee";
    }

    if (attendeeModalDescription) {
      attendeeModalDescription.textContent = isEditing ? "Update the attendee information" : "Fill in the attendee information";
    }

    if (saveAttendeeButton) {
      saveAttendeeButton.textContent = isEditing ? "Save Changes" : "Add Attendee";
    }
  };

  const openAttendeeModal = (mode = "add") => {
    setModalMode(mode);
    attendeeModal.classList.remove("hidden");
    attendeeModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    document.getElementById("attendeeName")?.focus();
  };

  const closeAttendeeModal = () => {
    attendeeModal.classList.add("hidden");
    attendeeModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    attendeeForm.reset();
    editingAttendeeId = null;
    setModalMode("add");
  };

  const getFieldValue = (fieldName) => {
    const field = attendeeForm.elements[fieldName];
    return field ? field.value.trim() : "";
  };

  const setFieldValue = (fieldName, value) => {
    const field = attendeeForm.elements[fieldName];

    if (field) {
      field.value = value || "";
    }
  };

  const getEventLabel = () => {
    const eventSelect = attendeeForm.elements.eventName;
    const selectedOption = eventSelect?.selectedOptions?.[0];
    return selectedOption ? selectedOption.textContent.trim() : "";
  };

  const getAttendeeFromForm = () => ({
    name: getFieldValue("name"),
    email: getFieldValue("email"),
    company: getFieldValue("company"),
    eventId: getFieldValue("eventName"),
    eventName: getEventLabel(),
    status: getFieldValue("status") || "registered"
  });

  const fillAttendeeForm = (attendee) => {
    setFieldValue("name", attendee.name);
    setFieldValue("email", attendee.email);
    setFieldValue("company", attendee.company);
    setFieldValue("eventName", attendee.eventId);
    setFieldValue("status", attendee.status);
  };

  openAttendeeModalButton.addEventListener("click", () => openAttendeeModal("add"));
  closeAttendeeModalButton?.addEventListener("click", closeAttendeeModal);
  cancelAttendeeModalButton?.addEventListener("click", closeAttendeeModal);
  attendeeSearch?.addEventListener("input", renderAttendees);
  attendeeEventFilter?.addEventListener("change", renderAttendees);
  attendeeStatusFilter?.addEventListener("change", renderAttendees);

  attendeeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!attendeeForm.checkValidity()) {
      attendeeForm.reportValidity();
      return;
    }

    const attendee = getAttendeeFromForm();

    try {
      if (saveAttendeeButton) {
        saveAttendeeButton.disabled = true;
        saveAttendeeButton.textContent = editingAttendeeId ? "Saving..." : "Adding...";
      }

      if (editingAttendeeId) {
        const updatedAttendee = await requestAttendees(`${API_URL}/${editingAttendeeId}`, {
          method: "PUT",
          body: JSON.stringify(attendee)
        });

        attendees = attendees.map((currentAttendee) =>
          String(currentAttendee.id) === String(editingAttendeeId) ? updatedAttendee : currentAttendee
        );
      } else {
        const createdAttendee = await requestAttendees(API_URL, {
          method: "POST",
          body: JSON.stringify(attendee)
        });

        attendees.push(createdAttendee);
      }

      saveAttendees();
      closeAttendeeModal();
      renderAttendees();
    } catch (error) {
      alert(error.message);
    } finally {
      if (saveAttendeeButton) {
        saveAttendeeButton.disabled = false;
        setModalMode(editingAttendeeId ? "edit" : "add");
      }
    }
  });

  attendeesTableBody.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-id]");
    const editButton = event.target.closest(".edit-attendee-button");
    const deleteButton = event.target.closest(".delete-attendee-button");

    if (!row) {
      return;
    }

    const attendee = attendees.find((currentAttendee) => String(currentAttendee.id) === row.dataset.id);

    if (editButton && attendee) {
      editingAttendeeId = attendee.id;
      fillAttendeeForm(attendee);
      openAttendeeModal("edit");
      return;
    }

    if (!deleteButton || !attendee) {
      return;
    }

    const shouldDelete = window.confirm(`Delete ${attendee.name}?`);

    if (!shouldDelete) {
      return;
    }

    requestAttendees(`${API_URL}/${attendee.id}`, {
      method: "DELETE"
    })
      .then(() => {
        attendees = attendees.filter((currentAttendee) => String(currentAttendee.id) !== String(attendee.id));
        saveAttendees();
        renderAttendees();
      })
      .catch((error) => {
        alert(error.message);
      });
  });

  loadAttendees().finally(renderAttendees);
});
