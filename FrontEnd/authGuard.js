const AUTH_PAGES_BY_ROLE = {
  admin: [
    "index.html",
    "dashboard.html",
    "directorio.html",
    "memberships.html",
    "events.html",
    "attendees.html",
    "tasks.html",
    "renewals.html",
    "potential.html"
  ],
  staff: ["dashboard.html", "directorio.html", "events.html", "tasks.html"]
};

const PAGE_PATHS = {
  "index.html": "index.html",
  "dashboard.html": "dashboard/dashboard.html",
  "directorio.html": "directorio/directorio.html",
  "memberships.html": "memberships/memberships.html",
  "events.html": "events/events.html",
  "attendees.html": "attendees/attendees.html",
  "tasks.html": "tasks/tasks.html",
  "renewals.html": "renewals/renewals.html",
  "potential.html": "potential/potential.html",
  "login.html": "auth/login.html"
};

const ADMIN_ONLY_LABELS = [
  "Home",
  "Memberships",
  "Attendees",
  "Pending Renewals",
  "Potential Members"
];

const PAGE_BY_LABEL = {
  Home: "index.html",
  Dashboard: "dashboard.html",
  Companies: "directorio.html",
  Memberships: "memberships.html",
  Events: "events.html",
  Attendees: "attendees.html",
  Tasks: "tasks.html",
  "Potential Members": "potential.html",
  "Pending Renewals": "renewals.html"
};

const getCurrentPage = () => {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
};

const getRouteDepth = () => {
  return getCurrentPage() === "index.html" ? 0 : 1;
};

const getPagePath = (page) => {
  const prefix = "../".repeat(getRouteDepth());
  return `${prefix}${PAGE_PATHS[page] || page}`;
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

const redirectToLogin = () => {
  window.location.replace(getPagePath("login.html"));
};

const redirectToDashboard = () => {
  window.location.replace(getPagePath("dashboard.html"));
};

const token = localStorage.getItem("token");
const user = getStoredUser();
const currentPage = getCurrentPage();
const allowedPages = AUTH_PAGES_BY_ROLE[user?.role] || [];

if (!token || !user) {
  redirectToLogin();
} else if (!AUTH_PAGES_BY_ROLE[user.role]) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  redirectToLogin();
} else if (!allowedPages.includes(currentPage)) {
  redirectToDashboard();
}

document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = getStoredUser();

  if (!loggedUser) {
    return;
  }

  document.querySelectorAll("a").forEach((link) => {
    const label = link.textContent.trim();

    if (PAGE_BY_LABEL[label]) {
      link.href = getPagePath(PAGE_BY_LABEL[label]);
    }

    if (loggedUser.role === "staff" && ADMIN_ONLY_LABELS.includes(label)) {
      link.classList.add("hidden");
      return;
    }

    const linkedPage = link.getAttribute("href")?.split("/").pop();

    if (
      loggedUser.role === "staff" &&
      linkedPage?.endsWith(".html") &&
      !AUTH_PAGES_BY_ROLE.staff.includes(linkedPage)
    ) {
      link.href = getPagePath("dashboard.html");
    }
  });

  if (loggedUser.role === "staff") {
    document.querySelectorAll("p").forEach((paragraph) => {
      if (paragraph.textContent.trim() === "Quick Actions") {
        paragraph.classList.add("hidden");
      }
    });
  }

  document.querySelectorAll("button").forEach((button) => {
    if (button.textContent.trim() !== "Log out") {
      return;
    }

    button.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = getPagePath("login.html");
    });
  });
});
