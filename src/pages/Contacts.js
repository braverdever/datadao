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
          pt: { xs: '20%', md: '15%' },
          pl: { xs: '4%', md: '18%' },
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Box sx={{ flex: 2, margin: 'auto' }}>
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
            Contacts
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
                <Link 
                  href={network.link} 
                  variant="body1" 
                  sx={{ 
                    color: 'white',
                    fontSize: { xs: '14px', md: '16px' }
                  }}
                >
                  {network.description}
                </Link>
              </Box>
            ))}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            flex: 3,
            right: { xs: 'auto', md: '20%' },
            top: { xs: 'auto', md: '36%' },
            width: { xs: '100%', md: 'auto' },
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <img 
            src="/contacts.svg" 
            alt="Contacts Illustration"
            style={{
              width: '80%',
              maxWidth: '500px',
              height: 'auto',
              minHeight: '35vh'
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Contacts; 