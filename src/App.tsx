import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Registration from './Registration';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Registration />} />
    </Routes>
  );
}
