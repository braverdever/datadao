import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
const BenefitItem = ({ title, description }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 1.5,
      flexWrap: 'wrap' 
    }}>
      <AddIcon sx={{ 
        color: 'white', 
        mr: 2, 
        fontSize: { xs: '1.5rem', md: '2rem' }
      }} />
      <Typography 
        variant="h4" 
        component="h2"
        sx={{ 
          color: 'white',
          fontWeight: 'bold',
          fontSize: { xs: '20px', md: '24px' },
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="body1" 
      sx={{ 
        ml: { xs: '32px', md: '44px' },
        fontSize: { xs: '14px', md: '16px' },
        color: 'rgb(255, 255, 255)',
        maxWidth: '500px',
        lineHeight: 1.6
      }}
    >
      {description}
    </Typography>
  </Box>
);

const Benefits = () => {
  
  const benefits = [
    {
      title: "Decentralized Data Collection",
      description: "Anybody can contribute data to this data DAO without being censored. This is a fool proof way to keep the data collection, without being possible to shut down."
    },
    {
      title: "Earn Passive Income",
      description: "You can earn passive income by providing data to data daos, by running a simple script on your computer that can keep running in the background as you work, or even as you are asleep!"
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: { xs: '20%', md: '10%' },
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
            Benefits
          </Typography>
          
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} key={index}>
                <BenefitItem 
                  title={benefit.title} 
                  description={benefit.description}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ 
          flex: { xs: '1', md: '3' },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <img 
            src="/benefits.svg" 
            alt="Benefits Illustration"
            style={{
              width: '80%',
              maxWidth: '500px',
              height: '100%',
              minHeight: '32vh',
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Benefits; 