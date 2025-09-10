import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateReservation() {

    // 'location' => $reservation['location'],
        // 'time_slot' => $reservation['time_slot'],
        // 'is_booked

    const [location, setLocation] = useState('');
    const [time_slot, setTimeSlot] = useState('');
    const [is_booked, setIsBooked] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Validation
    const validateForm = () => {
        if (!location.trim() || !time_slot.trim() || !is_booked.trim()) {
            setError("Please fill in all the fields.");
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('location', location);
            formData.append('time_slot', time_slot);
            formData.append('is_booked', is_booked);
            if (image) formData.append('image', image);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/create-reservation.php`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            console.log(response.data);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to create reservation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mt-4">
            <h2>Create a New Reservation</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" onChange={e => setLocation(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Time Slot</label>
                    <input type="text" className="form-control" onChange={e => setTimeSlot(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Booking</label>
                    <input type="text" className="form-control" onChange={e => setIsBooked(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Author Image</label>
                    <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Creating reservation...' : 'Create Reservation'}
                </button>
            </form>
        </div>
    );
}

export default CreateReservation;