import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  Button,
  CircularProgress,
  Container,
  InputAdornment
} from '@mui/material';
import { Web3 } from 'web3';
import DaoABI from "../constants/DataFeedDAO.json";
import config from "../constants/config.json";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { convertToUSDFromWei } from "../utils/convert";
import { useLocation, useNavigate } from 'react-router-dom';

const Deposit = () => {
  const location = useLocation();
  const apiInfo = location.state?.apiInfo;
  const navigate = useNavigate();

  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usdValue, setUsdValue] = useState('');
  const contractAddress = config.networks["base-mainnet"].contractAddress;

  useEffect(() => {
    if (!apiInfo) {
      navigate('/dao-list');
      toast.error('Invalid access. Please select a DAO to deposit.');
    }
  }, [apiInfo, navigate]);

  const handleAmountChange = async (event) => {
    const value = event.target.value;
    setDepositAmount(value);
    
    if (value) {
      const usdAmount = await convertToUSDFromWei(value * 1e9, 2);
      if (usdAmount !== "N/A") {
        setUsdValue(`$${usdAmount} USD`);
      } else {
        setUsdValue('');
      }
    } else {
      setUsdValue('');
    }
  };

  const deposit = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      const walletInstance = new Web3(window.ethereum);
      const contract = new walletInstance.eth.Contract(
        DaoABI.abi,
        contractAddress
      );
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + Number(config.networks["base-mainnet"].chainId).toString(16) }]
        });
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await contract.methods.depositFund(apiInfo.url).send({ 
          from: accounts[0], 
          value: depositAmount * 1e9 
        });
        toast.success('Deposit was successful.');
      } catch (error) {
        toast.error('Deposit failed.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning('Please install metamask.');
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box 
        sx={{ 
          minHeight: '100%',
          pt: '25%',
          pl: '8%',
          position: 'relative',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            mb: 6,
            color: 'white',
            fontSize: '48px',
            fontWeight: 600,
            letterSpacing: '1px',
            fontStyle: 'italic'
          }}
        >
          Deposit to {apiInfo?.name}
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 4,
            maxWidth: '600px'
          }}
        >
          {apiInfo?.description}
        </Typography>

        <Box sx={{ maxWidth: '600px' }}>
          <TextField
            fullWidth
            value={depositAmount}
            onChange={handleAmountChange}
            placeholder="Enter amount in Gwei"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ color: 'white !important' }}>
                  {usdValue ? `Gwei (${usdValue})` : 'Gwei'}
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                '& .css-ctjqxx-MuiTypography-root': {
                  color: "white"
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                }
              }
            }}
            sx={{ mb: 4 }}
          />

          <Button
            variant="contained"
            onClick={deposit}
            disabled={isLoading || !depositAmount}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '0px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              float: 'right',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Deposit'
            )}
          </Button>
        </Box>

        <Box 
          sx={{ 
            position: 'absolute',
            right: '15%',
            top: '36%',
          }}
        >
          <img 
            src="/deposit_bitcoin.svg" 
            alt="Deposit Illustration"
            style={{
              width: '500px',
              height: 'auto',
            }}
          />
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Deposit;
