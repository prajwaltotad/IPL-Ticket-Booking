function MatchCard({ match, date, time, venue, onBook }) {
    return (
        <div className="match-card">
            <h2>{match}</h2>

            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Venue:</strong> {venue}</p>

            <button onClick={onBook}>
                Book Ticket
            </button>
        </div>
    );
}

export default MatchCard;