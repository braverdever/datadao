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
    <Container maxWidth={false} disableGutters>
      <Box 
        sx={{ 
          mt: 12, 
          width: '100%',
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? '1' : '0.95',
          transition: 'opacity 0.6s ease-out, scale 0.4s ease-out'
        }}
      >
        <Box 
          container
          sx={{ width: '100%', gap: 5, display: 'flex'}}
          justifyContent="center"
        >
          {cards.slice(0, 3).map((card, index) => (
              <FirstPageCard 
                svgUrl={card.svgUrl}
                text={card.text}
                key={index}
                margin={index !== 1 && '40px 0 0 0'}
              />
          ))}
        </Box>
        <Box 
          sx={{ 
            width: '100%',
            perspective: '1000px',
            '& img': {
              display: 'block',
              margin: '0 auto',
              height: '100%',
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
          sx={{ width: '100%', gap: 5, display: 'flex'}}
          justifyContent="center"
        >
          {cards.slice(3, 6).map((card, index) => (
              <FirstPageCard 
                svgUrl={card.svgUrl}
                text={card.text}
                key={index}
                margin={index === 1 && '40px 0 0 0'}
              />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 