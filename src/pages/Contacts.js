import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
const Contacts = () => {
  
  const networks = [
    {
      icon: "/sms.svg",
      link: "mailto:founders@reclaimprotocol.org",
      description: "founders@reclaimprotocol.org"
    },
    {
      icon: "/telegram.svg",
      link: "https://t.me/protocolreclaim",
      description: "https://t.me/protocolreclaim"
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
          Contacts
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
              <Link href={network.link} variant="body1" sx={{ color: 'white' }}>
                {network.description}
              </Link>
            </Box>
          ))}
        </Typography>


        <Box 
          sx={{ 
            position: 'absolute',
            right: '20%',
            top: '36%',
          }}
        >
          <img 
            src="/contacts.svg" 
            alt="Benefits Illustration"
            style={{
              width: '500px',
              height: 'auto',
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Contacts; 