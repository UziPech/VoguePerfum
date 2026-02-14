import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, token } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated || !token) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
