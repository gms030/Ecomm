function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalCount = cart.reduce((count, item) => count + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalCount;
}

document.addEventListener('DOMContentLoaded', updateCartCount);

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const nav = document.getElementById("anchor-items");
  const loginLink = document.querySelector('a.nav-items[href="#"][data-bs-toggle="modal"]');

  const showRegisterLink = document.getElementById("showRegister");
  const showLoginLink = document.getElementById("showLogin");

  const loginFormElem = loginForm.querySelector("form");
  const registerFormElem = registerForm.querySelector("form");

  // Toggle to register form
  showRegisterLink.addEventListener("click", e => {
    e.preventDefault();
    loginForm.classList.add("d-none");
    registerForm.classList.remove("d-none");
  });

  // Toggle to login form
  showLoginLink.addEventListener("click", e => {
    e.preventDefault();
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
  });

  // Register user
  registerFormElem.addEventListener("submit", e => {
    e.preventDefault();

    const fullName = document.getElementById("regName").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Save user info (demo only - no security)
    localStorage.setItem("qp_username", username);
    localStorage.setItem("qp_password", password);
    localStorage.setItem("qp_fullName", fullName);
    localStorage.setItem("qp_email", email);

    alert("Registration successful! Please login.");

    registerFormElem.reset();
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
  });

  // Login user
  loginFormElem.addEventListener("submit", e => {
    e.preventDefault();

    const usernameInput = document.getElementById("loginUsername").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;

    const savedUsername = localStorage.getItem("qp_username");
    const savedPassword = localStorage.getItem("qp_password");

    if (usernameInput === savedUsername && passwordInput === savedPassword) {
      localStorage.setItem("qp_loggedIn", "true");
      localStorage.setItem("qp_currentUser", savedUsername);

      alert("Login successful!");

      // Close modal using Bootstrap 5 API
      const modalEl = document.getElementById('loginModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }

      loginFormElem.reset();
      updateNavUser();
    } else {
      alert("Invalid username or password!");
    }
  });

  // Logout function
  function logoutUser() {
    localStorage.removeItem("qp_loggedIn");
    localStorage.removeItem("qp_currentUser");
    updateNavUser();
    alert("You have been logged out.");
  }

  // Update nav user display
  function updateNavUser() {
    const loggedIn = localStorage.getItem("qp_loggedIn");
    const currentUser = localStorage.getItem("qp_currentUser");

    // Remove previous user display or logout container if any
    const oldUserContainer = document.getElementById("userContainer");
    if (oldUserContainer) oldUserContainer.remove();

    if (loggedIn === "true" && currentUser) {
      if (loginLink) loginLink.style.display = "none";

      // Create container for profile image + username + dropdown
      const userContainer = document.createElement("div");
      userContainer.id = "userContainer";
      userContainer.style.position = "relative";
      userContainer.style.display = "inline-block";
      userContainer.style.marginLeft = "15px";
      userContainer.style.cursor = "pointer";
      userContainer.style.color = "black"; // match your nav style

      // Profile Image (Use a default avatar or get from localStorage if you add upload)
      const profileImg = document.createElement("img");
      profileImg.src = "Images/profile-picture.png"; // Put your default avatar path here
      profileImg.alt = "Profile";
      profileImg.style.width = "30px";
      profileImg.style.height = "30px";
      profileImg.style.borderRadius = "50%";
      profileImg.style.verticalAlign = "middle";
      profileImg.style.marginRight = "8px";

      // Username text
      const userNameSpan = document.createElement("span");
      userNameSpan.textContent = currentUser;
      userNameSpan.style.verticalAlign = "middle";

      // Dropdown menu (hidden by default)
      const dropdown = document.createElement("div");
      dropdown.id = "userDropdown";
      dropdown.style.position = "absolute";
      dropdown.style.top = "100%";
      dropdown.style.right = "0";
      dropdown.style.left = "20px";
      dropdown.style.backgroundColor = "#fff";
      dropdown.style.color = "#000";
      dropdown.style.minWidth = "120px";
      dropdown.style.boxShadow = "0 2px 5px rgba(0,0,0,0.15)";
      dropdown.style.borderRadius = "4px";
      dropdown.style.padding = "8px 0";
      dropdown.style.display = "none";
      dropdown.style.zIndex = "1000";

      // Logout option inside dropdown
      const logoutOption = document.createElement("a");
      logoutOption.href = "#";
      logoutOption.style.display = "flex";
      logoutOption.style.alignItems = "center";
      logoutOption.style.padding = "8px 16px";
      logoutOption.style.textDecoration = "none";
      logoutOption.style.color = "#000";
      logoutOption.style.gap = "8px"; // space between image and text

      // Create logout icon image
      const logoutIcon = document.createElement("img");
      logoutIcon.src = "Images/exit.png"; // Put your logout icon path here
      logoutIcon.alt = "Logout";
      logoutIcon.style.width = "16px";
      logoutIcon.style.height = "16px";
      logoutIcon.style.objectFit = "contain";

      // Append icon and text to logout option
      logoutOption.appendChild(logoutIcon);
      logoutOption.appendChild(document.createTextNode("Logout"));

      logoutOption.addEventListener("mouseover", () => {
        logoutOption.style.backgroundColor = "#eee";
      });
      logoutOption.addEventListener("mouseout", () => {
        logoutOption.style.backgroundColor = "transparent";
      });

      logoutOption.addEventListener("click", e => {
        e.preventDefault();
        logoutUser();
        dropdown.style.display = "none";
      });

      dropdown.appendChild(logoutOption);

      // Toggle dropdown on click of userContainer
      userContainer.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
      });

      // Hide dropdown if clicked outside
      document.addEventListener("click", (event) => {
        if (!userContainer.contains(event.target)) {
          dropdown.style.display = "none";
        }
      });

      userContainer.appendChild(profileImg);
      userContainer.appendChild(userNameSpan);
      userContainer.appendChild(dropdown);

      nav.appendChild(userContainer);

    } else {
      if (loginLink) loginLink.style.display = "inline-block";
    }
  }
  
  updateNavUser(); // Initial call to update nav on page load
});

