document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');

    if (mobileMenuButton && mobileMenu && mobileMenuIcon) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');

            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));
            mobileMenuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
            mobileMenuIcon.classList.toggle('ri-menu-line', isOpen);
            mobileMenuIcon.classList.toggle('ri-close-line', !isOpen);
        });
    }

    const openCompanyModalButton = document.getElementById('openCompanyModal');
    const companyModal = document.getElementById('companyModal');
    const closeCompanyModalButton = document.getElementById('closeCompanyModal');
    const cancelCompanyModalButton = document.getElementById('cancelCompanyModal');
    const companyForm = document.getElementById('companyForm');
    const companiesTableBody = document.getElementById('companiesTableBody');
    const companiesCount = document.getElementById('companiesCount');
    const exportCompaniesButton = document.getElementById('exportCompaniesButton');
    const companyModalTitle = document.getElementById('companyModalTitle');
    const companyModalDescription = document.getElementById('companyModalDescription');
    const saveCompanyButton = document.getElementById('saveCompanyButton');
    let editingCompanyRow = null;

    if (!openCompanyModalButton || !companyModal || !companyForm || !companiesTableBody) {
        return;
    }

    const updateCompaniesCount = () => {
        if (!companiesCount) {
            return;
        }

        const totalCompanies = companiesTableBody.querySelectorAll('tr').length;
        companiesCount.textContent = `Showing ${totalCompanies} of ${totalCompanies} companies`;
    };

    const setModalMode = (mode) => {
        const isEditing = mode === 'edit';

        if (companyModalTitle) {
            companyModalTitle.textContent = isEditing ? 'Edit Company' : 'Add New Company';
        }

        if (companyModalDescription) {
            companyModalDescription.textContent = isEditing ? 'Update the company information' : 'Fill in the company information';
        }

        if (saveCompanyButton) {
            saveCompanyButton.textContent = isEditing ? 'Save Changes' : 'Add Company';
        }
    };

    const openCompanyModal = (mode = 'add') => {
        setModalMode(mode);
        companyModal.classList.remove('hidden');
        companyModal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
        document.getElementById('companyName')?.focus();
    };

    const closeCompanyModal = () => {
        companyModal.classList.add('hidden');
        companyModal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        companyForm.reset();
        editingCompanyRow = null;
        setModalMode('add');
    };

    const getFieldValue = (fieldName) => {
        const field = companyForm.elements[fieldName];
        return field ? field.value.trim() : '';
    };

    const setFieldValue = (fieldName, value) => {
        const field = companyForm.elements[fieldName];

        if (field) {
            field.value = value;
        }
    };

    const createCell = (text, extraClasses) => {
        const cell = document.createElement('td');
        cell.className = `px-4 py-3.5 ${extraClasses}`;
        cell.textContent = text;
        return cell;
    };

    const renumberCompanies = () => {
        companiesTableBody.querySelectorAll('tr').forEach((row, index) => {
            row.querySelector('td').textContent = String(index + 1);
        });
    };

    const normalizeIndustry = (industry) => {
        return industry === 'all' || !industry ? 'Other' : industry;
    };

    const fillCompanyRow = (row, company, number) => {
        const cells = row.children;
        const industry = normalizeIndustry(company.industry);

        cells[0].textContent = String(number);
        cells[1].textContent = company.name;
        cells[2].textContent = company.representative;
        cells[3].textContent = company.position || 'N/A';
        cells[4].textContent = company.email;
        cells[5].textContent = company.phone || 'N/A';
        cells[6].querySelector('span').textContent = industry;
        cells[7].textContent = company.website || 'N/A';
        row.dataset.website = company.website || '';
    };

    const getCompanyFromForm = () => ({
        name: getFieldValue('companyName'),
        representative: getFieldValue('companyRepresentative'),
        position: getFieldValue('companyPosition'),
        email: getFieldValue('companyEmail'),
        phone: getFieldValue('companyPhone'),
        industry: getFieldValue('companyIndustry'),
        website: getFieldValue('companyWebsite')
    });

    const getCompanyFromRow = (row) => {
        const cells = row.children;
        const position = cells[3].textContent.trim();
        const phone = cells[5].textContent.trim();
        const industry = cells[6].querySelector('span')?.textContent.trim() || 'all';
        const website = cells[7].textContent.trim();

        return {
            name: cells[1].textContent.trim(),
            representative: cells[2].textContent.trim(),
            position: position === 'N/A' ? '' : position,
            email: cells[4].textContent.trim(),
            phone: phone === 'N/A' ? '' : phone,
            industry,
            website: website === 'N/A' ? '' : website
        };
    };

    const fillCompanyForm = (company) => {
        setFieldValue('companyName', company.name);
        setFieldValue('companyRepresentative', company.representative);
        setFieldValue('companyPosition', company.position);
        setFieldValue('companyEmail', company.email);
        setFieldValue('companyPhone', company.phone);
        setFieldValue('companyIndustry', company.industry);
        setFieldValue('companyWebsite', company.website);
    };

    const escapeCsvValue = (value) => {
        const text = String(value ?? '');
        return `"${text.replace(/"/g, '""')}"`;
    };

    const getCompaniesFromTable = () => {
        return Array.from(companiesTableBody.querySelectorAll('tr')).map((row) => {
            const company = getCompanyFromRow(row);
            const cells = row.children;

            return {
                seq: cells[0].textContent.trim(),
                ...company,
                status: cells[8].textContent.trim(),
                membershipExpiration: row.dataset.membershipExpiration || ''
            };
        });
    };

    const exportToExcel = (rows) => {
        const headers = ['#', 'Company', 'Representative', 'Position', 'Email', 'Phone', 'Industry', 'Website'];
        const csvRows = [
            headers.map(escapeCsvValue).join(','),
            ...rows.map((row) => [
                row.seq,
                row.name,
                row.representative,
                row.position,
                row.email,
                row.phone,
                row.industry,
                row.website,
            ].map(escapeCsvValue).join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'companies.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const addCompanyRow = (company) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.dataset.website = company.website || '';

        row.appendChild(createCell(String(companiesTableBody.querySelectorAll('tr').length + 1), 'text-gray-400 font-mono text-xs'));
        row.appendChild(createCell(company.name, 'font-semibold text-gray-900'));
        row.appendChild(createCell(company.representative, 'text-gray-600'));
        row.appendChild(createCell(company.position || 'N/A', 'text-gray-500 text-xs'));
        row.appendChild(createCell(company.email, 'text-gray-600'));
        row.appendChild(createCell(company.phone || 'N/A', 'text-gray-600 whitespace-nowrap'));

        const industryCell = document.createElement('td');
        industryCell.className = 'px-4 py-3.5';
        const industryBadge = document.createElement('span');
        industryBadge.className = 'inline-flex items-center px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-medium border border-brand-100';
        industryBadge.textContent = normalizeIndustry(company.industry);
        industryCell.appendChild(industryBadge);
        row.appendChild(industryCell);
        row.appendChild(createCell(company.website || 'N/A', 'text-gray-600 whitespace-nowrap'));

        const statusCell = document.createElement('td');
        statusCell.className = 'px-4 py-3.5';
        const statusBadge = document.createElement('span');
        statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200';
        statusBadge.textContent = 'active';
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'px-4 py-3.5';
        actionsCell.innerHTML = `
            <div class="flex items-center gap-1">
                <button title="Edit" type="button" class="edit-company-button w-8 h-8 flex items-center justify-center rounded-md text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer">
                    <i class="ri-edit-line text-base"></i>
                </button>
                <button title="Delete" type="button" class="delete-company-button w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                    <i class="ri-delete-bin-line text-base"></i>
                </button>
            </div>
        `;
        row.appendChild(actionsCell);

        companiesTableBody.appendChild(row);
        updateCompaniesCount();
    };

    openCompanyModalButton.addEventListener('click', () => {
        editingCompanyRow = null;
        companyForm.reset();
        openCompanyModal('add');
    });
    closeCompanyModalButton?.addEventListener('click', closeCompanyModal);
    cancelCompanyModalButton?.addEventListener('click', closeCompanyModal);
    exportCompaniesButton?.addEventListener('click', () => {
        exportToExcel(getCompaniesFromTable());
    });

    companyModal.addEventListener('click', (event) => {
        if (event.target === companyModal) {
            closeCompanyModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !companyModal.classList.contains('hidden')) {
            closeCompanyModal();
        }
    });

    companyForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!companyForm.checkValidity()) {
            companyForm.reportValidity();
            return;
        }

        const company = getCompanyFromForm();

        if (editingCompanyRow) {
            const rowNumber = editingCompanyRow.querySelector('td').textContent;
            fillCompanyRow(editingCompanyRow, company, rowNumber);
        } else {
            addCompanyRow(company);
        }

        closeCompanyModal();
    });

    companiesTableBody.addEventListener('click', (event) => {
        const editButton = event.target.closest('.edit-company-button');
        const deleteButton = event.target.closest('.delete-company-button');

        if (editButton) {
            editingCompanyRow = editButton.closest('tr');
            fillCompanyForm(getCompanyFromRow(editingCompanyRow));
            openCompanyModal('edit');
            return;
        }

        if (!deleteButton) {
            return;
        }

        deleteButton.closest('tr')?.remove();
        renumberCompanies();
        updateCompaniesCount();
    });

    updateCompaniesCount();
});
