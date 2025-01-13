import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { convertToUSDFromWei } from '../utils/convert';
import { useNavigate } from 'react-router-dom';
import { formatTimeAgo } from '../utils/time';

const DashboardCard = ({ data }) => {
  const [dailyReward, setDailyReward] = useState('N/A');
  const navigate = useNavigate();

  useEffect(() => {
    const calculateDailyReward = async () => {
      const weiValue = data.submissionReward;

      // Calculate submissions per day (86400 seconds in a day)
      const submissionsPerDay = Math.floor(86400 / data.updateCoolDown);
      // Get USD value and multiply by submissions per day
      const usdValue = await convertToUSDFromWei(weiValue);

      if (usdValue !== 'N/A') {
        const dailyTotal = usdValue * submissionsPerDay;
        setDailyReward(dailyTotal);
      }
    };

    calculateDailyReward();
  }, [data.submissionReward, data.cooldownTime, data.updateCoolDown]);

  const handleCardClick = () => {
    navigate('/run-and-earn', { state: { apiInfo: data } });
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        border: '2px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        width: '100%',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        }
      }}
    >
      <Box sx={{ fontSize: '20px', fontWeight: 'bold', mb: 1 }}>
        {data.name}
      </Box>
      <Box sx={{ 
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px',
        mb: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {data.url}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ color: '#ffffff' }}>
          Earn ${dailyReward === 'N/A' ? 'N/A' : dailyReward.toFixed(2)} per day
        </Box>
        <Box sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          {formatTimeAgo(data.lastSubmissionTime) === 'Not available' ? 'Not Submitted' : formatTimeAgo(data.lastSubmissionTime)}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardCard; 