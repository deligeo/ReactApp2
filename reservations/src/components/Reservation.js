import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Reservation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null); // Optional: for better error feedback

  useEffect(() => {
    fetch(`http://localhost/ReactApp2/reservation_server/api/reservation.php/${id}`, {
      method: 'GET',
      credentials: 'include'  // ✅ Include session cookies for PHP
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reservation data:", data);
        if (data.status === "success") {
          setReservation(data.data);  // ✅ Use only the nested data object
        } else {
          console.error(data.message);
          setError(data.message || "Failed to fetch reservation.");
          setReservation(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred while fetching the reservation.");
        setReservation(null);
      });
  }, [id]);

  if (error) {
    return <p className="text-danger text-center mt-5">{error}</p>;
  }

  if (!reservation) {
    return <p className="text-center mt-5">Loading reservation...</p>;
  }

  return (
    <div className="container my-5 text-center">
      <h1 className="mb-3">{reservation.location}</h1>

      <div className="d-flex justify-content-center mb-2">
        <small className="text-muted">
          Time: {reservation.time_slot} | Booked: {reservation.is_booked ? "Yes" : "No"}
        </small>
      </div>

      <hr />

      <p className="mt-5">{reservation.content}</p>

      {reservation.imageName && (
        <div className="d-flex justify-content-center my-4">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${reservation.imageName}`}
            alt={reservation.location}
            className="img"
            style={{ maxWidth: "150px", maxHeight: "150px" }}
          />
        </div>
      )}
    </div>
  );
}

export default Reservation;