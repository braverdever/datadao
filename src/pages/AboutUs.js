import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutUs = () => {
  
  const aboutUs = {
    title: "About DataDAO",
    description: "Data DAOs are the first DAOs that are truly Decentralized, Autonomous Organizations. \n\n \
      Anyone can spin up a Data DAO to collect data or bring data feeds on chain. \n\n \
      Anyone can fund the Data DAO to keep it active. \n\n \
      Anyone with a computer can contribute data by running a simple script on their computer. \n\n \
      This script is powered by Reclaim Protocol's zkTLS. \n\n \
      Anyone who contributes data onchain is paid out automatically by the smart contract. \
      Incentives and collaboration at the scale of the internet."
  };

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: '15%',
          pl: '8%',
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
          {aboutUs.title}
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
          {aboutUs.description}
        </Typography>


        <Box 
          sx={{ 
            position: 'absolute',
            right: '5%',
            top: '26%',
          }}
        >
          <img 
            src="/about_us.svg" 
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

export default AboutUs; 