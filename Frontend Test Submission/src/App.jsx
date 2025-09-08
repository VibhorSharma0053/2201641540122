import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Route>
      <Route path="/:shortCode" element={<RedirectPage />} />
    </Routes>
  );
}

export default App;