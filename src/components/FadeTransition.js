import React from 'react';
import { Box } from '@mui/material';

const FadeTransition = ({ children, isVisible }) => {
  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
        transition: 'opacity 0.4s ease-out, transform 4s ease-out',
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </Box>
  );
};

export default FadeTransition; 