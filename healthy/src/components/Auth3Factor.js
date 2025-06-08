import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Auth3Factor() {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [secret, setSecret] = useState('');
    const [fingerprintVerified, setFingerprintVerified] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const sendOTP = async () => {
        try {
            const response = await axios.post('http://localhost:3000/generate-otp', {
                email: localStorage.getItem('userEmail') // Get email from storage
            });
            setSecret(response.data.secret);
            setOtpSent(true);
            setError('');
        } catch (error) {
            setError('Failed to send OTP');
        }
    };

    const verifyOTP = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verify-otp', {
                secret,
                otp
            });

            if (response.data.verified) {
                setError('');
                return true;
            } else {
                setError('Invalid OTP');
                return false;
            }
        } catch (error) {
            setError('OTP verification failed');
            return false;
        }
    };

    const simulateFingerprint = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verify-fingerprint');
            if (response.data.verified) {
                setFingerprintVerified(true);
                setError('');
                return true;
            } else {
                setError('Fingerprint verification failed');
                return false;
            }
        } catch (error) {
            setError('Fingerprint verification failed');
            return false;
        }
    };

    const handleAuthentication = async () => {
        if (!otpSent) {
            await sendOTP();
            return;
        }

        const otpValid = await verifyOTP();
        if (!otpValid) return;

        const fingerprintValid = await simulateFingerprint();
        if (fingerprintValid) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>3-Factor Authentication</h2>
                {error && <div className="error-message">{error}</div>}
                
                <div className="auth-steps">
                    <div className="step">
                        <h3>Step 1: OTP Verification</h3>
                        {!otpSent ? (
                            <button onClick={sendOTP} className="auth-button">
                                Send OTP
                            </button>
                        ) : (
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button onClick={verifyOTP} className="auth-button">
                                    Verify OTP
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="step">
                        <h3>Step 2: Fingerprint Verification</h3>
                        <button 
                            onClick={simulateFingerprint} 
                            className={`auth-button ${fingerprintVerified ? 'verified' : ''}`}
                            disabled={!otpSent}
                        >
                            Simulate Fingerprint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth3Factor;