import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { useAuthStore } from '../../store/authStore';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleLoginSuccess = (token: string, username: string, role: string, id: number) => {
        setAuth(token, { id, username, fullName: username, role });
        navigate('/'); // Redirect to dashboard/home after login
    };

    return (
        <div className="login-page">
            <LoginForm onSuccess={handleLoginSuccess} />
        </div>
    );
};

export default LoginPage;
