import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Reservation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/ReactApp2/reservation_server/api/reservation.php/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched reservation data:", data);
        if (data.status === "success") {
          setReservation(data.data);  // <-- Only set the nested data object
        } else {
          console.error(data.message);
          setReservation(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setReservation(null);
      });
  }, [id]);

  if (!reservation) return <p>Loading...</p>;

  return (
    <div>
      <h2>{reservation.location}</h2>
      <p>Time: {reservation.time_slot}</p>
      <p>Booked: {reservation.is_booked}</p>
    </div>
  );
}

export default Reservation;
