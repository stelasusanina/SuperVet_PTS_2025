import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Vets from './pages/Vets';
import VetDetailsWithReviews from './pages/VetDetailsWithReviews';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Vets />} />
          <Route path="/vets/:id" element={<VetDetailsWithReviews />} />
        </Routes>
    </Router>
  );
}

export default App;
