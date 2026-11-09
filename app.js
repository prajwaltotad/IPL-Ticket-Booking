// Function to display toast notifications
function showToast(message) {
  let toast = document.getElementById("toast");

  // Create the toast element if it does not exist
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Smooth scrolling when a Book button is clicked
document.addEventListener("DOMContentLoaded", () => {
  const bookLinks = document.querySelectorAll('a[href="#book-ticket"]');

  bookLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const bookingForm = document.getElementById("book-ticket");

      if (bookingForm) {
        bookingForm.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        showToast("Redirecting you to the ticket booking form!");
      }
    });
  });
});
