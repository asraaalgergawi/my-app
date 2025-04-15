import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexPage from '../../app'; // adjust path based on where you moved it
import VillagePage from '../../app/villagePage'; // if you have this component
import './index.css'; // global styles (optional)

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/village/:id" element={<VillagePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
