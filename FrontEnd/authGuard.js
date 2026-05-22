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

// Each protected page is checked against this map before the user can continue.
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

const KNOWN_PAGES = new Set(Object.keys(PAGE_PATHS));

const normalizePageName = (page) => {
  if (!page) {
    return "index.html";
  }

  if (KNOWN_PAGES.has(page)) {
    return page;
  }

  const htmlPage = `${page}.html`;
  return KNOWN_PAGES.has(htmlPage) ? htmlPage : page;
};

const getPageFromPath = (href) => {
  if (!href) {
    return "";
  }

  const pathParts = href.split("#")[0].split("?")[0].split("/").filter(Boolean);
  return normalizePageName(pathParts.pop());
};

const getCurrentPage = () => {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  return normalizePageName(pathParts.pop());
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

const formatUserText = (value) => {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const updateLoggedUserUI = (loggedUser) => {
  const roleLabel = formatUserText(loggedUser.role);
  const displayName = formatUserText(loggedUser.name || loggedUser.role);
  const initial = (displayName || roleLabel || "U").charAt(0).toUpperCase();

  document.querySelectorAll("div").forEach((element) => {
    const isUserAvatar = element.classList.contains("rounded-full")
      && element.classList.contains("bg-brand-100")
      && element.classList.contains("text-brand-700")
      && element.textContent.trim().length === 1;

    if (isUserAvatar) {
      element.textContent = initial;
    }
  });

  document.querySelectorAll("p").forEach((paragraph) => {
    const text = paragraph.textContent.trim().toLowerCase();

    if (paragraph.classList.contains("text-sm") && paragraph.classList.contains("font-medium") && text === "admin") {
      paragraph.textContent = displayName;
    }

    if (paragraph.classList.contains("text-xs") && paragraph.classList.contains("capitalize") && text === "admin") {
      paragraph.textContent = roleLabel;
    }
  });
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

// Frontend checks improve navigation UX; backend middleware remains the source of truth.
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

  updateLoggedUserUI(loggedUser);

  document.querySelectorAll("a").forEach((link) => {
    const label = link.textContent.replace(/\s+/g, " ").trim();
    const pageByLabel = PAGE_BY_LABEL[label];

    if (pageByLabel) {
      link.href = getPagePath(pageByLabel);
    }

    const linkedPage = getPageFromPath(link.getAttribute("href"));
    const isAllowedForRole = (AUTH_PAGES_BY_ROLE[loggedUser.role] || []).includes(linkedPage);

    // Hide navigation entries the current role cannot open.
    if (loggedUser.role === "staff" && !isAllowedForRole) {
      link.classList.add("hidden");
      return;
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

    button.addEventListener("click", async () => {
      try {
        await fetch(`${window.API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include"
        });
      } catch (error) {
        console.error(error);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = getPagePath("login.html");
    });
  });
});
