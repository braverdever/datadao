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
        width: '500px',
        height: '120px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        margin: margin || 0,
        cursor: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '& img': {
            animation: 'float 2s ease-in-out infinite'
          }
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
      }}
    >
        <Typography
            sx={{
                color: 'white',
                fontSize: '40px',
                fontFamily: 'monospace',
            }}
        >
            {displayText}
        </Typography>
        <img
            src={svgUrl}
            alt={text}
            style={{
            width: '100px',
            height: '100px'
            }}
        />
    </Box>
  );
};

export default FirstPageCard;