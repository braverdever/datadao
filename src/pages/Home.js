import React from 'react';
import { Container, Box } from '@mui/material';
import FirstPageCard from '../components/FirstPageCard';
import { useVisibility } from '../hooks/useVisibility';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const isVisible = useVisibility();
  const navigate = useNavigate();
  
  const cards = [
    { text: 'benefits', svgUrl: '/benefits.svg' },
    { text: 'about', svgUrl: '/about_us.svg' },
    { text: 'transactions', svgUrl: '/transactions.svg' },
    { text: 'networks', svgUrl: '/networks.svg' },
    { text: 'dao list', svgUrl: '/daolist.svg' },
    { text: 'contacts', svgUrl: '/contacts.svg' }
  ];

  return (
    <Container 
      maxWidth={false} 
      disableGutters
      sx={{
        maxWidth: '90% !important',
        mx: 'auto',
      }}
    >
      <Box 
        sx={{ 
          mt: { xs: 4, sm: 8, md: 8 },
          pb: { xs: 2, sm: 4, md: 4 },
          width: '100%',
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? '1' : '0.95',
          transition: 'opacity 0.6s ease-out, scale 0.4s ease-out',
          px: { xs: 2, sm: 4, md: 0 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'column' }
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            perspective: '1000px',
            order: { xs: 0, md: 1 },
            mb: { xs: 4, md: 0 },
            '& img': {
              display: 'block',
              margin: '0 auto',
              width: { xs: '90%', sm: '80%', md: '70%' },
              height: 'auto',
              maxWidth: '50%',
              transition: 'transform 0.3s ease-out',
              '&:hover': {
                transform: 'rotate3d(var(--mouse-dx), var(--mouse-dy), 0, 5deg)'
              }
            }
          }} 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const dx = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            const dy = -(e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            e.currentTarget.style.setProperty('--mouse-dx', dx);
            e.currentTarget.style.setProperty('--mouse-dy', dy);
          }}
        >
          <img
            src="/datadao.png"
            alt="DataDAO"
            onClick={() => navigate('/dao-list')}
          />
        </Box>

        <Box 
          container
          sx={{ 
            width: '100%', 
            gap: { xs: 2, sm: 3, md: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            order: { xs: 1, md: 0 }
          }}
          justifyContent="center"
        >
          {cards.slice(0, 3).map((card, index) => (
              <FirstPageCard 
                svgUrl={card.svgUrl}
                text={card.text}
                key={index}
                margin={{ xs: 0, md: index !== 1 ? '40px 0 0 0' : 0 }}
              />
          ))}
        </Box>

        <Box 
          container  
          sx={{ 
            width: '100%', 
            gap: { xs: 2, sm: 3, md: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            order: { xs: 2, md: 2 }
          }}
          justifyContent="center"
        >
          {cards.slice(3, 6).map((card, index) => (
              <FirstPageCard 
                svgUrl={card.svgUrl}
                text={card.text}
                key={index}
                margin={{ xs: 0, md: index === 1 ? '40px 0 0 0' : 0 }}
              />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 