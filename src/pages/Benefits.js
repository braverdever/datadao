import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
const BenefitItem = ({ title, description }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <AddIcon sx={{ 
        color: 'white', 
        mr: 2, 
        fontSize: '2rem'
      }} />
      <Typography 
        variant="h4" 
        component="h2"
        sx={{ 
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="body1" 
      sx={{ 
        ml: '44px',
        fontSize: '16px',
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
          pt: '20%',
          pl: '8%',
          position: 'relative'
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

        <Box 
          sx={{ 
            position: 'absolute',
            right: '5%',
            top: '24%',
          }}
        >
          <img 
            src="/benefits.svg" 
            alt="Benefits Illustration"
            style={{
              width: '700px',
              height: 'auto'
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Benefits; 