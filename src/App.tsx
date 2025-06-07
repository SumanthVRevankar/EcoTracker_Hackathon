import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChallengeProvider } from './contexts/ChallengeContext';
import { AIInsightsProvider } from './contexts/AIInsightsContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Calculator from './pages/Calculator';
import Community from './pages/Community';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Weather from './pages/Weather';
import Challenges from './pages/Challenges';
import Insights from './pages/Insights';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          <ChallengeProvider>
            <AIInsightsProvider>
              <Router>
                <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/insights" element={<Insights />} />
                  </Routes>
                </div>
              </Router>
            </AIInsightsProvider>
          </ChallengeProvider>
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;