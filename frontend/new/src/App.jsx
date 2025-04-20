import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/logins/Register';
import Login from './components/logins/Login';
import Dashboard from './components/dashboard/Dashboard';
import Result from './components/Result/Result';
import Validate from './components/passwordCheck/Password';
import Analytics from './components/analytics/Analytics'
function App() {


  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/result" element={<Result />} />
      <Route path="/validate" element={<Validate />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  </Router>
);
}

export default App
