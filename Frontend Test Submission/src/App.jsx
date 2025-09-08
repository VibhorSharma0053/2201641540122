import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './component/AppLayout.jsx';
import UrlShortenerPage from './component/UrlShortenerPage.jsx';
import StatisticsPage from './component/StatisticsPage.jsx';
import RedirectHandler from './component/RedirectHandler.jsx';


function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
      </Routes>
    </AppLayout>
  );
}

export default App;