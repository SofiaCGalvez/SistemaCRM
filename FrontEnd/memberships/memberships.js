document.addEventListener("DOMContentLoaded", () => {
  const openMembershipModalButton = document.getElementById("openMembershipModal");
  const membershipModal = document.getElementById("membershipModal");
  const closeMembershipModalButton = document.getElementById("closeMembershipModal");
  const cancelMembershipModalButton = document.getElementById("cancelMembershipModal");
  const membershipForm = document.getElementById("membershipForm");
  const membershipsTableBody = document.getElementById("membershipsTableBody");
  const membershipsCount = document.getElementById("membershipsCount");
  const saveMembershipButton = document.getElementById("saveMembershipButton");
  const membershipSearch = document.getElementById("membershipSearch");
  const membershipMonthFilter = document.getElementById("membershipMonthFilter");
  const membershipAccountFilter = document.getElementById("membershipAccountFilter");
  const exportMembershipsButton = document.getElementById("exportMembershipsButton");
  const membershipModalTitle = membershipModal?.querySelector("h2");

  if (!openMembershipModalButton || !membershipModal || !membershipForm || !membershipsTableBody) {
    return;
  }

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
  const monthOrder = new Map(MONTHS.map((month, index) => [month, index]));
  const API_URL = `${window.API_BASE_URL}/api/memberships`;
  const DIRECTORY_API_URL = `${window.API_BASE_URL}/api/directory`;
  let memberships = [];
  let editingMembershipId = null;
  let createdSequence = 0;

  const escapeHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const getFieldValue = (fieldName) => {
    const field = membershipForm.elements[fieldName];
    return field ? field.value.trim() : "";
  };

  const setFieldValue = (fieldName, value) => {
    const field = membershipForm.elements[fieldName];

    if (field) {
      field.value = value ?? "";
    }
  };

  const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
      return "$0.00";
    }

    return `$${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  };

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const getMembershipFromForm = () => {
    const year = getFieldValue("year");

    return {
      year,
      month: getFieldValue("month"),
      accountType: getFieldValue("accountType"),
      billingDate: getFieldValue("billingDate"),
      invoice: getFieldValue("invoice"),
      companyName: getFieldValue("companyName"),
      legalName: getFieldValue("legalName"),
      rfc: getFieldValue("rfc"),
      membershipNumber: getFieldValue("membershipNumber"),
      contact1Name: getFieldValue("contact1Name"),
      contact1Email: getFieldValue("contact1Email"),
      contact1Phone: getFieldValue("contact1Phone"),
      contact2Name: getFieldValue("contact2Name"),
      contact2Email: getFieldValue("contact2Email"),
      contact2Phone: getFieldValue("contact2Phone"),
      feeMxn: getFieldValue("feeMxn"),
      feeUsd: getFieldValue("feeUsd"),
      startPeriod: getFieldValue("startPeriod") || `January ${year}`,
      endPeriod: getFieldValue("endPeriod") || `December ${year}`,
      paymentDate: getFieldValue("paymentDate"),
      paymentMethod: getFieldValue("paymentMethod"),
      receipt: getFieldValue("membershipNumber") || getFieldValue("invoice")
    };
  };

  const fillMembershipForm = (membership) => {
    setFieldValue("year", membership.year);
    setFieldValue("month", membership.month);
    setFieldValue("accountType", membership.accountType);
    setFieldValue("billingDate", membership.billingDate);
    setFieldValue("invoice", membership.invoice);
    setFieldValue("companyName", membership.companyName);
    setFieldValue("legalName", membership.legalName);
    setFieldValue("rfc", membership.rfc);
    setFieldValue("membershipNumber", membership.membershipNumber);
    setFieldValue("contact1Name", membership.contact1Name);
    setFieldValue("contact1Email", membership.contact1Email);
    setFieldValue("contact1Phone", membership.contact1Phone);
    setFieldValue("contact2Name", membership.contact2Name);
    setFieldValue("contact2Email", membership.contact2Email);
    setFieldValue("contact2Phone", membership.contact2Phone);
    setFieldValue("feeMxn", membership.feeMxn);
    setFieldValue("feeUsd", membership.feeUsd);
    setFieldValue("startPeriod", membership.startPeriod);
    setFieldValue("endPeriod", membership.endPeriod);
    setFieldValue("paymentDate", membership.paymentDate);
    setFieldValue("paymentMethod", membership.paymentMethod);
  };

  const setModalMode = (mode) => {
    const isEditing = mode === "edit";

    if (membershipModalTitle) {
      membershipModalTitle.textContent = isEditing ? "Edit Membership" : "New Membership";
    }

    if (saveMembershipButton) {
      saveMembershipButton.textContent = isEditing ? "Save Changes" : "Add Membership";
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const requestMemberships = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ocurrio un error en la solicitud");
    }

    return data;
  };

  const getDirectoryPayloadFromMembership = (membership) => ({
    company: membership.companyName,
    representative: membership.contact1Name,
    position: "",
    email: membership.contact1Email,
    phone: membership.contact1Phone,
    industry: "Other",
    website: "",
    status: "active"
  });

  const syncMembershipToDirectory = async (membership) => {
    const directoryPayload = getDirectoryPayloadFromMembership(membership);

    if (!directoryPayload.company || !directoryPayload.representative || !directoryPayload.email) {
      return;
    }

    const directoryEntries = await requestMemberships(DIRECTORY_API_URL);
    const normalizedCompany = directoryPayload.company.toLowerCase();
    const normalizedEmail = directoryPayload.email.toLowerCase();
    const existingEntry = directoryEntries.find((entry) => {
      return (
        String(entry.company || "").toLowerCase() === normalizedCompany ||
        String(entry.email || "").toLowerCase() === normalizedEmail
      );
    });

    if (existingEntry) {
      await requestMemberships(`${DIRECTORY_API_URL}/${existingEntry.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...existingEntry,
          ...directoryPayload
        })
      });
      return;
    }

    await requestMemberships(DIRECTORY_API_URL, {
      method: "POST",
      body: JSON.stringify(directoryPayload)
    });
  };

  const getMembershipRows = () => {
    return Array.from(membershipsTableBody.querySelectorAll("tr:not([data-empty='true'])"));
  };

  const showTableMessage = (message) => {
    membershipsTableBody.innerHTML = `
      <tr data-empty="true">
        <td colspan="15" class="px-4 py-6 text-center text-sm text-gray-400">${escapeHtml(message)}</td>
      </tr>
    `;

    if (membershipsCount) {
      membershipsCount.textContent = "Showing 0 of 0 memberships";
    }
  };

  const updateMembershipsCount = () => {
    if (!membershipsCount) {
      return;
    }

    const rows = getMembershipRows();
    const visibleTotal = rows.filter((row) => !row.hidden).length;
    membershipsCount.textContent = `Showing ${visibleTotal} of ${rows.length} memberships`;
  };

  const getMonthBadge = (month) => {
    return `
      <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 font-medium text-xs whitespace-nowrap">${escapeHtml(month)}</span>
    `;
  };

  const getContinuationCell = () => {
    return '<span class="block min-h-6">&nbsp;</span>';
  };

  const getRowMonthFromCell = (row) => {
    const monthText = row.querySelector("td:first-child span")?.textContent.trim();
    return monthOrder.has(monthText) ? monthText : "";
  };

  const getRowAccountFromCell = (row) => {
    return row.querySelector("td:nth-child(2) span")?.textContent.trim() || "";
  };

  const getCellText = (row, cellIndex) => {
    if (!row) {
      return "";
    }

    return row.cells[cellIndex]?.textContent.replace(/\s+/g, " ").trim() || "";
  };

  const getCellParts = (row, cellIndex) => {
    if (!row) {
      return [];
    }

    const cell = row.cells[cellIndex];

    if (!cell) {
      return [];
    }

    const parts = Array.from(cell.querySelectorAll("div"))
      .map((item) => item.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    return parts.length ? parts : [getCellText(row, cellIndex)];
  };

  const escapeCsvValue = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const getVisibleMembershipRows = () => {
    return getMembershipRows()
      .filter((row) => !row.hidden)
      .map((row, index) => {
        const companyParts = getCellParts(row, 3);
        const contact1Parts = getCellParts(row, 6);
        const contact2Parts = getCellParts(row, 7);

        return [
          index + 1,
          row.dataset.membershipMonth || getRowMonthFromCell(row),
          getCellText(row, 1),
          getCellText(row, 2),
          companyParts[0] || "",
          companyParts[1] || "",
          getCellText(row, 4),
          getCellText(row, 5),
          contact1Parts[0] || "",
          contact1Parts[1] || "",
          contact1Parts[2] || "",
          contact2Parts[0] || "",
          contact2Parts[1] || "",
          contact2Parts[2] || "",
          getCellText(row, 8),
          getCellText(row, 9),
          getCellText(row, 10),
          getCellText(row, 11),
          getCellText(row, 12),
          getCellText(row, 13)
        ];
      });
  };

  const exportMembershipsToExcel = () => {
    const rows = getVisibleMembershipRows();

    if (!rows.length) {
      alert("No memberships to export.");
      return;
    }

    const headers = [
      "#",
      "Month",
      "Account",
      "Billing Date",
      "Company",
      "Legal Name",
      "RFC",
      "Invoice No.",
      "Contact 1 Name",
      "Contact 1 Email",
      "Contact 1 Phone",
      "Contact 2 Name",
      "Contact 2 Email",
      "Contact 2 Phone",
      "Amount MXN",
      "Amount USD",
      "Period",
      "Payment Date",
      "Payment Method",
      "Membership No."
    ];
    const csvRows = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(","))
    ];
    const blob = new Blob([`\ufeff${csvRows.join("\n")}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "memberships.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const initializeExistingRows = () => {
    let currentMonth = "";

    getMembershipRows().forEach((row) => {
      const rowMonth = getRowMonthFromCell(row);

      if (rowMonth) {
        currentMonth = rowMonth;
      }

      row.dataset.membershipMonth = currentMonth || "Unassigned";
      row.dataset.membershipAccount = getRowAccountFromCell(row);
      row.dataset.createdOrder = String(createdSequence++);
    });
  };

  const updateMonthCells = () => {
    let previousMonth = "";

    getMembershipRows().forEach((row) => {
      if (row.hidden) {
        return;
      }

      const month = row.dataset.membershipMonth || getRowMonthFromCell(row);
      const monthCell = row.querySelector("td:first-child");

      if (!monthCell) {
        return;
      }

      monthCell.innerHTML = month && month !== previousMonth ? getMonthBadge(month) : getContinuationCell();
      previousMonth = month;
    });
  };

  const applyMembershipFilters = () => {
    const searchTerm = membershipSearch?.value.trim().toLowerCase() || "";
    const selectedMonth = membershipMonthFilter?.value || "all";
    const selectedAccount = membershipAccountFilter?.value || "all";

    getMembershipRows().forEach((row) => {
      const rowMonth = row.dataset.membershipMonth || "";
      const rowAccount = row.dataset.membershipAccount || "";
      const searchableText = [
        rowMonth,
        rowAccount,
        row.textContent
      ].join(" ").toLowerCase();

      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
      const matchesMonth = selectedMonth === "all" || rowMonth === selectedMonth;
      const matchesAccount = selectedAccount === "all" || rowAccount === selectedAccount;

      row.hidden = !(matchesSearch && matchesMonth && matchesAccount);
    });

    updateMonthCells();
    updateMembershipsCount();
  };

  const sortMembershipRows = () => {
    const rows = getMembershipRows();

    rows
      .sort((firstRow, secondRow) => {
        const firstMonth = monthOrder.get(firstRow.dataset.membershipMonth) ?? Number.MAX_SAFE_INTEGER;
        const secondMonth = monthOrder.get(secondRow.dataset.membershipMonth) ?? Number.MAX_SAFE_INTEGER;

        if (firstMonth !== secondMonth) {
          return firstMonth - secondMonth;
        }

        return Number(firstRow.dataset.createdOrder || 0) - Number(secondRow.dataset.createdOrder || 0);
      })
      .forEach((row) => membershipsTableBody.appendChild(row));

    applyMembershipFilters();
  };

  const openMembershipModal = (mode = "add") => {
    setModalMode(mode);
    membershipModal.classList.remove("hidden");
    membershipModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    document.getElementById("membershipYear")?.focus();
  };

  const closeMembershipModal = () => {
    membershipModal.classList.add("hidden");
    membershipModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    membershipForm.reset();
    editingMembershipId = null;
    setModalMode("add");
  };

  const createMembershipRow = (membership) => {
    const accountClasses = membership.accountType === "USD"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

    const contact1 = {
      name: membership.contact1Name || "N/A",
      email: membership.contact1Email || "N/A",
      phone: membership.contact1Phone || "N/A"
    };
    const contact2 = {
      name: membership.contact2Name || "N/A",
      email: membership.contact2Email || "N/A",
      phone: membership.contact2Phone || "N/A"
    };

    return `
      <tr class="hover:bg-gray-50/70 transition-colors group" data-id="${escapeHtml(membership.id || "")}">
        <td class="px-4 py-4 align-top">
          ${getMonthBadge(membership.month)}
        </td>
        <td class="px-4 py-4 align-top">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full font-medium border text-xs whitespace-nowrap ${accountClasses}">${escapeHtml(membership.accountType)}</span>
        </td>
        <td class="px-4 py-4 align-top text-gray-600 whitespace-nowrap">${escapeHtml(formatDate(membership.billingDate))}</td>
        <td class="px-4 py-4 align-top max-w-[180px]">
          <div class="font-semibold text-gray-900 leading-tight">${escapeHtml(membership.companyName)}</div>
          <div class="text-gray-400 mt-0.5 leading-tight">${escapeHtml(membership.legalName || "N/A")}</div>
        </td>
        <td class="px-4 py-4 align-top font-mono text-gray-700 whitespace-nowrap">${escapeHtml(membership.rfc)}</td>
        <td class="px-4 py-4 align-top font-mono text-gray-700 whitespace-nowrap">${escapeHtml(membership.invoice)}</td>
        <td class="px-4 py-4 align-top max-w-[220px]">
          <div class="font-semibold text-gray-900 leading-tight">${escapeHtml(contact1.name)}</div>
          <div class="text-gray-400 leading-tight">${escapeHtml(contact1.email)}</div>
          <div class="text-gray-400 leading-tight">${escapeHtml(contact1.phone)}</div>
        </td>
        <td class="px-4 py-4 align-top max-w-[220px]">
          <div class="font-semibold text-gray-900 leading-tight">${escapeHtml(contact2.name)}</div>
          <div class="text-gray-400 mt-0.5 leading-tight">${escapeHtml(contact2.email)}</div>
          <div class="text-gray-400 leading-tight">${escapeHtml(contact2.phone)}</div>
        </td>
        <td class="px-4 py-4 align-top font-medium text-gray-900 whitespace-nowrap">${escapeHtml(formatCurrency(membership.feeMxn))}</td>
        <td class="px-4 py-4 align-top font-medium text-gray-900 whitespace-nowrap">${escapeHtml(formatCurrency(membership.feeUsd))}</td>
        <td class="px-4 py-4 align-top text-gray-600 whitespace-nowrap">${escapeHtml(`${membership.startPeriod} - ${membership.endPeriod}`)}</td>
        <td class="px-4 py-4 align-top text-gray-600 whitespace-nowrap">${escapeHtml(formatDate(membership.paymentDate))}</td>
        <td class="px-4 py-4 align-top text-gray-600 whitespace-nowrap">${escapeHtml(membership.paymentMethod || "N/A")}</td>
        <td class="px-4 py-4 align-top text-gray-700 font-mono whitespace-nowrap">${escapeHtml(membership.receipt || "N/A")}</td>
        <td class="px-4 py-4 align-top">
          <div class="flex items-center justify-center gap-1">
            <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors cursor-pointer" title="Renewals for ${escapeHtml(Number(membership.year) + 1)}">
              <i class="ri-refresh-line text-sm"></i>
            </button>
            <button type="button" class="edit-membership-button w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors cursor-pointer" title="Edit">
              <i class="ri-pencil-line text-sm"></i>
            </button>
            <button type="button" class="delete-membership-button w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Delete">
              <i class="ri-delete-bin-line text-sm"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  };

  const renderMemberships = () => {
    createdSequence = 0;

    if (!memberships.length) {
      showTableMessage("No memberships registered yet.");
      return;
    }

    membershipsTableBody.innerHTML = memberships.map(createMembershipRow).join("");
    getMembershipRows().forEach((row, index) => {
      const membership = memberships[index];

      row.dataset.membershipMonth = membership.month;
      row.dataset.membershipAccount = membership.accountType;
      row.dataset.createdOrder = String(createdSequence++);
    });

    sortMembershipRows();
  };

  const loadMemberships = async () => {
    try {
      showTableMessage("Loading memberships...");
      memberships = await requestMemberships(API_URL);
      renderMemberships();
    } catch (error) {
      showTableMessage(error.message);
    }
  };

  openMembershipModalButton.addEventListener("click", () => {
    editingMembershipId = null;
    membershipForm.reset();
    openMembershipModal("add");
  });
  closeMembershipModalButton?.addEventListener("click", closeMembershipModal);
  cancelMembershipModalButton?.addEventListener("click", closeMembershipModal);

  membershipForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!membershipForm.checkValidity()) {
      membershipForm.reportValidity();
      return;
    }

    const membership = getMembershipFromForm();
    const isEditing = Boolean(editingMembershipId);

    if (saveMembershipButton) {
      saveMembershipButton.disabled = true;
      saveMembershipButton.textContent = isEditing ? "Saving..." : "Adding...";
    }

    try {
      await requestMemberships(isEditing ? `${API_URL}/${editingMembershipId}` : API_URL, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(membership)
      });

      try {
        await syncMembershipToDirectory(membership);
      } catch (directoryError) {
        alert(`Membership saved, but directory sync failed: ${directoryError.message}`);
      }

      closeMembershipModal();
      await loadMemberships();
    } catch (error) {
      alert(error.message);
    } finally {
      if (saveMembershipButton) {
        saveMembershipButton.disabled = false;
        setModalMode(isEditing ? "edit" : "add");
      }
    }
  });

  membershipsTableBody.addEventListener("click", async (event) => {
    const editButton = event.target.closest(".edit-membership-button");
    const deleteButton = event.target.closest(".delete-membership-button");

    if (!editButton && !deleteButton) {
      return;
    }

    const row = event.target.closest("tr[data-id]");
    const membershipId = row?.dataset.id;

    if (!membershipId) {
      return;
    }

    const membership = memberships.find((currentMembership) => String(currentMembership.id) === membershipId);

    if (editButton && membership) {
      editingMembershipId = membership.id;
      fillMembershipForm(membership);
      openMembershipModal("edit");
      return;
    }

    if (!deleteButton) {
      return;
    }

    const companyName = getCellParts(row, 3)[0] || "this membership";
    const shouldDelete = window.confirm(`Delete ${companyName}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await requestMemberships(`${API_URL}/${membershipId}`, {
        method: "DELETE"
      });
      await loadMemberships();
    } catch (error) {
      alert(error.message);
    }
  });

  membershipSearch?.addEventListener("input", applyMembershipFilters);
  membershipMonthFilter?.addEventListener("change", applyMembershipFilters);
  membershipAccountFilter?.addEventListener("change", applyMembershipFilters);
  exportMembershipsButton?.addEventListener("click", exportMembershipsToExcel);

  loadMemberships();
});
