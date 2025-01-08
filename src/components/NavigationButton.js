import React from 'react';
import { Button, Box } from '@mui/material';
import { scrambleText } from '../utils/textEffects';

const NavigationButton = ({ text, onClick, customPosition }) => {
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

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 1000,
      padding: '10px 20px',
    };

    return {
      ...baseStyles,
      ...customPosition,
    };
  };

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        ...getPositionStyles(),
        color: 'white',
        border: 'none',
        borderRadius: 0,
        backgroundColor: 'transparent',
        textTransform: 'none',
        fontSize: '16px',
        width: '120px',
        height: '40px',
        position: 'absolute',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '10px',
          height: '10px',
          borderColor: 'white',
          borderStyle: 'solid',
        },
        '&::before': {
          top: 0,
          left: 0,
          borderWidth: '2px 0 0 2px',
        },
        '&::after': {
          top: 0,
          right: 0,
          borderWidth: '2px 2px 0 0',
        },
        '& > .bottom-left, & > .bottom-right': {
          content: '""',
          position: 'absolute',
          width: '10px',
          height: '10px',
          borderColor: 'white',
          borderStyle: 'solid',
        },
        '& > .bottom-left': {
          bottom: 0,
          left: 0,
          borderWidth: '0 0 2px 2px',
        },
        '& > .bottom-right': {
          bottom: 0,
          right: 0,
          borderWidth: '0 2px 2px 0',
        },
        '&:hover': {
          backgroundColor: 'transparent',
          '&::before, &::after, & > .bottom-left, & > .bottom-right': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {displayText}
      </Box>
      <span className="bottom-left" />
      <span className="bottom-right" />
    </Button>
  );
};

export default NavigationButton; 