import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scrambleText } from '../utils/textEffects';

const FirstPageCard = ({ svgUrl, text, margin }) => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = React.useState(text);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    let interval;
    if (isHovering) {
      let progress = 0;
      interval = setInterval(() => {
        if (progress <= text.length) {
          setDisplayText(scrambleText(text, progress));
          progress += 1;
        } else {
          clearInterval(interval);
        }
      }, 50);
    } else {
      setDisplayText(text);
    }
    return () => clearInterval(interval);
  }, [isHovering, text]);

  const handleClick = () => {
    const path = text.toLowerCase().replace(' ', '-');
    setTimeout(() => {
      navigate(`/${path}`);
    }, 300);
  };

  return (
    <Box
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        width: {
          xs: '90vw',
          sm: '400px',
          md: '500px'
        },
        height: {
          xs: '100px',
          sm: '110px',
          md: '120px'
        },
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: {
          xs: '10px',
          sm: '12px',
          md: '15px'
        },
        margin: margin || 0,
        cursor: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }
      }}
    >
      <Typography
        sx={{
          color: 'white',
          fontSize: {
            xs: '24px',
            sm: '32px',
            md: '40px'
          },
          fontFamily: 'monospace'
        }}
      >
        {displayText}
      </Typography>
      <Box
        component="img"
        src={svgUrl}
        alt={text}
        sx={{
          width: {
            xs: '60px',
            sm: '80px',
            md: '100px'
          },
          height: {
            xs: '60px',
            sm: '80px',
            md: '100px'
          }
        }}
      />
    </Box>
  );
};

export default FirstPageCard;