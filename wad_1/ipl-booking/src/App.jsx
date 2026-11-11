
import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";

function App() {

    const matches = [
        {
            id: 1,
            match: "CSK vs MI",
            date: "28 March 2026",
            time: "7:30 PM",
            venue: "Chennai"
        },
        {
            id: 2,
            match: "RCB vs KKR",
            date: "29 March 2026",
            time: "7:30 PM",
            venue: "Bengaluru"
        },
        {
            id: 3,
            match: "RR vs CSK",
            date: "30 March 2026",
            time: "3:30 PM",
            venue: "Jaipur"
        },
        {
            id: 4,
            match: "MI vs KKR",
            date: "1 April 2026",
            time: "7:30 PM",
            venue: "Mumbai"
        },
        {
            id: 5,
            match: "CSK vs RCB",
            date: "2 April 2026",
            time: "7:30 PM",
            venue: "Chennai"
        }
    ];

    // Store the selected match
    const [selectedMatch, setSelectedMatch] = useState("");

    // Store all submitted bookings
    const [bookings, setBookings] = useState([]);

    // Handle Book Ticket button
    function handleBooking(matchName) {
        setSelectedMatch(matchName);

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });
    }

    // Add a new booking
    function handleBookingSubmit(newBooking) {
        const bookingWithId = {
            ...newBooking,
            id: bookings.length + 1
        };

        setBookings([...bookings, bookingWithId]);
    }

    return (
        <>
            <Navbar />

            <Hero />

            {/* Match Schedule */}
            <section id="matches">
                <h1>IPL 2026 Match Schedule</h1>

                <div className="match-container">
                    {matches.map((item) => (
                        <MatchCard
                            key={item.id}
                            match={item.match}
                            date={item.date}
                            time={item.time}
                            venue={item.venue}
                            onBook={() => handleBooking(item.match)}
                        />
                    ))}
                </div>
            </section>

            {/* Booking Form */}
            <BookingForm
                selectedMatch={selectedMatch}
                onBookingSubmit={handleBookingSubmit}
            />

            {/* My Bookings */}
            <section id="my-bookings">
                <h2>My Bookings</h2>

                {bookings.length === 0 ? (
                    <p>Your booking details will appear here.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Name</th>
                                <th>Match</th>
                                <th>Stand</th>
                                <th>Tickets</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.name}</td>
                                    <td>{booking.match}</td>
                                    <td>{booking.stand}</td>
                                    <td>{booking.tickets}</td>
                                    <td>{booking.email}</td>
                                    <td>{booking.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Guidelines */}
            <section id="guidelines">
                <h2>Guidelines</h2>

                <h3>Ticket Verification</h3>
                <p>Show your valid ticket at the stadium entrance.</p>

                <h3>ID Proof Requirement</h3>
                <p>Carry a valid photo ID to the stadium.</p>

                <h3>Prohibited Items</h3>
                <p>Do not bring sharp objects or restricted items.</p>
            </section>

            <Footer />
        </>
    );
}

export default App;
