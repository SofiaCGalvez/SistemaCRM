const API_URL = "http://127.0.0.1:3000/api/auth/login";
const REQUEST_TIMEOUT_MS = 10000;

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const selectedRoleInput = document.getElementById("selectedRole");
const roleButtons = document.querySelectorAll(".role-button");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");
const loginButtonText = document.getElementById("loginButtonText");

const activeClasses = ["bg-brand-50", "border-brand-300", "text-brand-700"];
const inactiveClasses = ["border-gray-200", "text-gray-600", "hover:bg-gray-50"];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

const getHomePageByRole = (role) => {
  return role === "admin" ? "./index.html" : "./dashboard.html";
};

const showMessage = (message, type = "error") => {
  loginMessage.textContent = message;
  loginMessage.classList.remove("hidden", "text-red-600", "text-green-600");
  loginMessage.classList.add(type === "success" ? "text-green-600" : "text-red-600");
};

const setLoading = (isLoading) => {
  loginButton.disabled = isLoading;
  loginButtonText.textContent = isLoading ? "Signing in..." : "Sign in";
};

const storedUser = getStoredUser();

if (localStorage.getItem("token") && storedUser) {
  window.location.href = getHomePageByRole(storedUser.role);
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((currentButton) => {
      currentButton.classList.remove(...activeClasses, ...inactiveClasses);

      if (currentButton === button) {
        currentButton.classList.add(...activeClasses);
        selectedRoleInput.value = currentButton.dataset.role;
      } else {
        currentButton.classList.add(...inactiveClasses);
      }
    });
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const credentials = {
    email: emailInput.value.trim(),
    password: passwordInput.value,
    role: selectedRoleInput.value
  };

  if (!credentials.email || !credentials.password || !credentials.role) {
    showMessage("Complete email, password and role.");
    return;
  }

  try {
    setLoading(true);
    loginMessage.classList.add("hidden");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Could not log in.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showMessage("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = getHomePageByRole(data.user.role);
    }, 700);
  } catch (error) {
    const message = error.name === "AbortError"
      ? "The server took too long to respond. Restart the backend and try again."
      : "Could not connect to the server. Check that the backend is running.";

    showMessage(message);
  } finally {
    setLoading(false);
  }
});
