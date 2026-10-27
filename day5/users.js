   console.log("is loaded - users.js:1");
const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusEl = document.getElementById("status");
const usersList = document.getElementById("users-list");

// 2. Store the loaded users here
let allUsers = [];

// 3. Draw any array of users on the page
function renderUsers(list) {
  usersList.textContent = "";

  list.forEach(function (user) {
    const li = document.createElement("li");
    li.textContent =
      user.name + " | " +
      user.email + " | " +
      user.address.city + " | " +
      user.company.name;
    usersList.appendChild(li);
  });
}

// 4. Fetch the users from the server
async function loadUsers() {
  statusEl.textContent = "Loading...";
  loadButton.disabled = true;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }

    allUsers = await response.json();
    renderUsers(allUsers);
    statusEl.textContent = "Loaded " + allUsers.length + " users.";
  } catch (error) {
    statusEl.textContent = "Error: could not load users. " + error.message;
  } finally {
    loadButton.disabled = false;
  }
}

// 5. Filter the stored users as the person types
function filterUsers() {
  if (allUsers.length === 0) {
    return; // nothing loaded yet
  }

  const text = filterInput.value.toLowerCase();

  const filtered = allUsers.filter(function (user) {
    return user.name.toLowerCase().includes(text);
  });

  renderUsers(filtered);

  if (filtered.length === 0) {
    statusEl.textContent = "No users match your filter.";
  } else {
    statusEl.textContent = "Showing " + filtered.length + " user(s).";
  }
}

// 6. Connect the events
loadButton.addEventListener("click", loadUsers);
filterInput.addEventListener("input", filterUsers);