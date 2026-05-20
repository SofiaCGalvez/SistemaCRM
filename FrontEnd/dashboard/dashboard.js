document.addEventListener("DOMContentLoaded", () => {
  const companiesCount = document.getElementById("dashboardCompaniesCount");
  const activeMembersCount = document.getElementById("dashboardActiveMembersCount");
  const upcomingEventsCount = document.getElementById("dashboardUpcomingEventsCount");
  const growthChart = document.getElementById("membershipGrowthChart");
  const growthSubtitle = document.getElementById("membershipGrowthSubtitle");

  if (!companiesCount && !activeMembersCount && !upcomingEventsCount && !growthChart) {
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
  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const requestData = async (url) => {
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Ocurrio un error al cargar el dashboard");
    }

    return data;
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

  loadDashboardCounts();
});
