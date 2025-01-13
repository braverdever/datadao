import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useVisibility } from '../hooks/useVisibility';
import { fetchTransactions } from '../utils/web3';

const TransactionItem = ({ from, to, type, timestamp, hash }) => (
  <Box 
    onClick={() => window.open(`https://basescan.org/tx/${hash}`, '_blank')}
    sx={{ 
      display: 'flex',
      alignItems: 'center',
      mb: 3,
      p: 2,
      gap: 3,
      width: 'max-content',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }
    }}
  >
    <Box 
      component="img"
      src="/transaction_box.svg"
      alt="Transaction icon"
      sx={{ width: 40, height: 40, mr: 2 }}
    />
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', width: '80px' }}>
          From:
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace' }}>
          {from}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', width: '80px' }}>
          To:
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace' }}>
          {to}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', width: '80px' }}>
          Date:
        </Typography>
        <Typography variant="body2" sx={{ color: 'white' }}>
          {new Date(Number(timestamp)).toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', width: '80px' }}>
          Type:
        </Typography>
        <Typography variant="body2" sx={{ color: 'white' }}>
          {type}
        </Typography>
      </Box>
    </Box>
    <Box 
      component="img"
      src="/transaction_tick_circle.svg"
      alt="Transaction tick circle"
      sx={{ width: 40, height: 40 }}
    />
  </Box>
);

const Transactions = () => {
  const isVisible = useVisibility();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        console.log('Fetching transactions...');
        const txs = await fetchTransactions(3);
        console.log('Raw transaction data:', txs);
        setTransactions(txs);
      } catch (error) {
        console.error('Error loading transactions:', error.message, error.stack);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: { xs: '10%', md: '5%' },
          pl: { xs: '4%', md: '5%' },
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        <Box sx={{ 
          flex: 2, 
          position: 'relative',
          zIndex: 2
        }}>
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
            Latest Transactions
          </Typography>
          
          <Box sx={{ 
            maxWidth: { xs: '100%', md: '700px' },
            overflowX: { xs: 'auto', md: 'visible' }
          }}>
            {loading ? (
              <CircularProgress sx={{ 
                position: 'relative', 
                color: 'white', 
                top: '50%', 
                left: { xs: '45%', md: '20%' } 
              }} />
            ) : (
              transactions.map((tx, index) => (
                <TransactionItem 
                  key={index}
                  from={tx.from}
                  to={tx.to}
                  type={tx.type}
                  timestamp={tx.timestamp}
                  hash={tx.hash}
                />
              ))
            )}
          </Box>
        </Box>

        <Box 
          sx={{ 
            position: { xs: 'relative', md: 'absolute' },
            right: { xs: 'auto', md: '5%' },
            top: { xs: 'auto', md: '22%' },
            width: { xs: '100%', md: 'auto' },
            textAlign: { xs: 'center', md: 'left' },
            display: { xs: 'none', md: 'block' },
            zIndex: 2
          }}
        >
          <img 
            src="/transactions.svg" 
            alt="Transactions Illustration"
            style={{
              width: '100%',
              maxWidth: '700px',
              height: 'auto',
              opacity: '0.5'
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Transactions; 