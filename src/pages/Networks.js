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
          pt: { xs: '20%', md: '15%' },
          pl: { xs: '4%', md: '18%' },
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Box sx={{ flex: 1, margin: 'auto', }}>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              mb: 4,
              color: 'white',
              fontSize: { xs: '32px', md: '48px' },
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
              fontSize: { xs: '14px', md: '16px' },
              color: 'rgb(255, 255, 255)',
              maxWidth: '550px',
              lineHeight: 1.4,
              letterSpacing: '0.5px',
              whiteSpace: 'pre-line'
            }}
          >
            {networks.map((network, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: 'wrap'
              }}>
                <img src={network.icon} alt={network.name} style={{ 
                  width: 40, 
                  height: 40, 
                  marginRight: 16 
                }} />
                <Typography variant="body1" sx={{ 
                  color: 'white',
                  fontSize: { xs: '14px', md: '16px' }
                }}>
                  {network.name}
                </Typography>
              </Box>
            ))}
          </Typography>
        </Box>

        <Box 
          sx={{
            flex: 3,
            right: { xs: 'auto', md: '15%' },
            top: { xs: 'auto', md: '26%' },
            width: { xs: '100%', md: 'auto' },
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <img 
            src="/networks.svg" 
            alt="Networks Illustration"
            style={{
              width: '80%',
              maxWidth: '500px',
              height: 'auto',
              minHeight: '35vh',
              opacity: '0.5'
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Networks; 