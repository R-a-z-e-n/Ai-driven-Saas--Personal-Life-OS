import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import * as faceapi from 'face-api.js';

const LifeOS = () => {
    const navigate = useNavigate();
    const videoRef = useRef();
    const canvasRef = useRef();
    const [journalEntry, setJournalEntry] = useState('');
    const [prediction, setPrediction] = useState('');
    const [sentiment, setSentiment] = useState('');
    const [activity, setActivity] = useState('');
    const [reminder, setReminder] = useState('');
    const [faces, setFaces] = useState([]);
    const [moodData, setMoodData] = useState({
        labels: [],
        datasets: [{
            label: 'Mood Score',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    });

    useEffect(() => {
        // Load face-api models
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models')
                ]);
                startVideo();
            } catch (error) {
                console.error('Error loading face-api models:', error);
            }
        };
        loadModels();

        // Initialize mood data
        const initialMoodData = {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Mood Score',
                data: [7, 6, 8, 7, 9],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
        setMoodData(initialMoodData);

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const analyzeFaces = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        setFaces(detections);

        // Draw detections
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceLandmarks(canvas, detections);
            faceapi.draw.drawFaceExpressions(canvas, detections);
        }
    };

    const predictNextMood = () => {
        const moodScores = moodData.datasets[0].data;
        const sum = moodScores.reduce((a, b) => a + b, 0);
        const avg = sum / moodScores.length;
        const prediction = (avg * 0.8 + Math.random() * 2).toFixed(1);
        setPrediction(`Predicted mood score: ${prediction}`);
    };

    const analyzeSentiment = () => {
        // Simple sentiment analysis based on keywords
        const text = journalEntry.toLowerCase();
        const positiveWords = ['happy', 'good', 'great', 'excellent', 'amazing'];
        const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'horrible'];

        let score = 0;
        positiveWords.forEach(word => {
            if (text.includes(word)) score++;
        });
        negativeWords.forEach(word => {
            if (text.includes(word)) score--;
        });

        setSentiment(score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral');
    };

    const suggestActivity = () => {
        const activities = [
            'Take a walk in nature',
            'Practice meditation',
            'Call a friend',
            'Read a book',
            'Try a new hobby'
        ];
        setActivity(activities[Math.floor(Math.random() * activities.length)]);
    };

    const generateReminder = () => {
        const currentHour = new Date().getHours();
        let reminderText = '';

        if (currentHour < 12) {
            reminderText = 'Remember to eat a healthy breakfast!';
        } else if (currentHour < 18) {
            reminderText = 'Take a break and stretch!';
        } else {
            reminderText = 'Wind down and prepare for rest.';
        }

        setReminder(reminderText);
    };

    const handleAnalyze = () => {
        analyzeFaces();
        predictNextMood();
        analyzeSentiment();
        suggestActivity();
        generateReminder();
    };

    return (
        <div className="lifeos-container">
            <h1>Personal Life OS</h1>
            
            <div className="journal-section">
                <h2>Journal Entry</h2>
                <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="How are you feeling today?"
                />
            </div>

            <div className="face-analysis-section">
                <h2>Face Analysis</h2>
                <div className="video-container">
                    <video ref={videoRef} autoPlay muted />
                    <canvas ref={canvasRef} />
                </div>
            </div>

            <button className="analyze-button" onClick={handleAnalyze}>
                Analyze My Day
            </button>

            <div className="results-section">
                <div className="result-item">
                    <h3>Mood Prediction</h3>
                    <p>{prediction}</p>
                </div>

                <div className="result-item">
                    <h3>Sentiment Analysis</h3>
                    <p>{sentiment}</p>
                </div>

                <div className="result-item">
                    <h3>Suggested Activity</h3>
                    <p>{activity}</p>
                </div>

                <div className="result-item">
                    <h3>Daily Reminder</h3>
                    <p>{reminder}</p>
                </div>
            </div>

            <div className="chart-section">
                <h2>Mood Trends</h2>
                <Line data={moodData} />
            </div>
        </div>
    );
};

export default LifeOS;