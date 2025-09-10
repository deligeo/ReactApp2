import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import './App.css';
import Navbar from './components/Navbar';
import CreateReservation from './components/CreateReservation';
import ReservationList from './components/ReservationList';
import Reservation from './components/Reservation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes include Navbar */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />   {/* ✅ Only logged-in users see it */}
                  <ReservationList />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Reservation />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CreateReservation />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;