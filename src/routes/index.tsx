import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../components/Layout/AuthLayout';
import MainLayout from '../components/Layout/MainLayout';
import { LoginPage } from '../features/auth';
import { DashboardPage } from '../features/dashboard';
import { CreateTemplatePage, TemplateDetailPage } from '../features/templates';
import { FillFormPage, EditSubmissionPage, EmployeeSubmissionDetailPage } from '../features/submissions';
import { SubmissionDetailPage } from '../features/approvals';
import { ProfilePage } from '../features/profile';
import { UserManagementPage, UserDetailPage } from '../features/users';
import { useAuthStore } from '../store/authStore';
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
                element: <ProfilePage />,
            },
            {
                path: 'users',
                element: <UserManagementPage />,
            },
            {
                path: 'users/:id',
                element: <UserDetailPage />,
            },
            {
                path: 'templates/create',
                element: <CreateTemplatePage />,
            },
            {
                path: 'templates/:id',
                element: <TemplateDetailPage />,
            },
            {
                path: 'submissions/use/:id',
                element: <FillFormPage />,
            },
            {
                path: 'submissions/edit/:id',
                element: <EditSubmissionPage />,
            },
            {
                path: 'submissions/approve/:id',
                element: <SubmissionDetailPage />,
            },
            {
                path: 'submissions/detail/:id',
                element: <EmployeeSubmissionDetailPage />,
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
