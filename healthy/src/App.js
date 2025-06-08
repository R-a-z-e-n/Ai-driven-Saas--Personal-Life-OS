import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import our components (we'll create these next)
import Login from './components/Login';
import Signup from './components/Signup';
import Auth3Factor from './components/Auth3Factor';
import LifeOS from './components/LifeOS';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth" element={<Auth3Factor />} />
          <Route path="/dashboard" element={<LifeOS />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
