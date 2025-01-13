import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUs = () => {
  
  const aboutUs = {
    title: "About DataDAO",
    description: "Data DAOs are the first DAOs that are truly Decentralized, Autonomous Organizations. \n\nAnyone can spin up a Data DAO to collect data or bring data feeds on chain. \n\nAnyone can fund the Data DAO to keep it active. \n\nAnyone with a computer can contribute data by running a simple script on their computer. \n\nThis script is powered by Reclaim Protocol's zkTLS. \n\nAnyone who contributes data onchain is paid out automatically by the smart contract. \n\nIncentives and collaboration at the scale of the internet."
  };

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: { xs: '15%', md: '12%' },
          pl: { xs: '8%', md: '8%' },
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Box sx={{ flex: 2 }}>
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
            {aboutUs.title}
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
            {aboutUs.description}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            right: { xs: 'auto', md: '5%' },
            top: { xs: 'auto', md: '26%' },
            width: { xs: '100%', md: 'auto' },
            textAlign: { xs: 'center', md: 'left' },
            flex: 3
          }}
        >
          <img 
            src="/about_us.svg" 
            alt="About Us Illustration"
            style={{
              width: '80%',
              maxWidth: '600px',
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

export default AboutUs; 