import { useMemo, useState } from "react";

/**
 * BookingModal
 * -------------
 * A self-contained booking UI. Drop this file into your project's
 * `src/components/` folder.
 *
 * Props:
 *  - hotel:    { id, name, location, thumbnail, price } — required
 *  - onClose:  () => void — called when the user closes the modal
 *  - onConfirm: (bookingDetails) => void — optional, called with the
 *               final booking object when the user confirms
 */
export default function BookingModal({ hotel, onClose, onConfirm }) {
  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [step, setStep] = useState("form"); // "form" | "confirmed"
  const [error, setError] = useState("");

  // Number of nights between the two dates (0 if invalid/incomplete)
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const taxesAndFees = 250; // flat demo fee per booking
  const subtotal = nights * rooms * hotel.price;
  const total = subtotal > 0 ? subtotal + taxesAndFees : 0;

  function handleSubmit(e) {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      setError("Check-out date must be after the check-in date.");
      return;
    }

    setError("");

    const bookingDetails = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      nights,
      guests,
      rooms,
      total,
    };

    onConfirm?.(bookingDetails);
    setStep("confirmed");
  }

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {step === "form" && (
          <>
            <div className="booking-modal__hotel">
              <img src={hotel.thumbnail} alt={hotel.name} />
              <div>
                <h3>{hotel.name}</h3>
                <p>{hotel.location}</p>
                <span className="booking-modal__rate">
                  ₹{hotel.price.toLocaleString("en-IN")} <small>/ night / room</small>
                </span>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-form__row">
                <div className="booking-form__field">
                  <label htmlFor="checkIn">Check-in</label>
                  <input
                    id="checkIn"
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                  />
                </div>
                <div className="booking-form__field">
                  <label htmlFor="checkOut">Check-out</label>
                  <input
                    id="checkOut"
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="booking-form__row">
                <div className="booking-form__field">
                  <label htmlFor="guests">Guests</label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="booking-form__field">
                  <label htmlFor="rooms">Rooms</label>
                  <select
                    id="rooms"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Room" : "Rooms"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="booking-form__error">{error}</p>}

              {nights > 0 && (
                <div className="booking-summary">
                  <div className="booking-summary__row">
                    <span>
                      ₹{hotel.price.toLocaleString("en-IN")} × {nights} night
                      {nights > 1 ? "s" : ""} × {rooms} room{rooms > 1 ? "s" : ""}
                    </span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="booking-summary__row">
                    <span>Taxes & fees</span>
                    <span>₹{taxesAndFees.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="booking-summary__row booking-summary__row--total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              <button type="submit" className="booking-form__submit">
                Confirm Booking
              </button>
            </form>
          </>
        )}

        {step === "confirmed" && (
          <div className="booking-success">
            <span className="booking-success__icon">✅</span>
            <h3>Booking Confirmed!</h3>
            <p>
              Your stay at <strong>{hotel.name}</strong> is booked for{" "}
              <strong>{nights}</strong> night{nights > 1 ? "s" : ""}.
            </p>
            <div className="booking-success__details">
              <p>
                <strong>Check-in:</strong> {checkIn}
              </p>
              <p>
                <strong>Check-out:</strong> {checkOut}
              </p>
              <p>
                <strong>Guests:</strong> {guests} • <strong>Rooms:</strong> {rooms}
              </p>
              <p>
                <strong>Total paid:</strong> ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
            <button className="booking-success__done" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
