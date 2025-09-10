import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ReservationsList()
{
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalReservations, setTotalReservations] = useState(0);
    const reservationsPerPage = 4;

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reservations.php?page=${currentPage}`,
                     { withCredentials: true });
                setReservations(response.data.reservations);
                setTotalReservations(response.data.totalReservations);
                setIsLoading(false);
            }
            catch(error) {
                console.error(error);
                setError('Failed to load reservations.');
                setIsLoading(false);
            }
         };
         fetchReservations();
    }, [currentPage]);

    const totalPages = Math.ceil(totalReservations / reservationsPerPage);
    const goToPreviousPage = () => setCurrentPage(currentPage - 1);
    const goToNextPage = () => setCurrentPage(currentPage + 1);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">All Reservations</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {isLoading ? (
                    <p>Loading reservations...</p>
                ) : reservations.length ? (
                    reservations.map(reservation => (
                        <div className="col-md-6" key={reservation.id}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{reservation.location}</h5>
                                    <p className="card-text">{reservation.time_slot}</p>
                                    <p className="card-text">{reservation.is_booked}</p>
                                    <Link to={`/reservation/${reservation.id}`} className="btn btn-primary">Read More</Link>
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
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goToPreviousPage}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goToNextPage}>Next</button>
                    </li>
                </ul>
            </nav>

        </div>
    );

}

export default ReservationsList;