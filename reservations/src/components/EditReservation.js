import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
 
const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [location, setLocation] = useState("");
  const [time_slot, setTimeSlot] = useState("");
  const [is_booked, setIsBooked] = useState("");
  const [image, setImage] = useState(null); 
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/reservation.php/reservation/${id}`,
          { withCredentials: true }
        );
        const reservation = res.data.data;
        setLocation(reservation.location);
        setTimeSlot(reservation.time_slot);
        setIsBooked(reservation.is_booked);
        setImage(reservation.image); // store existing image URL
      } catch (err) {
        setError("Failed to fetch reservation details.");
      }
    };
    fetchReservation();
  }, [id]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
 
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("location", location);
      formData.append("time_slot", time_slot);
      formData.append("is_booked", is_booked);
 
      if (image && typeof image !== "string") {
        // only append if it's a new uploaded file
        formData.append("image", image);
      }
 
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/update-reservation.php`,
        formData,
        { withCredentials: true }
      );
 
      navigate(`/reservation/${id}`);
    } catch (err) {
      setError("Failed to update reservation.");
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="container mt-4 p-4 bg-light rounded shadow-lg mt-5 border-0">
      <h2 className="mb-5">Edit Reservation</h2>
      {error && <div className="alert alert-danger">{error}</div>}
 
      <form onSubmit={handleSubmit}>
        {/* Location */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="location" className="col-sm-2 col-form-label fw-semibold">
            Location
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control w-50"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter reservation location"
              required
            />
          </div>
        </div>
 
        {/* Time Slot */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="time_slot" className="col-sm-2 col-form-label fw-semibold">
            Time Slot
          </label>
          <div className="col-sm-10">
            <textarea
              className="form-control w-50"
              id="time_slot"
              rows="5"
              value={time_slot}
              onChange={(e) => setTimeSlot(e.target.value)}
              placeholder="Enter reservation time slot"
              required
            />
          </div>
        </div>
 
        {/* IsBooked */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="is_booked" className="col-sm-2 col-form-label fw-semibold">
            Booked
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control w-50"
              id="is_booked"
              value={is_booked}
              onChange={(e) => setIsBooked(e.target.value)}
              placeholder="Enter if it is booked (Yes/No)"
              required
            />
          </div>
        </div>
 
        {/* Image Upload */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="image" className="col-sm-2 col-form-label fw-semibold">
            Reservation Image
          </label>
          <div className="col-sm-10">
            <input
              type="file"
              className="form-control w-50"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && (
              <img
                src={
                  typeof image === "string"
                    ? `${process.env.REACT_APP_API_BASE_URL}/uploads/${image}` // backend path
                    : URL.createObjectURL(image)
                }
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxWidth: "150px" }}
              />
            )}
          </div>
        </div>
 
        {/* Submit Button */}
        <div className="text-end">
          <button type="submit" className="btn btn-dark" disabled={isLoading}>
            {isLoading ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving changes...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default EditReservation;