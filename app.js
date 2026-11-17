
// ===============================
// IPL MATCH TICKET PRICES
// ===============================

const matchPrices = {
    1: {
        name: "CSK vs MI",
        General: 800,
        Premium: 2000,
        VIP: 5000
    },

    2: {
        name: "RCB vs KKR",
        General: 700,
        Premium: 1800,
        VIP: 4500
    },

    3: {
        name: "RR vs CSK",
        General: 600,
        Premium: 1500,
        VIP: 4000
    },

    4: {
        name: "MI vs KKR",
        General: 900,
        Premium: 2200,
        VIP: 5500
    },

    5: {
        name: "CSK vs RCB",
        General: 800,
        Premium: 2000,
        VIP: 5000
    }
};


// ===============================
// TOAST NOTIFICATION
// ===============================

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


// ===============================
// RUN AFTER HTML LOADS
// ===============================

document.addEventListener("DOMContentLoaded", function () {


    // ===============================
    // HAMBURGER MENU
    // ===============================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            navLinks.classList.toggle("nav-open");

            const isOpen = navLinks.classList.contains("nav-open");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.textContent = isOpen ? "✕" : "☰";

        });

        // Close menu after clicking a navigation link
        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("nav-open");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.textContent = "☰";

            });

        });

    }


    // ===============================
    // TEAM FILTER
    // ===============================

    const teamFilter = document.getElementById("teamFilter");

    const matchCards = document.querySelectorAll(".match-card");

    const noMatches = document.getElementById("noMatches");

    if (teamFilter && matchCards.length > 0) {

        teamFilter.addEventListener("change", function () {

            const selectedTeam = teamFilter.value;

            let visibleCount = 0;

            matchCards.forEach(function (card) {

                const teams = card.dataset.teams.split(" ");

                if (
                    selectedTeam === "all" ||
                    teams.includes(selectedTeam)
                ) {

                    card.hidden = false;
                    visibleCount++;

                } else {

                    card.hidden = true;

                }

            });

            if (noMatches) {
                noMatches.hidden = visibleCount !== 0;
            }

            showToast("Match filter updated!");

        });

    }


    // ===============================
    // GRID AND LIST VIEW
    // ===============================

    const matchContainer = document.getElementById("matchContainer");

    const gridView = document.getElementById("gridView");

    const listView = document.getElementById("listView");

    if (matchContainer && gridView && listView) {

        gridView.addEventListener("click", function () {

            matchContainer.classList.remove("list-view");

            gridView.classList.add("active-view");

            listView.classList.remove("active-view");

            showToast("Grid View Enabled!");

        });


        listView.addEventListener("click", function () {

            matchContainer.classList.add("list-view");

            listView.classList.add("active-view");

            gridView.classList.remove("active-view");

            showToast("List View Enabled!");

        });

    }


    // ===============================
    // BOOKING FORM AND LIVE SUMMARY
    // ===============================

    const matchSelect = document.getElementById("match");

    const standSelect = document.getElementById("stand");

    const quantityInput = document.getElementById("quantity");

    const summaryMatch = document.getElementById("summaryMatch");

    const summaryStand = document.getElementById("summaryStand");

    const summaryPrice = document.getElementById("summaryPrice");

    const summaryQuantity = document.getElementById("summaryQuantity");

    const summaryTotal = document.getElementById("summaryTotal");


    // Run booking code only on booking.html
    if (
        matchSelect &&
        standSelect &&
        quantityInput &&
        summaryMatch &&
        summaryStand &&
        summaryPrice &&
        summaryQuantity &&
        summaryTotal
    ) {

        // Update Booking Summary
        function updateSummary(showNotification = true) {

            const selectedMatch = matchSelect.value;

            const selectedStand = standSelect.value;

            const quantity = Number(quantityInput.value);

            const match = matchPrices[selectedMatch];

            // Wait until a valid quantity is entered
            if (
                !match ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 10
            ) {
                return;
            }

            const ticketPrice = match[selectedStand];

            const totalPrice = ticketPrice * quantity;

            // Display selected details
            summaryMatch.textContent = match.name;

            summaryStand.textContent = selectedStand;

            summaryPrice.textContent =
                ticketPrice.toLocaleString("en-IN");

            summaryQuantity.textContent = quantity;

            summaryTotal.textContent =
                totalPrice.toLocaleString("en-IN");

            if (showNotification) {
                showToast("Booking Summary Updated!");
            }

        }


        // Match selection
        matchSelect.addEventListener("change", function () {

            updateSummary();

        });


        // Stand selection
        standSelect.addEventListener("change", function () {

            updateSummary();

        });


        // Quantity selection
        quantityInput.addEventListener("input", function () {

            updateSummary();

        });


        // Read match number from URL
        const urlParams = new URLSearchParams(window.location.search);

        const matchFromURL = urlParams.get("match");

        if (matchFromURL && matchPrices[matchFromURL]) {

            matchSelect.value = matchFromURL;

        }


        // Initial Booking Summary
        updateSummary(false);


        // Booking Form Submission
        const bookingForm = document.getElementById("bookingForm");

        if (bookingForm) {

            bookingForm.addEventListener("submit", function (event) {

                event.preventDefault();

                showToast("Booking submitted successfully!");

                bookingForm.reset();

                updateSummary(false);

            });

            // Reset the summary when the form is reset
            bookingForm.addEventListener("reset", function () {

                setTimeout(function () {

                    updateSummary(false);

                }, 0);

            });

        }

    }

});
