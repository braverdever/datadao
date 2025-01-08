import React from 'react';
import { Box } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import NavigationButton from './NavigationButton';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationMap = {
    '/about': [
      { text: 'benefits', path: '/benefits', customPosition: { top: '55%', left: '1%' } },
      { text: 'networks', path: '/networks', customPosition: { top: '92%', left: '40%' } },
      { text: 'dao list', path: '/dao-list', customPosition: { top: '92%', left: '50%' } },
      { text: 'contacts', path: '/contacts', customPosition: { top: '92%', left: '60%' } },
      { text: 'transactions', path: '/transactions', customPosition: { top: '55%', left: '92%' } }
    ],
    '/transactions': [
      { text: 'about', path: '/about', customPosition: { top: '45%', left: '1%' } },
      { text: 'benefits', path: '/benefits', customPosition: { top: '55%', left: '1%' } },
      { text: 'networks', path: '/networks', customPosition: { top: '92%', left: '40%' } },
      { text: 'dao list', path: '/dao-list', customPosition: { top: '92%', left: '50%' } },
      { text: 'contacts', path: '/contacts', customPosition: { top: '92%', left: '60%' } },
    ],
    '/dao-list': [
        { text: 'networks', path: '/networks', customPosition: { top: '55%', left: '1%' } },
        { text: 'benefits', path: '/benefits', customPosition: { top: '4%', left: '40%' } },
        { text: 'about', path: '/about', customPosition: { top: '4%', left: '50%' } },
        { text: 'transactions', path: '/transactions', customPosition: { top: '4%', left: '60%' } },
        { text: 'contacts', path: '/contacts', customPosition: { top: '55%', left: '92%' } }
      ],
    '/networks': [
        { text: 'benefits', path: '/benefits', customPosition: { top: '4%', left: '40%' } },
        { text: 'about', path: '/about', customPosition: { top: '4%', left: '50%' } },
        { text: 'transactions', path: '/transactions', customPosition: { top: '4%', left: '60%' } },
        { text: 'dao list', path: '/dao-list', customPosition: { top: '45%', left: '92%' } },
        { text: 'contacts', path: '/contacts', customPosition: { top: '55%', left: '92%' } }
      ],
    '/benefits': [
        { text: 'networks', path: '/networks', customPosition: { top: '92%', left: '40%' } },
        { text: 'dao list', path: '/dao-list', customPosition: { top: '92%', left: '50%' } },
        { text: 'contacts', path: '/contacts', customPosition: { top: '92%', left: '60%' } },
        { text: 'about', path: '/about', customPosition: { top: '45%', left: '92%' } },
        { text: 'transactions', path: '/transactions', customPosition: { top: '55%', left: '92%' } }
      ],
    '/contacts': [
        { text: 'benefits', path: '/benefits', customPosition: { top: '4%', left: '40%' } },
        { text: 'about', path: '/about', customPosition: { top: '4%', left: '50%' } },
        { text: 'transactions', path: '/transactions', customPosition: { top: '4%', left: '60%' } },
        { text: 'networks', path: '/networks', customPosition: { top: '45%', left: '1%' } },
        { text: 'dao list', path: '/dao-list', customPosition: { top: '55%', left: '1%' } }
    ],
    '/deposit': [
        { text: 'dao list', path: '/dao-list', customPosition: { top: '60%', left: '1%' } },
        { text: 'dao list', path: '/dao-list', customPosition: { top: '4%', left: '50%' } }
    ],
    '/register': [
        { text: 'dao list', path: '/dao-list', customPosition: { top: '60%', left: '1%' } },
        { text: 'dao list', path: '/dao-list', customPosition: { top: '4%', left: '50%' } }
    ],
    '/run-and-earn': [
        { text: 'dao list', path: '/dao-list', customPosition: { top: '60%', left: '1%' } },
        { text: 'dao list', path: '/dao-list', customPosition: { top: '4%', left: '50%' } }
    ]
  };

  const currentNav = navigationMap[location.pathname] || [];

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div className="grid-overlay" />
      <RouterLink to="/" className="logo-container" style={{ width: 'max-content', textDecoration: 'none' }}>
        <img src="/logo.svg" alt="Logo" className="logo" />
        <span className="brand-text">eclaim Protocol</span>
      </RouterLink>
      {Array.isArray(currentNav) && currentNav.map((nav, index) => (
        <NavigationButton
          onClick={() => navigate(nav.path)}
          key={index}
          text={nav.text}
          to={nav.path}
          customPosition={nav.customPosition}
        />
      ))}
      {children}
    </Box>
  );
};

export default Layout;