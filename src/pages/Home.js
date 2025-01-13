import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import FirstPageCard from '../components/FirstPageCard';
import { useVisibility } from '../hooks/useVisibility';
import { useNavigate } from 'react-router-dom';
import { scrambleText } from '../utils/textEffects.js';

const Home = () => {
  const isVisible = useVisibility();
  const navigate = useNavigate();
  const [displayText, setDisplayText] = React.useState("See All Data Daos");
  const [isHovering, setIsHovering] = React.useState(false);
  
  const cards = [
    { text: 'about', svgUrl: '/about_us.svg' },
    { text: 'transactions', svgUrl: '/transactions.svg' }
  ];

  React.useEffect(() => {
    let interval;
    if (isHovering) {
      let progress = 0;
      interval = setInterval(() => {
        if (progress <= "See All Data Daos".length) {
          setDisplayText(scrambleText("See All Data Daos", progress));
          progress += 1;
        } else {
          clearInterval(interval);
        }
      }, 50);
    } else {
      setDisplayText("See All Data Daos");
    }
    return () => clearInterval(interval);
  }, [isHovering]);

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
          mt: { xs: 2, sm: 4, md: 4 },
          pb: { xs: 2, sm: 4, md: 4 },
          width: '100%',
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? '1' : '0.95',
          transition: 'opacity 0.6s ease-out, scale 0.4s ease-out',
          px: { xs: 2, sm: 4, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            perspective: '1000px',
            order: { xs: 0, md: 0 },
            mb: { xs: 4, md: 0 },
            '& img': {
              display: 'block',
              margin: '0 auto',
              width: { xs: '90%', sm: '80%', md: '70%' },
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              maxWidth: { xs: '100%', sm: '50%' },
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
          onClick={() => navigate('/dao-list')}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          sx={{
            order: { xs: 1, md: 0 },
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            width: { xs: '100%', sm: '60%' },
            mx: 'auto',
            p: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <img
            src="/daolist.svg"
            alt="See All Data Daos"
            style={{
              width: "10%",
              marginBottom: 8
            }}
          />
          <Typography 
            variant="button" 
            sx={{ 
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'monospace'
            }}
          >
            {displayText}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 1,
              textAlign: 'center'
            }}
          >
            Explore opportunities to start earning
          </Typography>
        </Box>

        <Box 
          sx={{ 
            width: '100%', 
            gap: { xs: 2, sm: 3, md: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4
          }}
        >
          {cards.map((card, index) => (
            <FirstPageCard 
              key={index}
              svgUrl={card.svgUrl}
              text={card.text}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 