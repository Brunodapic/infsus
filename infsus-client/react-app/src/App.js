import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Breakdowns from './pages/Breakdowns';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Breakdowns />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
