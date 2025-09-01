import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateReservation() {

    const [location, setLocation] = useState('');
    const [time_slot, setTimeSlot] = useState('');
    const [is_booked, setIsBooked] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Validation function
    const validateForm = () => {
        if (!location.trim() || !time_slot.trim() || !is_booked.trim())
        {
            setError("Please fill in all the fields.");
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // reset error message on a new frorm submission

        if (!validateForm())
        {
            return;
        }

        setIsLoading(true);

        try
        {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/create-reservation.php`, {
                location,
                time_slot,
                is_booked
            });
            console.log(response.data);
            navigate('/');
        }
        catch (error)
        {
            console.error(error);
            setError('Failed to create reservation. Please try again later.');
            setIsLoading(false);
        }
    }

    return(
        <div className="container mt-4">
            <h2>Create a New Reservation</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="time_slot" className="form-label">
                        Time Slot
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="time_slot"
                        onChange={(e) => setTimeSlot(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="is_booked" className="form-label">
                        IsBooked
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="is_booked"
                        onChange={(e) => setIsBooked(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Creating reservation...</span> : 'Create Reservation'}
                </button>
            </form>
        </div>
    );
}

export default CreateReservation;