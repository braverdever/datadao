import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div className="grid-overlay" />
      <RouterLink to="/" className="logo-container" style={{ width: 'max-content', textDecoration: 'none' }}>
        <img src="/logo.svg" alt="Logo" className="logo" />
        <span className="brand-text">eclaim Protocol</span>
      </RouterLink>
      {children}
    </Box>
  );
};

export default Layout;