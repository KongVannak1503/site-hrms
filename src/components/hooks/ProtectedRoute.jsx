import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LanguageContext } from '../Translate/LanguageContext';
import hasPermission from './hasPermission';

const ProtectedRoute = ({ requiredRoute, requiredAction, children }) => {
    const { accessToken, loading } = useContext(LanguageContext);

    if (loading) {
        return <div>Loading...</div>;
    }


    if (!hasPermission(accessToken, requiredRoute, requiredAction)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
