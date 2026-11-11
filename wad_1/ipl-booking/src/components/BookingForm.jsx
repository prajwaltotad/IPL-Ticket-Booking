
function BookingForm({ selectedMatch, onBookingSubmit }) {

    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target;

        const newBooking = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            match: selectedMatch,
            stand: form.stand.value,
            tickets: form.tickets.value
        };

        onBookingSubmit(newBooking);

        alert("Booking submitted successfully!");

        form.reset();
    }

    return (
        <section id="booking">
            <h2>IPL 2026 Ticket Booking</h2>

            <form onSubmit={handleSubmit}>

                <p>
                    <label>Full Name:</label><br />
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        required
                    />
                </p>

                <p>
                    <label>Email Address:</label><br />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />
                </p>

                <p>
                    <label>Phone Number:</label><br />
                    <input
                        type="tel"
                        name="phone"
                        pattern="[0-9]{10}"
                        title="Enter a 10-digit phone number"
                        placeholder="Enter your phone number"
                        required
                    />
                </p>

                <p>
                    <label>Selected Match:</label><br />
                    <input
                        type="text"
                        value={selectedMatch}
                        placeholder="Select a match above"
                        readOnly
                        required
                    />
                </p>

                <p>
                    <label>Stand Category:</label><br />
                    <select name="stand" required defaultValue="General">
                        <option value="General">General</option>
                        <option value="Premium">Premium</option>
                        <option value="VIP">VIP</option>
                    </select>
                </p>

                <p>
                    <label>Number of Tickets:</label><br />
                    <input
                        type="number"
                        name="tickets"
                        min="1"
                        max="10"
                        defaultValue="1"
                        required
                    />
                </p>

                <button type="submit">Submit Booking</button>
                <button type="reset">Reset Form</button>

            </form>
        </section>
    );
}

export default BookingForm;
