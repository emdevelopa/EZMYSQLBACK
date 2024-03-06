// frontend.js
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send data to the backend using fetch API
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data);

          //   window.location.href = "/dashboard";
        } else {
          alert("Invalid username or password. Try again.");
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
