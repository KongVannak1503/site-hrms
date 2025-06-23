// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, user } = useAuth();

    if (!token) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Logged in, but role is not allowed
        return <Navigate to="/unauthorized" replace />;
    }

    // Everything is okay, render the route
    return <Outlet />;
};

export default ProtectedRoute;
