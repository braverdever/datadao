import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Web3 } from 'web3';
import DaoABI from "../constants/DataFeedDAO.json";
import config from "../constants/config.json";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { convertToUSDFromWei } from "../utils/convert.js";

const RegisterForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const contractAddress = config.networks["base-mainnet"].contractAddress;
  const web3Instance = new Web3(window.ethereum);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    submissionReward: '',
    updateCoolDown: '',
    dataFreshnessWindow: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = React.useRef(null);
  const [submissionRewardInUSD, setSubmissionRewardInUSD] = useState("");

  useEffect(() => {
    const convertToUSD = async () => {
      if (!formData.submissionReward) {
        setSubmissionRewardInUSD("");
        return;
      }
      const rewardInUSD = await convertToUSDFromWei(formData.submissionReward * 1e9, 2);
      if (rewardInUSD === "N/A")
        setSubmissionRewardInUSD("");
      else
        setSubmissionRewardInUSD(`$${rewardInUSD} in USD`);
    }
    convertToUSD();
  }, [formData.submissionReward]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleNext();
    }
  };

  const steps = [
    {
      title: "What's your DAO name?",
      field: 'name',
      placeholder: 'Enter DAO name',
      type: 'text'
    },
    {
      title: 'What API do you want to track?',
      field: 'url',
      placeholder: 'Enter API URL',
      type: 'text'
    },
    {
      title: 'Describe your DAO',
      field: 'description',
      placeholder: 'Enter description',
      type: 'textarea'
    },
    {
      title: 'Set submission reward',
      field: 'submissionReward',
      placeholder: 'Enter reward in Gwei',
      type: 'number',
      endAdornment: 'Gwei'
    },
    {
      title: 'Set cooldown period',
      field: 'updateCoolDown',
      placeholder: 'Enter period in seconds',
      type: 'number',
      endAdornment: 'Sec'
    },
    {
      title: 'Set data freshness window',
      field: 'dataFreshnessWindow',
      placeholder: 'Enter window in seconds',
      type: 'number',
      endAdornment: 'Sec'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (formData.name === "" || formData.url === "" || formData.updateCoolDown === "") {
      toast.error('Please check your inputs.');
      return;
    }
    
    setLoading(true);
    try {
      const contractABI = DaoABI.abi;
      const contract = new web3Instance.eth.Contract(
        contractABI,
        contractAddress
      );

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const params = [
        formData.name,
        formData.description,
        formData.url,
        parseInt(formData.updateCoolDown, 10),
        parseInt(formData.submissionReward * 1e9, 10),
        parseInt(formData.dataFreshnessWindow, 10),
      ];

      await contract.methods.registerAPI(...params).send({
        from: accounts[0],
      });
      
      toast.success('Registration was successful.');
      setTimeout(() => navigate("/dao-list"), 3000);
      
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100%',
        pt: { xs: '25%', sm: '20%', md: '15%' },
        pl: { xs: '5%', sm: '10%', md: '18%' },
        pr: { xs: '5%', sm: '10%', md: '0' },
        position: 'relative',
      }}
    >
      <Typography 
        variant="h2" 
        component="h1"
        sx={{ 
          mb: { xs: 3, sm: 4, md: 6 },
          color: 'white',
          fontSize: { xs: '32px', sm: '40px', md: '48px' },
          fontWeight: 600,
          letterSpacing: '1px',
          fontStyle: 'italic'
        }}
      >
        Create New DataDAO
      </Typography>

      <Box sx={{ 
        maxWidth: { xs: '100%', sm: '500px', md: '600px' }
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white',
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: '20px', sm: '22px', md: '24px' }
          }}
        >
          {steps[currentStep].title}
        </Typography>

        <TextField
          inputRef={inputRef}
          fullWidth
          value={formData[steps[currentStep].field]}
          onChange={handleInputChange(steps[currentStep].field)}
          onKeyPress={handleKeyPress}
          placeholder={steps[currentStep].placeholder}
          multiline={steps[currentStep].type === 'textarea'}
          rows={steps[currentStep].type === 'textarea' ? 4 : 1}
          type={steps[currentStep].type}
          InputProps={{
            endAdornment: steps[currentStep].endAdornment && (
              <InputAdornment position="end" sx={{ color: 'white !important' }}>
                {steps[currentStep].field === 'submissionReward' && submissionRewardInUSD ? 
                  `${steps[currentStep].endAdornment} (${submissionRewardInUSD})` :
                  steps[currentStep].endAdornment
                }
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
          sx={{ mb: { xs: 3, sm: 3.5, md: 4 } }}
        />

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            borderRadius: '0px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            float: 'right',
            padding: { xs: '6px 16px', sm: '8px 20px', md: '8px 24px' },
            fontSize: { xs: '14px', sm: '15px', md: '16px' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            currentStep === steps.length - 1 ? 'Create DAO' : 'Next'
          )}
        </Button>
      </Box>

      <Box 
        sx={{ 
          position: { xs: 'static', md: 'fixed' },
          right: { md: '20%' },
          top: { md: '23%' },
          mt: { xs: 8, sm: 10, md: 0 },
          textAlign: { xs: 'center', md: 'left' },
          zIndex: -1
        }}
      >
        <img 
          src="/register.svg" 
          alt="DAO Illustration"
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            display: isMobile ? 'none' : 'block',
            opacity: 0.5
          }}
        />
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default RegisterForm; 