import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";
 
function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('1');
  const [totalReservations, setTotalReservations] = useState('0');
  const reservationsPerPage = 4;
  const { user } = useAuth();
 
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/reservations.php?page=${currentPage}`,
        { withCredentials: true }
      );
      setReservations(response.data.reservations);
      setTotalReservations(response.data.totalReservations);
    } catch (error) {
      console.error(error);
      setError("Failed to load reservations.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);
 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
 
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/delete-reservation.php`,
        { id },
        { withCredentials: true }
      );
      // refresh list after deletion
      fetchReservations();
    } catch (error) {
      console.error(error);
      alert("Failed to delete reservation.");
    }
  };

    const totalPages = Math.ceil(totalReservations / reservationsPerPage);
    const goToPreviousPage = () => setCurrentPage(currentPage - 1);
    const goToNextPage = () => setCurrentPage(currentPage + 1);

    return (
    <div className="container mt-5">
      <h2 className="mb-5 ">Recent Reservations</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {isLoading ? (
          <p>Loading reservations...</p>
        ) : reservations.length ? (
          reservations.map(reservation => (
            <div className="col-md-6" key={reservation.id}>
              <div className="card mb-4 shadow-lg border-0">
                <div className="card-body">
                  <h5 className="card-title">{reservation.location}</h5>
                  <p className="card-text">Time: {reservation.time_slot}</p>
                  <p className="card-text">Booked: {reservation.is_booked ? "Yes" : "No"}</p>     
                  <Link to={`/reservation/${reservation.id}`} className="btn btn-primary text-light me-2">Read More</Link>
                   {user?.role === 'admin' && (
                    <> 
                  <Link to={`/edit/${reservation.id}`} className="btn btn-light text-dark me-2">Edit</Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    Delete
                  </button>
                  </>
                   )}
                </div>
              </div>    
            </div>    
          ))
        ) : (
          <p>No reservations available.</p>
        )}
      </div>            
      {/* Pagination Code */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mt-4">
          <li  className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link text-dark" onClick={goToPreviousPage}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${index + 1 === currentPage ? 'bg-dark' : ''}`}>
              <button className="page-link text-dark" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li  className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link text-dark" onClick={goToNextPage}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );

}

export default ReservationsList;