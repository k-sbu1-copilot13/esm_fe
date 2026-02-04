import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import { DashboardPage } from '../features/dashboard';
import { useAuthStore } from '../stores/authStore';
import React from 'react';

// Component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'submissions',
                element: <div style={{ padding: 24 }}><h2>My Submissions Page (Under Development)</h2></div>,
            },
            {
                path: 'profile',
                element: <div style={{ padding: 24 }}><h2>Profile Page (Under Development)</h2></div>,
            },
            {
                path: 'settings',
                element: <div style={{ padding: 24 }}><h2>Settings Page (Under Development)</h2></div>,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
]);
