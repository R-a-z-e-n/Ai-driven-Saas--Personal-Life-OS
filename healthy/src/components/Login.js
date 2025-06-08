import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // First, verify credentials (you'll need to implement this endpoint)
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            });

            if (response.data.success) {
                // If login is successful, redirect to 3-factor authentication
                navigate('/auth');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p>Don't have an account? <span onClick={() => navigate('/signup')} className="signup-link">Sign up</span></p>
            </div>
        </div>
    );
}

export default Login;