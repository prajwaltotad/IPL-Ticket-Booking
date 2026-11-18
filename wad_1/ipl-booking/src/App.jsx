import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";

function App() {
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch matches from Supabase
  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching matches:", error.message);
      setError("Unable to load matches.");
      return;
    }

    setMatches(data || []);
    setError("");
  }

  // Fetch existing bookings from Supabase
  async function fetchBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error.message);
      return;
    }

    setBookings(data || []);
  }

  // Initial data fetching and realtime subscription
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([fetchMatches(), fetchBookings()]);
      setLoading(false);
    }

    loadData();

    // Listen for changes in the matches table
    const matchesChannel = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        () => {
          fetchMatches();
        },
      )
      .subscribe();

    // Listen for changes in the bookings table
    const bookingsChannel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          fetchBookings();
        },
      )
      .subscribe();

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, []);

  // Handle Book Ticket button
  function handleBooking(matchId) {
    setSelectedMatch(String(matchId));

    document.getElementById("booking").scrollIntoView({
      behavior: "smooth",
    });
  }

  // Save booking and update available seats
  async function handleBookingSubmit(newBooking) {
    const match = matches.find(
      (item) => item.id === Number(newBooking.match_id),
    );

    if (!match) {
      return {
        success: false,
        message: "Please select a valid match.",
      };
    }

    const quantity = Number(newBooking.tickets);

    if (quantity < 1 || quantity > match.available_seats) {
      return {
        success: false,
        message: "Not enough seats are available.",
      };
    }

    const totalPrice = Number(match.price) * quantity;

    // Reduce available seats first
    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({
        available_seats: match.available_seats - quantity,
      })
      .eq("id", match.id)
      .gte("available_seats", quantity)
      .select()
      .maybeSingle();

    if (updateError || !updatedMatch) {
      console.error("Seat update failed:", updateError);
      return {
        success: false,
        message: "Seats could not be reserved. Please try again.",
      };
    }

    // Insert booking into Supabase
    const { data: savedBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          match_id: match.id,
          user_name: newBooking.name,
          email: newBooking.email,
          phone: newBooking.phone,
          match_title: `${match.team1} vs ${match.team2}`,
          stand: newBooking.stand,
          tickets: quantity,
          total_price: totalPrice,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.error("Booking failed:", bookingError.message);

      // Restore seats if booking insertion fails
      await supabase
        .from("matches")
        .update({
          available_seats: updatedMatch.available_seats + quantity,
        })
        .eq("id", match.id);

      return {
        success: false,
        message: "Booking failed. Please try again.",
      };
    }

    setBookings((previous) => [savedBooking, ...previous]);

    await fetchMatches();

    return {
      success: true,
      message: "Booking saved successfully!",
    };
  }

  return (
    <>
      <Navbar />

      <Hero />

      {/* Match Schedule */}
      <section id="matches">
        <h1>IPL 2026 Match Schedule</h1>

        {loading ? (
          <p>Loading matches...</p>
        ) : error ? (
          <p>{error}</p>
        ) : matches.length === 0 ? (
          <p>No matches available.</p>
        ) : (
          <div className="match-container">
            {matches.map((item) => (
              <MatchCard
                key={item.id}
                match={`${item.team1} vs ${item.team2}`}
                date={item.date}
                time=""
                venue={item.venue}
                onBook={() => handleBooking(item.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Form */}
      <BookingForm
        matches={matches}
        selectedMatch={selectedMatch}
        onMatchChange={setSelectedMatch}
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
                <th>Total Price</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.user_name}</td>
                  <td>{booking.match_title}</td>
                  <td>{booking.stand}</td>
                  <td>{booking.tickets}</td>
                  <td>₹{booking.total_price}</td>
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
