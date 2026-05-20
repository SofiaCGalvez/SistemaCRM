document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuIcon = document.getElementById("mobileMenuIcon");

  if (mobileMenuButton && mobileMenu && mobileMenuIcon) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");

      mobileMenu.classList.toggle("hidden");
      mobileMenuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileMenuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      mobileMenuIcon.classList.toggle("ri-menu-line", isOpen);
      mobileMenuIcon.classList.toggle("ri-close-line", !isOpen);
    });
  }

  const openCompanyModalButton = document.getElementById("openCompanyModal");
  const companyModal = document.getElementById("companyModal");
  const closeCompanyModalButton = document.getElementById("closeCompanyModal");
  const cancelCompanyModalButton = document.getElementById("cancelCompanyModal");
  const companyForm = document.getElementById("companyForm");
  const companiesTableBody = document.getElementById("companiesTableBody");
  const companiesCount = document.getElementById("companiesCount");
  const exportCompaniesButton = document.getElementById("exportCompaniesButton");
  const companyModalTitle = document.getElementById("companyModalTitle");
  const companyModalDescription = document.getElementById("companyModalDescription");
  const saveCompanyButton = document.getElementById("saveCompanyButton");
  const searchInput = document.getElementById("companySearch");
  const industryFilter = document.getElementById("industryFilter");

  if (!openCompanyModalButton || !companyModal || !companyForm || !companiesTableBody) {
    return;
  }

  const API_URL = `${window.API_BASE_URL}/api/directory`;
  let directoryEntries = [];
  let editingCompanyId = null;

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const normalizeIndustry = (industry) => {
    return industry === "all" || !industry ? "Other" : industry;
  };

  const escapeHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const showTableMessage = (message) => {
    companiesTableBody.innerHTML = `
      <tr>
        <td colspan="10" class="px-4 py-6 text-center text-sm text-gray-400">${message}</td>
      </tr>
    `;
  };

  const updateCompaniesCount = (visibleTotal = directoryEntries.length) => {
    if (!companiesCount) {
      return;
    }

    companiesCount.textContent = `Showing ${visibleTotal} of ${directoryEntries.length} companies`;
  };

  const setModalMode = (mode) => {
    const isEditing = mode === "edit";

    if (companyModalTitle) {
      companyModalTitle.textContent = isEditing ? "Edit Company" : "Add New Company";
    }

    if (companyModalDescription) {
      companyModalDescription.textContent = isEditing ? "Update the company information" : "Fill in the company information";
    }

    if (saveCompanyButton) {
      saveCompanyButton.textContent = isEditing ? "Save Changes" : "Add Company";
    }
  };

  const openCompanyModal = (mode = "add") => {
    setModalMode(mode);
    companyModal.classList.remove("hidden");
    companyModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    document.getElementById("companyName")?.focus();
  };

  const closeCompanyModal = () => {
    companyModal.classList.add("hidden");
    companyModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    companyForm.reset();
    editingCompanyId = null;
    setModalMode("add");
  };

  const getFieldValue = (fieldName) => {
    const field = companyForm.elements[fieldName];
    return field ? field.value.trim() : "";
  };

  const setFieldValue = (fieldName, value) => {
    const field = companyForm.elements[fieldName];

    if (field) {
      field.value = value || "";
    }
  };

  const getCompanyFromForm = () => ({
    company: getFieldValue("companyName"),
    representative: getFieldValue("companyRepresentative"),
    position: getFieldValue("companyPosition"),
    email: getFieldValue("companyEmail"),
    phone: getFieldValue("companyPhone"),
    industry: getFieldValue("companyIndustry"),
    website: getFieldValue("companyWebsite")
  });

  const fillCompanyForm = (entry) => {
    setFieldValue("companyName", entry.company);
    setFieldValue("companyRepresentative", entry.representative);
    setFieldValue("companyPosition", entry.position);
    setFieldValue("companyEmail", entry.email);
    setFieldValue("companyPhone", entry.phone);
    setFieldValue("companyIndustry", entry.industry);
    setFieldValue("companyWebsite", entry.website);
  };

  const getFilteredEntries = () => {
    const searchTerm = searchInput?.value.trim().toLowerCase() || "";
    const selectedIndustry = industryFilter?.value || "all";

    return directoryEntries.filter((entry) => {
      const matchesSearch = [
        entry.company,
        entry.representative,
        entry.email,
        entry.phone,
        entry.website
      ].some((value) => String(value || "").toLowerCase().includes(searchTerm));
      const matchesIndustry = selectedIndustry === "all" || entry.industry === selectedIndustry;

      return matchesSearch && matchesIndustry;
    });
  };

  const renderDirectory = () => {
    const entries = getFilteredEntries();

    if (!entries.length) {
      showTableMessage(directoryEntries.length ? "No companies match your filters." : "No companies registered yet.");
      updateCompaniesCount(0);
      return;
    }

    companiesTableBody.innerHTML = entries.map((entry, index) => `
      <tr class="hover:bg-gray-50 transition-colors" data-id="${entry.id}">
        <td class="px-4 py-3.5 text-gray-400 font-mono text-xs">${index + 1}</td>
        <td class="px-4 py-3.5 font-semibold text-gray-900">${escapeHtml(entry.company)}</td>
        <td class="px-4 py-3.5 text-gray-600">${escapeHtml(entry.representative)}</td>
        <td class="px-4 py-3.5 text-gray-500 text-xs">${escapeHtml(entry.position || "N/A")}</td>
        <td class="px-4 py-3.5 text-gray-600">${escapeHtml(entry.email)}</td>
        <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">${escapeHtml(entry.phone || "N/A")}</td>
        <td class="px-4 py-3.5">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-medium border border-brand-100">${escapeHtml(normalizeIndustry(entry.industry))}</span>
        </td>
        <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">${escapeHtml(entry.website || "N/A")}</td>
        <td class="px-4 py-3.5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">${escapeHtml(entry.status || "active")}</span>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-1">
            <button title="Edit" type="button" class="edit-company-button w-8 h-8 flex items-center justify-center rounded-md text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer">
              <i class="ri-edit-line text-base"></i>
            </button>
            <button title="Delete" type="button" class="delete-company-button w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <i class="ri-delete-bin-line text-base"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    updateCompaniesCount(entries.length);
  };

  const requestDirectory = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ocurrio un error en la solicitud");
    }

    return data;
  };

  const loadDirectory = async () => {
    try {
      showTableMessage("Loading companies...");
      directoryEntries = await requestDirectory(API_URL);
      renderDirectory();
    } catch (error) {
      showTableMessage(error.message);
    }
  };

  const escapeCsvValue = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportToExcel = (rows) => {
    const headers = ["#", "Company", "Representative", "Position", "Email", "Phone", "Industry", "Website"];
    const csvRows = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((entry, index) => [
        index + 1,
        entry.company,
        entry.representative,
        entry.position,
        entry.email,
        entry.phone,
        entry.industry,
        entry.website
      ].map(escapeCsvValue).join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "directory.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  openCompanyModalButton.addEventListener("click", () => {
    editingCompanyId = null;
    companyForm.reset();
    openCompanyModal("add");
  });
  closeCompanyModalButton?.addEventListener("click", closeCompanyModal);
  cancelCompanyModalButton?.addEventListener("click", closeCompanyModal);
  searchInput?.addEventListener("input", renderDirectory);
  industryFilter?.addEventListener("change", renderDirectory);
  exportCompaniesButton?.addEventListener("click", () => {
    exportToExcel(getFilteredEntries());
  });

  companyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!companyForm.checkValidity()) {
      companyForm.reportValidity();
      return;
    }

    const company = getCompanyFromForm();
    const isEditing = Boolean(editingCompanyId);

    try {
      if (saveCompanyButton) {
        saveCompanyButton.disabled = true;
        saveCompanyButton.textContent = isEditing ? "Saving..." : "Adding...";
      }

      if (isEditing) {
        await requestDirectory(`${API_URL}/${editingCompanyId}`, {
          method: "PUT",
          body: JSON.stringify(company)
        });
      } else {
        await requestDirectory(API_URL, {
          method: "POST",
          body: JSON.stringify(company)
        });
      }

      closeCompanyModal();
      await loadDirectory();
    } catch (error) {
      alert(error.message);
    } finally {
      if (saveCompanyButton) {
        saveCompanyButton.disabled = false;
        setModalMode(isEditing ? "edit" : "add");
      }
    }
  });

  companiesTableBody.addEventListener("click", async (event) => {
    const row = event.target.closest("tr[data-id]");
    const editButton = event.target.closest(".edit-company-button");
    const deleteButton = event.target.closest(".delete-company-button");

    if (!row) {
      return;
    }

    const entry = directoryEntries.find((currentEntry) => String(currentEntry.id) === row.dataset.id);

    if (editButton && entry) {
      editingCompanyId = entry.id;
      fillCompanyForm(entry);
      openCompanyModal("edit");
      return;
    }

    if (!deleteButton || !entry) {
      return;
    }

    const shouldDelete = window.confirm(`Delete ${entry.company}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await requestDirectory(`${API_URL}/${entry.id}`, {
        method: "DELETE"
      });
      await loadDirectory();
    } catch (error) {
      alert(error.message);
    }
  });

  loadDirectory();
});
