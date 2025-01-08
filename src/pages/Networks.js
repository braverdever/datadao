import React from 'react';
import { Container, Typography, Box } from '@mui/material';
const Networks = () => {
  
  const networks = [
    {
      name: "Base Mainnet",
      icon: "/base.svg",
    }
  ]

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: '25%',
          pl: '18%',
          position: 'relative',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            mb: 4,
            color: 'white',
            fontSize: '48px',
            fontWeight: 600,
            letterSpacing: '1px',
            fontStyle: 'italic'
          }}
        >
          Networks
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '16px',
            color: 'rgb(255, 255, 255)',
            maxWidth: '550px',
            lineHeight: 1.4,
            letterSpacing: '0.5px',
            whiteSpace: 'pre-line'
          }}
        >
          {networks.map((network, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src={network.icon} alt={network.name} style={{ width: 40, height: 40, marginRight: 16 }} />
              <Typography variant="body1" sx={{ color: 'white' }}>
                {network.name}
              </Typography>
            </Box>
          ))}
        </Typography>


        <Box 
          sx={{ 
            position: 'absolute',
            right: '15%',
            top: '26%',
          }}
        >
          <img 
            src="/networks.svg" 
            alt="Benefits Illustration"
            style={{
              width: '700px',
              height: 'auto',
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Networks; 