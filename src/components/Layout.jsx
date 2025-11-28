import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => (
  // The background styling is now handled by individual pages like Index.jsx
  // This div acts as a simple container.
  <div>
    <Navbar />
    <main><Outlet /></main> {/* Outlet will render the current page component */}
  </div>
);

export default Layout;